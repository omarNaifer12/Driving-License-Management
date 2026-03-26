import React, { useEffect, useState } from 'react';
import './ReplacemenetDamagedOrLostLicense.css';
import { useDispatch, useSelector } from 'react-redux';
import { GetApplicationTypeByID } from '../../../helper/ApplicationType';
import { BASE_URL } from '../../../utils/config';
import CptLicenseDetailsBySearch from '../LocalLicenses/CptLicenseDetailsBySearch/CptLicenseDetailsBySearch';
import { getOneUserAction } from '../../../Redux/Actions/UsersAction';
import axios from 'axios';
import { ResetLicenseData, ResetLicenseID, setLicenseID } from '../../../Redux/Actions/LicensesAction';
import { useNavigate } from 'react-router-dom';

/* ── icons ── */
const SwapIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);
const HistoryIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const ZapIcon = () => (
  <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);

const Toast = ({ message, type }) =>
  message ? (
    <div className={`lc-toast lc-toast--${type}`}>
      {type === 'success' ? <CheckIcon /> : <XIcon />}
      {message}
    </div>
  ) : null;

const Row = ({ label, children, value }) => (
  <div className="lc-row">
    <span className="lc-row__key">{label}</span>
    <span className={`lc-row__val${!value && !children ? ' lc-row__val--empty' : ''}`}>
      {children || value || '—'}
    </span>
  </div>
);

const ReplacemenetDamagedOrLostLicense = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const license   = useSelector((s) => s.LicensesReducer.licenseDetails);
  const user      = useSelector((s) => s.Users.user);
  const userID    = parseInt(localStorage.getItem('UserID'), 10);

  const [type,               setType]               = useState('lost');
  const [appTypeDamaged,     setAppTypeDamaged]     = useState({});
  const [appTypeLost,        setAppTypeLost]        = useState({});
  const [newApplicationID,   setNewApplicationID]   = useState(0);
  const [newLicenseID,       setNewLicenseID]       = useState(0);
  const [canReplace,         setCanReplace]         = useState(false);
  const [alertMsg,           setAlertMsg]           = useState('');
  const [saving,             setSaving]             = useState(false);
  const [toast,              setToast]              = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  useEffect(() => { dispatch(ResetLicenseData()); }, []);

  useEffect(() => {
    setAlertMsg(''); setCanReplace(false);
    if (!license.LicenseID) return;
    if (!license.IsActive) { setAlertMsg('This license is not active and cannot be replaced.'); return; }
    if (license.IsDetained) { setAlertMsg('This license is currently detained and cannot be replaced.'); return; }

    const load = async () => {
      const [lost, damaged] = await Promise.all([GetApplicationTypeByID(3), GetApplicationTypeByID(4)]);
      setAppTypeLost(lost);
      setAppTypeDamaged(damaged);
      dispatch(getOneUserAction(userID));
      setCanReplace(true);
    };
    load();
  }, [license.LicenseID]);

  const handleReplacement = async () => {
    const appType = type === 'lost' ? appTypeLost : appTypeDamaged;
    setSaving(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/licenses/Change?existLicenseID=${license.LicenseID}&createdBy=${userID}&ApplicationTypeID=${appType.ApplicationTypeID}&IssueReason=${appType.ApplicationTypeID}`,
        '', { headers: { 'Content-Type': 'application/json' } }
      );
      setNewApplicationID(response.data.ApplicationID);
      setNewLicenseID(response.data.LicenseID);
      setCanReplace(false);
      showToast(`${type === 'lost' ? 'Lost' : 'Damaged'} license replaced successfully!`, 'success');
    } catch (err) {
      console.error('Replacement failed:', err);
      showToast('Failed to replace license. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const currentFees = type === 'lost' ? appTypeLost.ApplicationFees : appTypeDamaged.ApplicationFees;
  const today = new Date().toLocaleDateString();

  return (
    <>
      <div className="lc-container">
        <div>
          <h1>Replace License</h1>
        </div>

        <CptLicenseDetailsBySearch />

        {alertMsg && (
          <div className="lc-alert lc-alert--error">
            <AlertIcon /><span className="lc-alert__text">{alertMsg}</span>
          </div>
        )}

        {/* type selector */}
        <div className="lc-type-card">
          <div className="lc-type-card__header">
            <div className="lc-type-card__header-icon"><SwapIcon /></div>
            <span className="lc-type-card__header-title">Replacement Type</span>
          </div>
          <div className="lc-type-card__body">
            <label className={`lc-type-option lc-type-option--lost${type === 'lost' ? ' selected' : ''}`}>
              <input type="radio" value="lost" checked={type === 'lost'} onChange={() => setType('lost')} />
              <SearchIcon /> Lost License
            </label>
            <label className={`lc-type-option lc-type-option--damaged${type === 'damaged' ? ' selected' : ''}`}>
              <input type="radio" value="damaged" checked={type === 'damaged'} onChange={() => setType('damaged')} />
              <ZapIcon /> Damaged License
            </label>
          </div>
        </div>

        {/* success strip */}
        {newLicenseID > 0 && (
          <div className="lc-success-strip">
            <div className="lc-success-strip__icon"><CheckIcon /></div>
            <div>
              <div className="lc-success-strip__title">License Replaced — New ID: {newLicenseID}</div>
              <div className="lc-success-strip__sub">Application ID: {newApplicationID} · Issued on {today}</div>
            </div>
          </div>
        )}

        {/* details card */}
        {license.LicenseID > 0 && (
          <div className="lc-card">
            <div className="lc-card__header">
              <div className="lc-card__header-icon"><SwapIcon /></div>
              <div>
                <div className="lc-card__header-label">
                  {type === 'lost' ? 'Lost License' : 'Damaged License'} Replacement
                </div>
                <div className="lc-card__header-title">License #{license.LicenseID}</div>
              </div>
            </div>

            <div className="lc-card__body">
              <div className="lc-col">
                <Row label="Application ID">
                  {newApplicationID ? <span className="lc-badge lc-badge--blue">{newApplicationID}</span> : null}
                </Row>
                <Row label="Application Date" value={today} />
                <Row label="Application Fees">
                  {currentFees != null
                    ? <span className="lc-badge lc-badge--gold">${currentFees}</span>
                    : null}
                </Row>
              </div>
              <div className="lc-col">
                <Row label="New License ID">
                  {newLicenseID ? <span className="lc-badge lc-badge--success">{newLicenseID}</span> : null}
                </Row>
                <Row label="Old License ID" value={license.LicenseID} />
                <Row label="Created By" value={user.UserName} />
              </div>
            </div>
          </div>
        )}

        <div className="lc-actions">
          {license.LicenseID > 0 && (
            <button className="lc-btn lc-btn--blue"
              onClick={() => navigate(`/Person-Licenses-History/${license.PersonID}`)}>
              <HistoryIcon /> License History
            </button>
          )}
          {newLicenseID > 0 && (
            <button className="lc-btn lc-btn--success"
              onClick={() => { dispatch(setLicenseID(newLicenseID)); navigate('/license-details'); }}>
              <ExternalLinkIcon /> View New License
            </button>
          )}
          {canReplace && (
            <button className="lc-btn lc-btn--primary" onClick={handleReplacement} disabled={saving}>
              <SwapIcon /> {saving ? 'Processing…' : type === 'lost' ? 'Replace Lost License' : 'Replace Damaged License'}
            </button>
          )}
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} />
    </>
  );
};

export default ReplacemenetDamagedOrLostLicense;