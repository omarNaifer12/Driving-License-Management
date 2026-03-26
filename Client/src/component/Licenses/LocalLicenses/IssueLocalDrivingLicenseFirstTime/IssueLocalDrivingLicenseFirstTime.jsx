import React, { useEffect, useState } from 'react';
import './IssueLocalDrivingLicenseFirstTime.css';
import CptLocalDrivingApplicationDetails from '../../../LocalDrivingApplication/CptLocalDrivingApplicationDetails/CptLocalDrivingApplicationDetails';
import { useDispatch } from 'react-redux';
import { GetLocalDrivingLicenseByIDAction } from '../../../../Redux/Actions/LocalDrivingLicenseAction';
import { useNavigate, useParams } from 'react-router-dom';
import { PassedTestCountAction } from '../../../../Redux/Actions/TestsAction';
import { setLicenseID } from '../../../../Redux/Actions/LicensesAction';
import axios from 'axios';
import { BASE_URL } from '../../../../utils/config';

/* ── icons ── */
const FileTextIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
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

const Toast = ({ message, type }) =>
  message ? (
    <div className={`issue-ldl-toast issue-ldl-toast--${type}`}>
      {type === 'success' ? <CheckIcon /> : <XIcon />}
      {message}
    </div>
  ) : null;

const IssueLocalDrivingLicenseFirstTime = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { id }    = useParams();

  const [note, setNote]               = useState('');
  const [localLicenseID, setLocalLicenseID] = useState(0);
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState({ message: '', type: 'success' });

  useEffect(() => {
    dispatch(GetLocalDrivingLicenseByIDAction(id));
    dispatch(PassedTestCountAction(id));
  }, [id, dispatch]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  const issueFirstTimeLicense = async (e) => {
    e.preventDefault();
    setSaving(true);
    const userID = parseInt(localStorage.getItem('UserID'), 10);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/LocalDrivingLicenses/IssueLocalDrivingLicense?createdByUserID=${userID}&LocalDrivingLicenseApplicationID=${id}`,
        note,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setLocalLicenseID(response.data);
      showToast('License issued successfully!', 'success');
    } catch (error) {
      console.error('Error issuing license:', error);
      showToast('Failed to issue license. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showLicenseDetails = () => {
    if (localLicenseID) {
      dispatch(setLicenseID(localLicenseID));
      navigate('/license-details');
    }
  };

  return (
    <>
      <div className="issue-ldl-container">
        <div>
          <h1>Issue Driving License</h1>
                 </div>

        {/* LDL details */}
        <CptLocalDrivingApplicationDetails />

        {/* success strip */}
        {localLicenseID > 0 && (
          <div className="issue-ldl-success-strip">
            <div className="issue-ldl-success-strip__icon"><CheckIcon /></div>
            <div className="issue-ldl-success-strip__text">
              <div className="issue-ldl-success-strip__title">
                License Issued — ID: {localLicenseID}
              </div>
              <div className="issue-ldl-success-strip__sub">
                The license has been created successfully. Click below to view full details.
              </div>
            </div>
          </div>
        )}

        {/* notes card */}
        <div className="issue-ldl-notes-card">
          <div className="issue-ldl-notes-card__header">
            <div className="issue-ldl-notes-card__header-icon"><FileTextIcon /></div>
            <span className="issue-ldl-notes-card__header-title">Issuance Notes</span>
          </div>
          <div className="issue-ldl-notes-card__body">
            <label className="issue-ldl-notes-label">Notes (optional)</label>
            <textarea
              className="issue-ldl-notes-textarea"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any remarks about this license issuance…"
              disabled={localLicenseID > 0}
            />
          </div>
        </div>

        {/* action button */}
        {!localLicenseID ? (
          <button className="issue-ldl-btn issue-ldl-btn--save" onClick={issueFirstTimeLicense} disabled={saving}>
            <SaveIcon />
            {saving ? 'Issuing…' : 'Issue License'}
          </button>
        ) : (
          <button className="issue-ldl-btn issue-ldl-btn--view" onClick={showLicenseDetails}>
            <ExternalLinkIcon />
            View License Details
          </button>
        )}
      </div>

      <Toast message={toast.message} type={toast.type} />
    </>
  );
};

export default IssueLocalDrivingLicenseFirstTime;