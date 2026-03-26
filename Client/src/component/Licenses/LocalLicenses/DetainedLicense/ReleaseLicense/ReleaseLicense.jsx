import React, { useEffect, useState } from 'react';
import './ReleaseLicense.css';
import CptLicenseDetailsBySearch from '../../CptLicenseDetailsBySearch/CptLicenseDetailsBySearch';
import axios from 'axios';
import { BASE_URL } from '../../../../../utils/config';
import { useDispatch, useSelector } from 'react-redux';
import { getDataAPI } from '../../../../../utils/fetchData';
import { GetApplicationTypeByID } from '../../../../../helper/ApplicationType';

/* ── icons ── */
const UnlockIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
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

const ReleaseLicense = () => {
  const dispatch  = useDispatch();
  const license   = useSelector((s) => s.LicensesReducer.licenseDetails);
  const userID    = parseInt(localStorage.getItem('UserID'), 10);

  const [applicationTypeReleased, setApplicationTypeReleased] = useState({});
  const [detainData,              setDetainData]              = useState({});
  const [releaseAppID,            setReleaseAppID]            = useState(0);
  const [canRelease,              setCanRelease]              = useState(false);
  const [alertMsg,                setAlertMsg]                = useState('');
  const [saving,                  setSaving]                  = useState(false);
  const [toast,                   setToast]                   = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  useEffect(() => {
    const fetchAppType = async () => {
      const res = await GetApplicationTypeByID(5);
      setApplicationTypeReleased(res);
    };
    fetchAppType();
  }, []);

  useEffect(() => {
    setDetainData({});
    setAlertMsg('');
    setReleaseAppID(0);

    if (!license.LicenseID) {
      setCanRelease(false);
    } else if (!license.IsDetained) {
      setAlertMsg('This license is not currently detained and cannot be released.');
      setCanRelease(false);
    } else {
      setCanRelease(true);
      fetchDetainData();
    }
  }, [license.LicenseID]);

  const fetchDetainData = async () => {
    try {
      const response = await getDataAPI(`DetainedLicenses/ByLicenseID/${license.LicenseID}`);
      setDetainData(response.data);
    } catch (err) { console.error('Error fetching detain data:', err); }
  };

  const handleRelease = async (e) => {
    e.preventDefault();
    setSaving(true);
    const applicationDto = {
      ApplicationID: 0,
      ApplicantPersonID: license.PersonID,
      ApplicationDate: new Date().toISOString(),
      ApplicationTypeID: 5,
      ApplicationStatus: 3,
      LastStatusDate: new Date().toISOString(),
      PaidFees: applicationTypeReleased.ApplicationFees,
      CreatedByUserID: userID,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/api/DetainedLicenses/Release/${detainData.DetainID}`,
        applicationDto
      );
      setReleaseAppID(response.data);
      setCanRelease(false);
      showToast('License released successfully.', 'success');
    } catch (err) {
      console.error('Error releasing license:', err);
      showToast('Failed to release license. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const totalFees = (applicationTypeReleased.ApplicationFees ?? 0) + (detainData.FineFees ?? 0);

  return (
    <>
      <div className="dr-container">
        <div>
          <h1>Release License</h1>
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
        {releaseAppID > 0 && (
          <div className="dr-success-strip">
            <div className="dr-success-strip__icon"><CheckIcon /></div>
            <div>
              <div className="dr-success-strip__title">License Released — Application ID: {releaseAppID}</div>
              <div className="dr-success-strip__sub">The detention has been cleared successfully.</div>
            </div>
          </div>
        )}

        {/* details card */}
        {license.LicenseID > 0 && (
          <div className="dr-card">
            <div className="dr-card__header">
              <div className="dr-card__header-icon"><UnlockIcon /></div>
              <div>
                <div className="dr-card__header-label">Release Record</div>
                <div className="dr-card__header-title">License #{license.LicenseID}</div>
              </div>
            </div>

            <div className="dr-card__body">
              {/* left */}
              <div className="dr-col">
                <Row label="Detain ID">
                  {detainData.DetainID
                    ? <span className="dr-badge dr-badge--danger">{detainData.DetainID}</span>
                    : null}
                </Row>
                <Row label="Detain Date"
                  value={detainData.DetainDate
                    ? new Date(detainData.DetainDate).toLocaleDateString()
                    : null} />
                <Row label="Application Fees">
                  {applicationTypeReleased.ApplicationFees != null
                    ? <span className="dr-badge dr-badge--gold">${applicationTypeReleased.ApplicationFees}</span>
                    : null}
                </Row>
              </div>

              {/* right */}
              <div className="dr-col">
                <Row label="License ID" value={license.LicenseID} />
                <Row label="Detained By" value={detainData.CreatedByUserID} />
                <Row label="Total Fees">
                  {detainData.DetainID
                    ? <span className="dr-badge dr-badge--orange">${totalFees}</span>
                    : null}
                </Row>
                <Row label="Release App ID">
                  {releaseAppID
                    ? <span className="dr-badge dr-badge--success">{releaseAppID}</span>
                    : null}
                </Row>
              </div>
            </div>
          </div>
        )}

        {canRelease && (
          <button className="dr-action-btn dr-action-btn--release" onClick={handleRelease} disabled={saving}>
            <UnlockIcon />
            {saving ? 'Processing…' : 'Release License'}
          </button>
        )}
      </div>

      <Toast message={toast.message} type={toast.type} />
    </>
  );
};

export default ReleaseLicense;