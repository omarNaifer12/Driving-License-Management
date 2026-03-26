import React, { useEffect, useState } from 'react';
import './AddInternationalLicense.css';
import { useDispatch, useSelector } from 'react-redux';
import { getDataAPI } from '../../../../utils/fetchData';
import { getOneUserAction } from '../../../../Redux/Actions/UsersAction';
import CptLicenseDetailsBySearch from '../../LocalLicenses/CptLicenseDetailsBySearch/CptLicenseDetailsBySearch';
import axios from 'axios';
import { BASE_URL } from '../../../../utils/config';
import { useNavigate } from 'react-router-dom';

/* ── icons ── */
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
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
const SaveIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);
const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);

/* ── sub-components ── */
const Toast = ({ message, type }) =>
  message ? (
    <div className={`add-intl-toast add-intl-toast--${type}`}>
      {type === 'success' ? <CheckIcon /> : <XIcon />}
      {message}
    </div>
  ) : null;

const InfoRow = ({ label, value, children }) => (
  <div className="add-intl-row">
    <span className="add-intl-row__key">{label}</span>
    <span className={`add-intl-row__val${!value && !children ? ' add-intl-row__val--empty' : ''}`}>
      {children || value || '—'}
    </span>
  </div>
);

/* ── main ── */
const AddInternationalLicense = () => {
  const dispatch  = useNavigate(); // kept to preserve original pattern
  const navigate  = useNavigate();
  const reduxDispatch = useDispatch();

  const user    = useSelector((s) => s.Users.user);
  const license = useSelector((s) => s.LicensesReducer.licenseDetails);
  const userID  = parseInt(localStorage.getItem('UserID'), 10);

  const [licenseClassDetails,    setLicenseClassDetails]    = useState({});
  const [applicationID,          setApplicationID]          = useState(0);
  const [internationalLicenseID, setInternationalLicenseID] = useState(0);
  const [canIssue,               setCanIssue]               = useState(false);
  const [saving,                 setSaving]                 = useState(false);
  const [validationMsg,          setValidationMsg]          = useState('');
  const [toast,                  setToast]                  = useState({ message: '', type: 'success' });

  const currentDate = new Date().toLocaleDateString();
  const expiryDate  = licenseClassDetails.DefaultValidityLength
    ? new Date(new Date().setFullYear(new Date().getFullYear() + licenseClassDetails.DefaultValidityLength)).toLocaleDateString()
    : '—';

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  useEffect(() => {
    const fetchLicenseClassDetails = async () => {
      try {
        const response = await getDataAPI('LicenseClasses/one/3');
        setLicenseClassDetails(response.data);
      } catch (err) { console.error('Error fetching license class:', err); }
    };
    fetchLicenseClassDetails();
    reduxDispatch(getOneUserAction(userID));
  }, []);

  useEffect(() => {
    const validate = async () => {
      if (!license.LicenseID) { setValidationMsg(''); setCanIssue(false); return; }
      if (!license.IsActive) {
        setValidationMsg('This local license is not active and cannot be used to issue an international license.');
        setCanIssue(false); return;
      }
      if (license.LicenseClass !== 3) {
        setValidationMsg('Only Class 3 (Ordinary driving license) holders are eligible for an international license.');
        setCanIssue(false); return;
      }
      try {
        const res = await getDataAPI(`InternationalLicenses/active/${license.DriverID}`);
        if (res.data === true) {
          setValidationMsg('This driver already has an active international license.');
          setCanIssue(false);
        } else {
          setValidationMsg('');
          setCanIssue(true);
        }
      } catch (err) { console.error(err); }
    };
    validate();
  }, [license.LicenseID]);

  const issueInternationalLicense = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/InternationalLicenses/Add?CreatedByUserID=${userID}&LicenseID=${license.LicenseID}`
      );
      setInternationalLicenseID(response.data.InternationalLicenseID);
      setApplicationID(response.data.ApplicationID);
      setCanIssue(false);
      showToast('International license issued successfully!', 'success');
    } catch (err) {
      console.error('Error issuing international license:', err);
      showToast('Failed to issue international license.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const issued = internationalLicenseID > 0;

  return (
    <>
      <div className="add-intl-container">
        <div>
          <h1>Issue International License</h1>
              </div>

        {/* local license search */}
        <CptLicenseDetailsBySearch />

        {/* validation alert */}
        {validationMsg && (
          <div className="add-intl-alert add-intl-alert--error">
            <AlertIcon />
            <span className="add-intl-alert__text">{validationMsg}</span>
          </div>
        )}

        {/* success strip */}
        {issued && (
          <div className="add-intl-success-strip">
            <div className="add-intl-success-strip__icon"><CheckIcon /></div>
            <div>
              <div className="add-intl-success-strip__title">
                International License Issued — ID: {internationalLicenseID}
              </div>
              <div className="add-intl-success-strip__sub">
                Application ID: {applicationID} · Issued on {currentDate}
              </div>
            </div>
          </div>
        )}

        {/* application details card — shown once a license is selected */}
        {license.LicenseID > 0 && (
          <div className="add-intl-card">
            <div className="add-intl-card__header">
              <div className="add-intl-card__header-icon"><GlobeIcon /></div>
              <div>
                <div className="add-intl-card__header-label">International License</div>
                <div className="add-intl-card__header-title">Application Details</div>
              </div>
            </div>

            <div className="add-intl-card__body">
              {/* left column */}
              <div className="add-intl-col">
                <InfoRow label="Application ID">
                  {applicationID
                    ? <span className="add-intl-badge add-intl-badge--purple">{applicationID}</span>
                    : null}
                </InfoRow>
                <InfoRow label="Application Date" value={currentDate} />
                <InfoRow label="Issue Date"        value={currentDate} />
                <InfoRow label="Fees">
                  {licenseClassDetails.ClassFees
                    ? <span className="add-intl-badge add-intl-badge--gold">${licenseClassDetails.ClassFees}</span>
                    : null}
                </InfoRow>
              </div>

              {/* right column */}
              <div className="add-intl-col">
                <InfoRow label="Intl. License ID">
                  {internationalLicenseID
                    ? <span className="add-intl-badge add-intl-badge--purple">{internationalLicenseID}</span>
                    : null}
                </InfoRow>
                <InfoRow label="Local License ID" value={license.LicenseID} />
                <InfoRow label="Expiration Date"  value={expiryDate} />
                <InfoRow label="Created By"       value={user.UserName} />
              </div>
            </div>
          </div>
        )}

        {/* action buttons */}
        <div className="add-intl-actions">
          {canIssue && !issued && (
            <button className="add-intl-btn add-intl-btn--issue" onClick={issueInternationalLicense} disabled={saving}>
              <SaveIcon />
              {saving ? 'Issuing…' : 'Issue International License'}
            </button>
          )}
          {issued && (
            <button
              className="add-intl-btn add-intl-btn--view"
              onClick={() => navigate(`/International-license-details/${internationalLicenseID}`)}
            >
              <ExternalLinkIcon /> View License Details
            </button>
          )}
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} />
    </>
  );
};

export default AddInternationalLicense;