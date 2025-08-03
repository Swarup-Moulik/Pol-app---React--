import React, { useState, useEffect, useContext, useRef } from 'react';
import { PollContext } from "../context/pollContext";
import { Users, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const PastPoll = () => {
  const [filteredPolls, setFilteredPolls] = useState([]);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const [showSidebar, setShowSidebar] = useState(false);
  const { surveys, searchTerm } = useContext(PollContext);
  const location = useLocation();
  const focusId = location.state?.focusId;
  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((cat) => cat !== value) : [...prev, value]
    );
  };
  const applyFilterAndSort = () => {
    let result = surveys.slice();
    // ✅ Filter out expired polls
    const today = new Date();
    result = result.filter(
      (survey) => new Date(survey.poll?.dueDate) <= today
    );
    // Apply category filter
    if (category.length > 0) {
      result = result.filter((survey) =>
        category.includes(survey.poll?.category)
      );
    }
    // Apply sort
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
          <h2 className="text-2xl font-semibold">Filters</h2>
          <button onClick={() => setShowSidebar(false)} className="text-primary">
            <X />
          </button>
        </div>
        <div className='flex flex-col gap-3 items-center justify-start'>
          <label className="font-medium text-lg">Sort by:</label>
          <select
            className="p-1 w-full border rounded-md bg-gray-200 text-black"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="relevant">Relevant</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
        <h2 className="text-lg font-semibold mt-6">Categories</h2>
        <div className="flex flex-col gap-2 mt-3 text-md bg-foreground/50 rounded-lg p-3 text-light">
          {['Sports', 'Music', 'Films', 'Technology', 'Cuisine'].map((cat) => (
            <label key={cat} className="flex gap-3 items-center">
              <input
                type="checkbox"
                className="w-3"
                value={cat}
                onChange={toggleCategory}
                checked={category.includes(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>
      {/* Polls Display */}
      <div className="flex flex-col p-4 gap-4 w-full">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center md:text-left">Past Polls</h2>
        <div className='flex overflow-x-auto md:flex-wrap gap-2 sm:gap-5 pb-4 flex-col sm:flex-row'>
          {filteredPolls.length === 0 ? (
            <p className="text-center text-muted-foreground">No past polls yet.</p>
          ) : (
            filteredPolls.map((survey, index) => {
              const totalVotes = survey.poll.participants?.reduce((sum, part) => sum + (part.count || 0), 0) || 0;
              const topParticipant = survey.poll.participants?.reduce((max, current) => {
                return (current.count || 0) > (max.count || 0) ? current : max;
              }, { count: -1 });
              const isFocused = survey._id === focusId;
              const arranged2 = [...(survey.poll.participants || [])]?.sort((a, b) => (b.count || 0) - (a.count || 0));
              const arranged = arranged2.slice(0, 4);
              return (
                <div
                  ref={(el) => pollRefs.current[survey._id] = el}
                  className={`flex flex-col bg-card rounded-lg p-4 mb-6 items-start border-1 border-border min-w-[300px] max-w-md shrink-0 ${isFocused ? 'border-2 border-primary scale-[1.02]' : ''}`}
                  key={index}
                >
                  {/* Poll Text Info */}
                  <div className='flex gap-2 items-center text-sm font-semibold'>
                    <div className='bg-foreground rounded-full py-1 px-2'>{survey.poll?.category}</div>
                    <div className='bg-red-700 text-primary rounded-full py-1 px-2'>Expired</div>
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
                            <div>{totalVotes > 0 ? `${percent}%` : 'No votes yet'}</div>
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
                      <div>By: {survey?.author}</div>
                      <div>Due: {new Date(survey.poll?.dueDate).toLocaleDateString('en-GB')}</div>
                    </div>
                    <Link to={`/result/${survey._id}`}>
                      <button className="vote-button px-3 py-1 rounded-md cursor-pointer text-lg">
                        Results
                      </button>
                    </Link>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default PastPoll
