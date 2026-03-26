import React, { useEffect } from 'react';
import './CptLicenseDtails.css';
import { useDispatch, useSelector } from 'react-redux';
import { GetOneLicense, ResetLicenseData } from '../../../../Redux/Actions/LicensesAction';

/* ── icons ── */
const UserIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);

/* ── sub-components ── */
const Field = ({ label, value, full, children }) => (
  <div className={`ld-field${full ? ' ld-field--full' : ''}`}>
    <div className="ld-field__key">{label}</div>
    <div className={`ld-field__val${!value && !children ? ' ld-field__val--empty' : ''}`}>
      {children || value || '—'}
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="ld-section">
    <div className="ld-section__title">{title}</div>
    <div className="ld-section__body">{children}</div>
  </div>
);

/* ── main ── */
const CptLicenseDtails = () => {
  const id      = useSelector((s) => s.LicensesReducer.LicenseID);
  const license = useSelector((s) => s.LicensesReducer.licenseDetails);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ResetLicenseData());
    if (id) dispatch(GetOneLicense(id));
  }, [id]);

  const genderLabel = license.Gendor === 1 ? 'Male' : license.Gendor === 0 ? 'Female' : '—';
  const formattedDob = license.DateOfBirth
    ? new Date(license.DateOfBirth).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : null;
  const formattedIssue = license.IssueDate
    ? new Date(license.IssueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : null;
  const formattedExpiry = license.ExpirationDate
    ? new Date(license.ExpirationDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="license-details">

      {/* ── Header ── */}
      <div className="ld-header">
        {license.ImagePath ? (
          <img className="ld-header__photo" src={license.ImagePath} alt={license.FullName} />
        ) : (
          <div className="ld-header__photo-placeholder"><UserIcon /></div>
        )}
        <div className="ld-header__text">
          <div className="ld-header__label">Driver License</div>
          <div className="ld-header__name">{license.FullName || '—'}</div>
          <div className="ld-header__meta">
            <span className={`ld-status ld-status--${license.IsActive ? 'active' : 'inactive'}`}>
              {license.IsActive ? 'Active' : 'Inactive'}
            </span>
            {license.IsDetained && (
              <span className="ld-detained-badge">
                <LockIcon /> Detained
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── License section ── */}
      <Section title="License Information">
        <Field label="License ID"    value={license.LicenseID} />
        <Field label="Application ID" value={license.ApplicationID} />
        <Field label="Driver ID"     value={license.DriverID} />
        <Field label="License Class">
          {license.ClassName
            ? <span className="ld-class-badge">{license.ClassName}</span>
            : null}
        </Field>
        <Field label="Issue Reason"  value={license.IssueReason} />
        <Field label="Paid Fees">
          {license.PaidFees != null
            ? <span className="ld-fees-badge">${license.PaidFees}</span>
            : null}
        </Field>
        <Field label="Issue Date"    value={formattedIssue} />
        <Field label="Expiry Date"   value={formattedExpiry} />
        <Field label="Notes"         value={license.Notes} full />
      </Section>

      {/* ── Driver section ── */}
      <Section title="Driver Information">
        <Field label="National No"   value={license.NationalNo} />
        <Field label="Date of Birth" value={formattedDob} />
        <Field label="Gender"        value={genderLabel} />
        <Field label="Created By User ID" value={license.CreatedByUserID} />
      </Section>

    </div>
  );
};

export default CptLicenseDtails;