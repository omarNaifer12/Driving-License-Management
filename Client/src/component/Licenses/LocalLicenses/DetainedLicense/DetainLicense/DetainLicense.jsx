import React, { useEffect, useState } from 'react';
import './DetainLicense.css';
import CptLicenseDetailsBySearch from '../../CptLicenseDetailsBySearch/CptLicenseDetailsBySearch';
import axios from 'axios';
import { BASE_URL } from '../../../../../utils/config';
import { useDispatch, useSelector } from 'react-redux';
import { getOneUserAction } from '../../../../../Redux/Actions/UsersAction';
import { ResetLicenseData, ResetLicenseID } from '../../../../../Redux/Actions/LicensesAction';
// import '../DetainLicense/DetainRelease.css';
/* ── icons ── */
const LockIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
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

const Toast = ({ message, type }) =>
  message ? (
    <div className={`dr-toast dr-toast--${type}`}>
      {type === 'success' ? <CheckIcon /> : <XIcon />}
      {message}
    </div>
  ) : null;

const Row = ({ label, children, value }) => (
  <div className="dr-row">
    <span className="dr-row__key">{label}</span>
    <span className={`dr-row__val${!value && !children ? ' dr-row__val--empty' : ''}`}>
      {children || value || '—'}
    </span>
  </div>
);

const DetainLicense = () => {
  const dispatch   = useDispatch();
  const license    = useSelector((s) => s.LicensesReducer.licenseDetails);
  const user       = useSelector((s) => s.Users.user);
  const userID     = parseInt(localStorage.getItem('UserID'), 10);

  const [fineFees,   setFineFees]   = useState('');
  const [detainID,   setDetainID]   = useState(0);
  const [canDetain,  setCanDetain]  = useState(false);
  const [alertMsg,   setAlertMsg]   = useState('');
  const [saving,     setSaving]     = useState(false);
  const [toast,      setToast]      = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  useEffect(() => {
    dispatch(ResetLicenseData());
    dispatch(ResetLicenseID());
  }, []);

  useEffect(() => {
    setDetainID(0);
    setFineFees('');
    setAlertMsg('');

    if (!license.LicenseID) {
      setCanDetain(false);
    } else if (license.IsDetained) {
      setAlertMsg('This license is already detained and cannot be detained again.');
      setCanDetain(false);
    } else {
      dispatch(getOneUserAction(userID));
      setCanDetain(true);
    }
  }, [license.LicenseID]);

  const handleChange = (e) => {
    setFineFees(e.target.value.replace(/[^\d]/g, ''));
  };

  const handleDetain = async (e) => {
    e.preventDefault();
    if (!fineFees || Number(fineFees) <= 0) {
      showToast('Please enter a valid fine fee amount.', 'error');
      return;
    }
    setSaving(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/DetainedLicenses/DetainLicense?LicenseID=${license.LicenseID}&FineFees=${fineFees}&CreatedByUserID=${userID}`
      );
      setDetainID(response.data);
      setCanDetain(false);
      showToast('License detained successfully.', 'success');
    } catch (err) {
      console.error('Error detaining license:', err);
      showToast('Failed to detain license. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="dr-container">
        <div>
          <h1>Detain License</h1>
               </div>

        <CptLicenseDetailsBySearch />

        {/* validation alert */}
        {alertMsg && (
          <div className="dr-alert dr-alert--error">
            <AlertIcon />
            <span className="dr-alert__text">{alertMsg}</span>
          </div>
        )}

        {/* success strip */}
        {detainID > 0 && (
          <div className="dr-success-strip">
            <div className="dr-success-strip__icon"><CheckIcon /></div>
            <div>
              <div className="dr-success-strip__title">License Detained — Detain ID: {detainID}</div>
              <div className="dr-success-strip__sub">The license has been successfully detained.</div>
            </div>
          </div>
        )}

        {/* details card — shown once a license is loaded */}
        {license.LicenseID > 0 && (
          <div className="dr-card">
            <div className="dr-card__header">
              <div className="dr-card__header-icon"><LockIcon /></div>
              <div>
                <div className="dr-card__header-label">Detention Record</div>
                <div className="dr-card__header-title">License #{license.LicenseID}</div>
              </div>
            </div>

            <div className="dr-card__body">
              <div className="dr-col">
                <Row label="Detain ID">
                  {detainID
                    ? <span className="dr-badge dr-badge--danger">{detainID}</span>
                    : null}
                </Row>
                <Row label="Detain Date">
                  {detainID ? new Date().toLocaleDateString() : null}
                </Row>
              </div>
              <div className="dr-col">
                <Row label="License ID" value={license.LicenseID} />
                <Row label="Created By" value={user.UserName} />
                <Row label="Fine Fees">
                  <input
                    className="dr-input"
                    type="text"
                    inputMode="numeric"
                    value={fineFees}
                    onChange={handleChange}
                    placeholder="0"
                    disabled={!canDetain}
                  />
                </Row>
              </div>
            </div>
          </div>
        )}

        {canDetain && (
          <button className="dr-action-btn dr-action-btn--detain" onClick={handleDetain} disabled={saving}>
            <LockIcon />
            {saving ? 'Processing…' : 'Detain License'}
          </button>
        )}
      </div>

      <Toast message={toast.message} type={toast.type} />
    </>
  );
};

export default DetainLicense;