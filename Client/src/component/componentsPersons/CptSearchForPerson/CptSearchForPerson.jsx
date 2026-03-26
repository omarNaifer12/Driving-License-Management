import React, { useEffect, useState } from 'react';
import './CptSearchForPerson.css';
import CptPersonInformation from '../CptPersonInformation/CptPersonInformation';

/* ── icons ── */
const SearchIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const CptSearchForPerson = ({ PersonID,readOnly }) => {
  const [inputId,  setInputId]  = useState('');
  const [searchId, setSearchId] = useState('');
  const isReadOnly = Boolean(readOnly);
console.log("PersonIDPersonIDPersonID in search",PersonID);

  /* when a PersonID prop is passed in, use it directly */
  useEffect(() => {
    if (PersonID) {
      setSearchId(String(PersonID));
      setInputId(String(PersonID));
    }
  }, [PersonID]);

  const handleSearch = () => {
    if (inputId.trim()) setSearchId(inputId.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="search-for-person-container">
      {/* ── Search card ── */}
      <div className="search-section">
        <div className="search-section__header">
          <div className="search-section__header-icon"><SearchIcon /></div>
          <span className="search-section__header-title">Search by Person ID</span>
        </div>

        <div className="search-section__body">
          <div className="search-section__field">
            <label className="search-section__label">Person ID</label>
            <input
              className="search-section__input"
              type="text"
              placeholder="Enter ID…"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              onKeyDown={handleKeyDown}
              readOnly={isReadOnly}
            />
          </div>

          {isReadOnly ? (
            <span className="search-section__locked">
              <LockIcon /> Pre-filled
            </span>
          ) : (
            <button
              className="search-section__btn"
              onClick={handleSearch}
              disabled={!inputId.trim()}
            >
              <SearchIcon /> Search
            </button>
          )}
        </div>
      </div>

      {/* ── Person result (reusable card) ── */}
      {searchId && <CptPersonInformation id={searchId} />}
    </div>
  );
};

export default CptSearchForPerson;