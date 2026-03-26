import React, { useEffect, useState } from 'react';
import './RenewLocalLicense.css';
import { useDispatch, useSelector } from 'react-redux';
import { GetApplicationTypeByID } from '../../../../helper/ApplicationType';
import axios from 'axios';
import { BASE_URL } from '../../../../utils/config';
import CptLicenseDetailsBySearch from '../CptLicenseDetailsBySearch/CptLicenseDetailsBySearch';
import { getOneUserAction } from '../../../../Redux/Actions/UsersAction';
import { ResetLicenseData, ResetLicenseID, setLicenseID } from '../../../../Redux/Actions/LicensesAction';
import { useNavigate } from 'react-router-dom';

/* ── icons ── */
const RefreshIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
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
const ClockIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);
const HistoryIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>
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

const RenewLocalLicense = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const license   = useSelector((s) => s.LicensesReducer.licenseDetails);
  const user      = useSelector((s) => s.Users.user);
  const userID    = parseInt(localStorage.getItem('UserID'), 10);

  const [note,             setNote]             = useState('');
  const [applicationType,  setApplicationType]  = useState({});
  const [newApplicationID, setNewApplicationID] = useState(0);
  const [newLicenseID,     setNewLicenseID]     = useState(0);
  const [canRenew,         setCanRenew]         = useState(false);
  const [alertMsg,         setAlertMsg]         = useState('');
  const [saving,           setSaving]           = useState(false);
  const [toast,            setToast]            = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  useEffect(() => {
    dispatch(ResetLicenseData());
    dispatch(ResetLicenseID());
  }, []);

  useEffect(() => {
    setAlertMsg('');
    if (!license.LicenseID) { setCanRenew(false); return; }

    if (license.ExpirationDate > Date.now()) {
      setAlertMsg('This license has not yet reached its expiration date and cannot be renewed.');
      setCanRenew(false);
      return;
    }
    const load = async () => {
      const res = await GetApplicationTypeByID(2);
      setApplicationType(res);
      dispatch(getOneUserAction(userID));
      setCanRenew(true);
    };
    load();
  }, [license.LicenseID]);

  const handleRenew = async () => {
    setSaving(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/licenses/Change?existLicenseID=${license.LicenseID}&createdBy=${userID}&ApplicationTypeID=2&IssueReason=2`,
        note, { headers: { 'Content-Type': 'application/json' } }
      );
      setNewApplicationID(response.data.ApplicationID);
      setNewLicenseID(response.data.LicenseID);
      setCanRenew(false);
      showToast('License renewed successfully!', 'success');
    } catch (err) {
      console.error('Failed to renew license:', err);
      showToast('Failed to renew license. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const totalFees = (applicationType.ApplicationFees ?? 0) + (license.ClassFees ?? 0);
  const today = new Date().toLocaleDateString();

  return (
    <>
      <div className="lc-container">
        <div>
          <h1>Renew License</h1>
                </div>

        <CptLicenseDetailsBySearch />

        {alertMsg && (
          <div className="lc-alert lc-alert--warning">
            <AlertIcon /><span className="lc-alert__text">{alertMsg}</span>
          </div>
        )}

        {newLicenseID > 0 && (
          <div className="lc-success-strip">
            <div className="lc-success-strip__icon"><CheckIcon /></div>
            <div>
              <div className="lc-success-strip__title">License Renewed — New ID: {newLicenseID}</div>
              <div className="lc-success-strip__sub">Application ID: {newApplicationID} · Renewed on {today}</div>
            </div>
          </div>
        )}

        {license.LicenseID > 0 && (
          <div className="lc-card">
            <div className="lc-card__header">
              <div className="lc-card__header-icon"><RefreshIcon /></div>
              <div>
                <div className="lc-card__header-label">Renewal Details</div>
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
                  {applicationType.ApplicationFees != null
                    ? <span className="lc-badge lc-badge--gold">${applicationType.ApplicationFees}</span>
                    : null}
                </Row>
                <Row label="Class Fees">
                  {license.ClassFees != null
                    ? <span className="lc-badge lc-badge--gold">${license.ClassFees}</span>
                    : null}
                </Row>
              </div>
              <div className="lc-col">
                <Row label="New License ID">
                  {newLicenseID ? <span className="lc-badge lc-badge--success">{newLicenseID}</span> : null}
                </Row>
                <Row label="Old License ID" value={license.LicenseID} />
                <Row label="Created By" value={user.UserName} />
                <Row label="Total Fees">
                  {license.LicenseID
                    ? <span className="lc-badge lc-badge--orange">${totalFees}</span>
                    : null}
                </Row>
              </div>
            </div>

            {/* note */}
            <div className="lc-note-section">
              <label className="lc-note-label">Note (optional)</label>
              <input
                className="lc-note-input"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write a note about this renewal…"
                disabled={!canRenew}
              />
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
          {canRenew && (
            <button className="lc-btn lc-btn--primary" onClick={handleRenew} disabled={saving}>
              <RefreshIcon /> {saving ? 'Renewing…' : 'Renew License'}
            </button>
          )}
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} />
    </>
  );
};

export default RenewLocalLicense;