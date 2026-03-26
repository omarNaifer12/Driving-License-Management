import React, { useState } from 'react';
import './Add_EditTestAppointments.css';
import { useSelector } from 'react-redux';
import { postDataAPI } from '../../../../utils/fetchData';

/* ── icons ── */
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const SaveIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const Toast = ({ message, type }) =>
  message ? (
    <div className={`ata-toast ata-toast--${type}`}>
      {type === 'success' ? <CheckIcon /> : <XIcon />}
      {message}
    </div>
  ) : null;

const InfoRow = ({ label, children }) => (
  <div className="ata-info-row">
    <span className="ata-info-row__key">{label}</span>
    <span className="ata-info-row__val">{children}</span>
  </div>
);

const Add_EditTestAppointments = () => {
  const TestTrials         = useSelector((s) => s.Tests.TestTrials);
  const TestType           = useSelector((s) => s.Tests.TestType);
  const LocalDrivingLicense = useSelector((s) => s.LocalDrivingLicenses.LocalDrivingLicense);

  const [date, setDate]     = useState(new Date());
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  const handleDateChange = (e) => setDate(new Date(e.target.value));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const userID = parseInt(localStorage.getItem('UserID'), 10);
    const data = {
      TestAppointmentID: -1,
      TestTypeID: TestType.TestTypeID,
      LocalDrivingLicenseApplicationID: LocalDrivingLicense.localDrivingLicenseID,
      AppointmentDate: date,
      PaidFees: TestType.TestTypeFees,
      CreatedByUserID: userID,
      RetakeTestApplicationID: -1,
      IsLocked: false,
    };
    try {
      await postDataAPI('TestAppointments/Add', data);
      showToast('Appointment saved successfully', 'success');
    } catch (error) {
      console.error('Error saving appointment:', error);
      showToast(error?.response?.data || 'Failed to save appointment', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="add-test-appointment-container">
        <div>
          <h1>Add Test Appointment</h1>
                  </div>

        <div className="ata-card">
          {/* header */}
          <div className="ata-card__header">
            <div className="ata-card__header-icon"><CalendarIcon /></div>
            <div>
              <div className="ata-card__header-label">New Appointment</div>
              <div className="ata-card__header-title">{TestType?.TestTypeName || 'Test Appointment'}</div>
            </div>
          </div>

          {/* info rows */}
          <InfoRow label="License Class">
            {LocalDrivingLicense.LicenseClassName || '—'}
          </InfoRow>
          <InfoRow label="License App ID">
            {LocalDrivingLicense.localDrivingLicenseID || '—'}
          </InfoRow>
          <InfoRow label="Person">
            {LocalDrivingLicense.PersonFullName || '—'}
          </InfoRow>
          <InfoRow label="Appointment Fees">
            <span className="ata-badge ata-badge--gold">${TestType?.TestTypeFees ?? '—'}</span>
          </InfoRow>
          <InfoRow label="Test Trials">
            <span className="ata-badge ata-badge--blue">{TestTrials ?? '—'}</span>
          </InfoRow>

          {/* date picker */}
          <div className="ata-date-section">
            <label className="ata-date-label">Appointment Date</label>
            <input
              type="date"
              className="date-picker"
              value={date.toISOString().split('T')[0]}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* save */}
          <button className="ata-save-btn" onClick={handleSave} disabled={saving}>
            <SaveIcon />
            {saving ? 'Saving…' : 'Save Appointment'}
          </button>
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} />
    </>
  );
};

export default Add_EditTestAppointments;