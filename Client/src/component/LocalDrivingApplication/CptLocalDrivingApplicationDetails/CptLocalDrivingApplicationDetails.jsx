import React from 'react';
import './CptLocalDrivingApplicationDetails.css';
import { useSelector } from 'react-redux';

/* ── icons ── */
const LicenseIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
);

/* ── sub-components ── */
const Field = ({ label, value, full, children }) => (
  <div className={`adi-field${full ? ' adi-field--full' : ''}`}>
    <div className="adi-field__key">{label}</div>
    <div className={`adi-field__val${!value && !children ? ' adi-field__val--empty' : ''}`}>
      {children || value || '—'}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const cls = status === 1 ? '1' : status === 2 ? '2' : 'default';
  const label = status === 1 ? 'New' : status === 2 ? 'Completed' : status || '—';
  return (
    <span className={`adi-status-badge adi-status-badge--${cls}`}>{label}</span>
  );
};

/* ── main ── */
const CptLocalDrivingApplicationDetails = () => {
  const ldl             = useSelector((s) => s.LocalDrivingLicenses.LocalDrivingLicense);
  const countPassedTests = useSelector((s) => s.Tests.PassedTestsCount);
  const MAX_TESTS = 3;

  return (
    <div className="application-info-container">

      {/* ── Header ── */}
      <div className="adi-header">
        <div className="adi-header__icon"><LicenseIcon /></div>
        <div className="adi-header__text">
          <div className="adi-header__label">Local Driving License</div>
          <div className="adi-header__title">
            {ldl.LicenseClassName || 'Application'} — #{ldl.localDrivingLicenseID || '—'}
          </div>
        </div>
      </div>

      {/* ── Test progress strip ── */}
      <div className="adi-test-strip">
        <span className="adi-test-strip__label">Tests Passed</span>
        <div className="adi-test-strip__count">
          {Array.from({ length: MAX_TESTS }, (_, i) => (
            <div key={i} className={`adi-test-dot${i < countPassedTests ? ' adi-test-dot--passed' : ''}`} />
          ))}
          <span className="adi-test-strip__num">{countPassedTests} / {MAX_TESTS}</span>
        </div>
      </div>

      {/* ── License info section ── */}
      <div className="adi-section">
        <div className="adi-section__title">License Details</div>
        <div className="adi-section__body">
          <Field label="License Class"     value={ldl.LicenseClassName} />
          <Field label="License App ID"    value={ldl.localDrivingLicenseID} />
          <Field label="Person Full Name"  value={ldl.PersonFullName} full />
        </div>
      </div>

      {/* ── Application info section ── */}
      <div className="adi-section">
        <div className="adi-section__title">Application Information</div>
        <div className="adi-section__body">
          <Field label="Application ID"   value={ldl.ApplicationID} />
          <Field label="Application Type" value={ldl.ApplicationTypeName} />
          <Field label="Application Date" value={ldl.ApplicationDate} />
          <Field label="Last Status Date" value={ldl.LastStatusDate
            ? new Date(ldl.LastStatusDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
            : null} />
          <Field label="Status">
            <StatusBadge status={ldl.ApplicationStatus} />
          </Field>
          <Field label="Paid Fees">
            {ldl.PaidFees != null
              ? <span className="adi-fees-badge">${ldl.PaidFees}</span>
              : null}
          </Field>
          <Field label="Created By" value={ldl.CreatedByUserName} full />
        </div>
      </div>

    </div>
  );
};

export default CptLocalDrivingApplicationDetails;