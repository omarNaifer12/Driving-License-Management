import React, { useEffect, useState } from 'react';
import './CptLicenseDetailsBySearch.css';
import { useDispatch } from 'react-redux';
import { ResetLicenseID, setLicenseID } from '../../../../Redux/Actions/LicensesAction';
import CptLicenseDtails from '../CptLicenseDtails/CptLicenseDtails';

/* ── icons ── */
const SearchIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);

const CptLicenseDetailsBySearch = ({ LicenseID }) => {
  const dispatch = useDispatch();
  const [searchedID, setSearchedID] = useState('');
  const isReadOnly = Boolean(LicenseID);

  useEffect(() => {
    if (LicenseID) {
      dispatch(setLicenseID(parseInt(LicenseID, 10)));
      setSearchedID(String(LicenseID));
    } else {
      dispatch(ResetLicenseID());
      setSearchedID('');
    }
  }, [LicenseID]);

  const handleInputChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setSearchedID(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchedID) handleSearch();
  };

  const handleSearch = () => {
    const id = parseInt(searchedID, 10);
    if (id) dispatch(setLicenseID(id));
  };

  return (
    <div className="license-search-container">
      {/* search card */}
      <div className="content-wrapper">
      <div className="license-search-card">
        <div className="license-search-card__header">
          <div className="license-search-card__header-icon"><SearchIcon /></div>
          <span className="license-search-card__header-title">Search by License ID</span>
        </div>

        <div className="license-search-card__body">
          <div className="license-search-field">
            <label className="license-search-field__label">License ID</label>
            <input
              className="license-search-field__input"
              type="text"
              inputMode="numeric"
              value={searchedID}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter License ID…"
              readOnly={isReadOnly}
            />
          </div>

          {isReadOnly ? (
            <span className="license-search-locked">
              <LockIcon /> Pre-filled
            </span>
          ) : (
            <button
              className="license-search-btn"
              onClick={handleSearch}
              disabled={!searchedID}
            >
              <SearchIcon /> Search
            </button>
          )}
        </div>
      </div>

      {/* license details card */}
      <CptLicenseDtails />
      </div>
    </div>
  );
};

export default CptLicenseDetailsBySearch;