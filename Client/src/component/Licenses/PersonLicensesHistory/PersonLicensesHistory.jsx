import React, { useEffect, useState } from 'react';
import './PersonLicensesHistory.css';
import { useNavigate, useParams } from 'react-router-dom';
import { getDataAPI } from '../../../utils/fetchData';
import CptPersonInformation from '../../componentsPersons/CptPersonInformation/CptPersonInformation';
import { setLicenseID } from '../../../Redux/Actions/LicensesAction';
import { useDispatch } from 'react-redux';

/* ── icons ── */
const LicenseIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);

const safeDate = (raw) => {
  try { return new Date(raw).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return 'N/A'; }
};

const PersonLicensesHistory = () => {
  const { PersonID } = useParams();
  const dispatch     = useDispatch();
  const navigate     = useNavigate();

  const [localLicenses,         setLocalLicenses]         = useState([]);
  const [internationalLicenses, setInternationalLicenses] = useState([]);
  const [activeTab,             setActiveTab]             = useState('local');
const fetchInternationalLicense=async()=>{
  try {
     const intl = await getDataAPI(`InternationalLicenses/InternationalLicensesperson/${PersonID}`);
    
        setInternationalLicenses(intl.data);
  } catch (error) {
    console.error('Error fetching inetrnational license:', error);
  }
}
const fetchLocalLicense=async()=>{
  try {
     const local= await getDataAPI(`Licenses/LicensesOfPerson?PersonID=${PersonID}`)
        setLocalLicenses(local.data);
  } catch (error) {
    console.error('Error fetching local license:', error);
  }
}
  useEffect(() => {
    const fetchAll = async () => {
      try {
       await fetchLocalLicense();
       await fetchInternationalLicense();
      } catch (error) { console.error('Error fetching licenses:', error); }
    };
    fetchAll();
  }, [PersonID]);

  const renderLocal = () => {
    if (!localLicenses.length)
      return (
        <div className="plh-empty">
          <LicenseIcon />
          <p>No local licenses found for this person.</p>
        </div>
      );

    return (
      <div className="plh-grid">
        {localLicenses.map((lic) => (
          <div key={lic.LicenseID} className="plh-card">
            <div className="plh-card__header">
              <span className="plh-card__id">License #{lic.LicenseID}</span>
              <span className={`plh-status plh-status--${lic.IsActive ? 'active' : 'inactive'}`}>
                {lic.IsActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="plh-card__body">
              <div className="plh-card__row">
                <span className="plh-card__key">Application</span>
                <span className="plh-card__val">{lic.ApplicationID}</span>
              </div>
              <div className="plh-card__row">
                <span className="plh-card__key">Class</span>
                <span className="plh-class-badge">{lic.ClassName}</span>
              </div>
              <div className="plh-card__row">
                <span className="plh-card__key">Issue Date</span>
                <span className="plh-card__val">{safeDate(lic.IssueDate)}</span>
              </div>
              <div className="plh-card__row">
                <span className="plh-card__key">Expiry Date</span>
                <span className="plh-card__val">{safeDate(lic.ExpirationDate)}</span>
              </div>
            </div>
            <div className="plh-card__action">
              <button className="plh-view-btn"
                onClick={() => { dispatch(setLicenseID(lic.LicenseID)); navigate('/license-details'); }}>
                <ExternalLinkIcon /> View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderInternational = () => {
    if (!internationalLicenses.length)
      return (
        <div className="plh-empty">
          <GlobeIcon />
          <p>No international licenses found for this person.</p>
        </div>
      );

    return (
      <div className="plh-grid">
        {internationalLicenses.map((lic) => (
          <div key={lic.InternationalLicenseID} className="plh-card">
            <div className="plh-card__header">
              <span className="plh-card__id">Intl. License #{lic.InternationalLicenseID}</span>
              <span className={`plh-status plh-status--${lic.IsActive ? 'active' : 'inactive'}`}>
                {lic.IsActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="plh-card__body">
              <div className="plh-card__row">
                <span className="plh-card__key">Application</span>
                <span className="plh-card__val">{lic.ApplicationID}</span>
              </div>
              <div className="plh-card__row">
                <span className="plh-card__key">Driver ID</span>
                <span className="plh-card__val">{lic.DriverID}</span>
              </div>
              <div className="plh-card__row">
                <span className="plh-card__key">Local License</span>
                <span className="plh-intl-badge">#{lic.IssuedUsingLocalLicenseID}</span>
              </div>
              <div className="plh-card__row">
                <span className="plh-card__key">Issue Date</span>
                <span className="plh-card__val">{safeDate(lic.IssueDate)}</span>
              </div>
              <div className="plh-card__row">
                <span className="plh-card__key">Expiry Date</span>
                <span className="plh-card__val">{safeDate(lic.ExpirationDate)}</span>
              </div>
              <div className="plh-card__row">
                <span className="plh-card__key">Created By</span>
                <span className="plh-card__val">{lic.CreatedByUserID}</span>
              </div>
            </div>
            <div className="plh-card__action">
              <button className="plh-view-btn"
                onClick={() => navigate(`/International-license-details/${lic.InternationalLicenseID}`)}>
                <ExternalLinkIcon /> View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="plh-container">
      {/* person info card */}
      <CptPersonInformation id={PersonID} />

      {/* tabs */}
      <div className="plh-tabs">
        <button
          className={`plh-tab${activeTab === 'local' ? ' plh-tab--active' : ''}`}
          onClick={() => setActiveTab('local')}
        >
          <LicenseIcon />
          <span className={activeTab === 'international' ? `LicensesTab`:""}>Local Licenses</span>
          <span className="plh-tab-count">{localLicenses.length}</span>
        </button>
        <button
          className={`plh-tab${activeTab === 'international' ? ' plh-tab--active' : ''}`}
          onClick={() => setActiveTab('international')}
        >
          <GlobeIcon />
          <span className={activeTab === 'local' ?`LicensesTab`:""}>International</span>
          <span className="plh-tab-count">{internationalLicenses.length}</span>
        </button>
      </div>

      {/* content */}
      {activeTab === 'local' ? renderLocal() : renderInternational()}
    </div>
  );
};

export default PersonLicensesHistory;