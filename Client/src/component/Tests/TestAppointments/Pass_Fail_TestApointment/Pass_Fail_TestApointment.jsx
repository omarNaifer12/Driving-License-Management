import React, { useState } from 'react';
import './Pass_Fail_TestApointment.css';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { postDataAPI } from '../../../../utils/fetchData';

/* ── icons ── */
const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
);
const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const XCircleIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
);
const SaveIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);
const TagIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

/* ── sub-components ── */
const Toast = ({ message, type }) =>
  message ? (
    <div className={`pf-toast pf-toast--${type}`}>
      {type === 'success' ? <CheckIcon /> : <XIcon />}
      {message}
    </div>
  ) : null;

const InfoRow = ({ label, children }) => (
  <div className="pf-info-row">
    <span className="pf-info-row__key">{label}</span>
    <span className="pf-info-row__val">{children}</span>
  </div>
);

/* ── main ── */
const Pass_Fail_TestApointment = () => {
  const { TestAppointmentID } = useParams();
  const TestTrials            = useSelector((s) => s.Tests.TestTrials);
  const TestType              = useSelector((s) => s.Tests.TestType);
  const LocalDrivingLicense   = useSelector((s) => s.LocalDrivingLicenses.LocalDrivingLicense);

  const [result, setResult] = useState('pass');
  const [note, setNote]     = useState('');
  const [testID, setTestID] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const userID = parseInt(localStorage.getItem('UserID'), 10);
    const data = {
      TestID: 0,
      TestAppointmentID,
      TestResult: result === 'pass',
      Notes: note,
      CreatedByUserID: userID,
    };
    try {
      const response = await postDataAPI('Tests/Add', data);
      setTestID(response.data.TestID);
      showToast('Test result saved successfully', 'success');
    } catch (error) {
      console.error('Error saving result:', error);
      showToast('Failed to save test result', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="pass-fail-container">
        <div>
          <h1>Record Test Result</h1>
         
        </div>

        <div className="pf-card">
          {/* header */}
          <div className="pf-card__header">
            <div className="pf-card__header-icon"><ClipboardIcon /></div>
            <div>
              <div className="pf-card__header-label">Test Appointment</div>
              <div className="pf-card__header-title">
                {TestType?.TestTypeName || 'Test Result'}
              </div>
            </div>
          </div>

          {/* test ID strip — shown after save */}
          {testID && (
            <div className="pf-test-id-strip">
              <TagIcon />
              <span>Test recorded — ID:</span>
              <span className="pf-test-id-val">{testID}</span>
            </div>
          )}

          {/* info rows */}
          <InfoRow label="License Class">
            {LocalDrivingLicense?.LicenseClassName || '—'}
          </InfoRow>
          <InfoRow label="License App ID">
            {LocalDrivingLicense?.localDrivingLicenseID || '—'}
          </InfoRow>
          <InfoRow label="Person">
            {LocalDrivingLicense?.PersonFullName || '—'}
          </InfoRow>
          <InfoRow label="Test Fees">
            <span className="pf-badge pf-badge--gold">${TestType?.TestTypeFees ?? '—'}</span>
          </InfoRow>
          <InfoRow label="Test Trials">
            <span className="pf-badge pf-badge--blue">{TestTrials ?? '—'}</span>
          </InfoRow>

          {/* result toggle */}
          <div className="pf-result-section">
            <div className="pf-result-label">Result</div>
            <div className="pf-result-toggle">
              <label className={`pf-result-option pf-result-option--pass${result === 'pass' ? ' selected' : ''}`}>
                <input type="radio" value="pass" checked={result === 'pass'} onChange={() => setResult('pass')} />
                <CheckCircleIcon /> Pass
              </label>
              <label className={`pf-result-option pf-result-option--fail${result === 'fail' ? ' selected' : ''}`}>
                <input type="radio" value="fail" checked={result === 'fail'} onChange={() => setResult('fail')} />
                <XCircleIcon /> Fail
              </label>
            </div>
          </div>

          {/* notes */}
          <div className="pf-notes-section">
            <div className="pf-notes-label">Notes</div>
            <textarea
              className="pf-notes-textarea"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any observations or remarks about this test…"
            />
          </div>

          {/* save */}
          <button className="pf-save-btn" onClick={handleSave} disabled={saving}>
            <SaveIcon />
            {saving ? 'Saving…' : 'Save Result'}
          </button>
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} />
    </>
  );
};

export default Pass_Fail_TestApointment;