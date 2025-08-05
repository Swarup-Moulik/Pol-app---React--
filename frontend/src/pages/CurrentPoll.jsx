import React, { useState, useEffect, useContext, useRef } from 'react';
import { PollContext } from "../context/pollContext";
import { Link, useLocation } from 'react-router-dom';
import { Users, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CurrentPoll = ({ cat }) => {
  const [filteredPolls, setFilteredPolls] = useState([]);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const [showSidebar, setShowSidebar] = useState(false);
  const { surveys, searchTerm } = useContext(PollContext);
  const location = useLocation();
  const { t } = useTranslation('polist');
  const defaultCat = location.state?.category || null;
  const focusId = location.state?.focusId;
  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((cat) => cat !== value) : [...prev, value]
    );
  };

  const applyFilterAndSort = () => {
    let result = surveys.slice();
    const today = new Date();
    result = result.filter((survey) => new Date(survey.poll?.dueDate) >= today);
    if (category.length > 0) {
      result = result.filter((survey) => category.includes(survey.poll?.category));
    }
    if (sortType === 'latest') {
      result.sort((a, b) => new Date(b.poll?.dueDate) - new Date(a.poll?.dueDate));
    } else if (sortType === 'oldest') {
      result.sort((a, b) => new Date(a.poll?.dueDate) - new Date(b.poll?.dueDate));
    }
    if (searchTerm.trim()) {
      result = result.filter((survey) =>
        survey.poll?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.poll?.desc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPolls(result);
  };

  useEffect(() => {
    applyFilterAndSort();
  }, [category, sortType, surveys]);

  useEffect(() => {
    if (defaultCat) {
      setCategory([defaultCat]);
    }
  }, [defaultCat]);
  const pollRefs = useRef({});
  return (
    <div className="flex flex-col md:grid md:grid-cols-[250px_1fr] min-h-screen relative">
      {/* Toggle Button (small screens) */}
      <button
        className="md:hidden absolute top-4 left-4 z-20 p-2 rounded-md"
        onClick={() => setShowSidebar(true)}
      >
        <Menu />
      </button>
      {/* Sidebar Overlay for Mobile */}
      <div
        className={`fixed inset-0 bg-black/40 z-10 transition-opacity duration-300 ease-in-out ${showSidebar ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setShowSidebar(false)}
      />
      {/* Sidebar */}
      <div className={`fixed md:static z-20 top-0 left-0 h-full md:h-auto w-[80%] md:w-full bg-card p-4 border-b md:border-b-0 md:border-r border-border transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Close Button (only mobile) */}
        <div className="flex justify-between items-center md:hidden mb-4">
          <h2 className="text-2xl font-semibold">{t("filters")}</h2>
          <button onClick={() => setShowSidebar(false)} className="text-primary">
            <X />
          </button>
        </div>
        <div className='flex flex-col gap-3 items-center justify-start'>
          <label className="font-medium text-lg">{t("sort_by")}</label>
          <select
            className="p-1 w-full border rounded-md bg-gray-200 text-black"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="relevant">{t("relevant")}</option>
            <option value="latest">{t("latest")}</option>
            <option value="oldest">{t("oldest")}</option>
          </select>
        </div>
        <h2 className="text-lg font-semibold mt-6">{t("categories")}</h2>
        <div className="flex flex-col gap-2 mt-3 text-md bg-foreground/50 rounded-lg p-3 text-light">
          {['sports', 'music', 'films', 'technology', 'cuisine'].map((cat) => (
            <label key={cat} className="flex gap-3 items-center">
              <input
                type="checkbox"
                className="w-3"
                value={t(cat)}
                onChange={toggleCategory}
                checked={category.includes(t(cat))}
              />
              {t(cat)}
            </label>
          ))}
        </div>
      </div>
      {/* Polls Display */}
      <div className="flex flex-col gap-4 overflow-x-auto p-4">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center md:text-left">{t("current_polls")}</h2>
        <div className='flex overflow-x-auto md:flex-wrap gap-2 sm:gap-5 pb-4 flex-col sm:flex-row'>
          {filteredPolls.length === 0 ? (
            <p className="text-center text-muted-foreground">{t("no_polls")}</p>
          ) : (
            filteredPolls.map((survey, index) => {
              const totalVotes = survey.poll.participants?.reduce((sum, part) => sum + (part.count || 0), 0) || 0;
              const isFocused = survey._id === focusId;
              const arranged = [...(survey.poll.participants || [])]
                .sort((a, b) => (b.count || 0) - (a.count || 0))
                .slice(0, 4);
              return (
                <div
                  ref={(el) => pollRefs.current[survey._id] = el}
                  className={`flex flex-col bg-card rounded-lg p-4 mb-6 items-start border-1 border-border min-w-[300px] max-w-md shrink-0 ${isFocused ? 'border-1 border-primary' : ''}`}
                  key={index}
                >
                  <div className='flex gap-2 items-center text-sm font-semibold'>
                    <div className='bg-foreground rounded-full py-1 px-2'>{survey.poll?.category}</div>
                    <div className='bg-primary-foreground/20 text-primary-foreground rounded-full py-1 px-2'>{t("live")}</div>
                  </div>
                  <div className="flex flex-col items-start my-3">
                    <h3 className="text-2xl font-bold text-primary">
                      {survey.poll?.title || 'Title'}
                    </h3>
                    <p className="text-primary/70">{survey.poll?.desc || 'Description'}</p>
                  </div>
                  <div className='w-full flex flex-col gap-2'>
                    {arranged.map((part, i) => {
                      const percent = totalVotes > 0 ? ((part.count || 0) / totalVotes * 100).toFixed(2) : '0.00';
                      return (
                        <div className='flex flex-col gap-1' key={i}>
                          <div className='flex gap-3 justify-between'>
                            <div>{part.name}</div>
                            <div>{totalVotes > 0 ? `${percent}%` : t("no_votes")}</div>
                          </div>
                          <div className='bg-foreground w-full rounded-full h-2 overflow-hidden'>
                            <div
                              className='bg-primary-foreground h-2 rounded-full origin-left animate-[grow_1.5s_ease-out_0.2s_forwards]'
                              style={{ '--tw-grow-width': `${percent}%`, width: "0%" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <hr className='text-primary-foreground w-full mt-5' />
                  <div className="mt-6 flex flex-col gap-2 text-sm font-semibold text-primary/70 items-center w-full">
                    <div className='flex gap-2'><Users />{totalVotes}</div>
                    <div className='flex flex-col gap-2'>
                      <div>{t("by")}: {survey?.author}</div>
                      <div>{t("due")}: {new Date(survey.poll?.dueDate).toLocaleDateString('en-GB')}</div>
                    </div>
                    <Link to={`/poll/${survey._id}`}>
                      <button className="vote-button px-3 py-1 rounded-md cursor-pointer text-lg">
                        {t("beYou")}
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentPoll;
