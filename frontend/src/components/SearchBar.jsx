import { Search } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { PollContext } from '../context/pollContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SearchBar = () => {
  const { surveys, searchTerm, setSearchTerm } = useContext(PollContext);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation("navbar");
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = surveys.filter((survey) =>
        survey.poll?.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // Show top 5
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, surveys]);

  const handleClick = (poll) => {
    const dueDate = new Date(poll.poll?.dueDate);
    const now = new Date();

    if (dueDate >= now) {
      // Current poll
      navigate(`/currentpoll`, { state: { focusId: poll._id } });
    } else {
      // Past poll
      navigate(`/pastpoll`, { state: { focusId: poll._id } });
    }

    // Reset search
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className='relative w-full max-w-[300px]'>
      <div className='flex flex-row gap-2 items-center bg-foreground px-2 py-1 rounded-lg'>
        <Search size={20} strokeWidth={3} />
        <input
          type='text'
          placeholder={t("look_for_polls")}
          className='outline-none bg-transparent w-full'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className='absolute z-20 top-full left-0 w-full bg-card shadow-lg rounded-lg mt-1 overflow-hidden'>
          {suggestions.map((poll) => (
            <div
              key={poll._id}
              className='px-3 py-2 hover:bg-foreground cursor-pointer text-sm text-primary flex gap-2.5'
              onClick={() => handleClick(poll)}
            > 
              {poll.poll?.title}
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default SearchBar;
