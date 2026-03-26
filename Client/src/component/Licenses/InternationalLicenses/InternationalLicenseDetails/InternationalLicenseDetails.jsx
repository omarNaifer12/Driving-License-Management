import React, { useEffect } from 'react';
import './InternationalLicenseDetails.css';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GetOneInetnationalLicense } from '../../../../Redux/Actions/LicensesAction';

/* ── icons ── */
const UserIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);

/* ── sub-components ── */
const Field = ({ label, value, full, children }) => (
  <div className={`ild-field${full ? ' ild-field--full' : ''}`}>
    <div className="ild-field__key">{label}</div>
    <div className={`ild-field__val${!value && !children ? ' ild-field__val--empty' : ''}`}>
      {children || value || '—'}
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="ild-section">
    <div className="ild-section__title">{title}</div>
    <div className="ild-section__body">{children}</div>
  </div>
);

const safeDate = (raw) => {
  if (!raw) return null;
  try { return new Date(raw).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }); }
  catch { return null; }
};

/* ── main ── */
const InternationalLicenseDetails = () => {
  const { InaternationalLicenseID } = useParams();
  const dispatch = useDispatch();
  const lic = useSelector((s) => s?.LicensesReducer?.InaternationalLicenseDetails) || {};
console.log("InaternationalLicenseID",InaternationalLicenseID);
console.log("lic",lic);

  useEffect(() => {
    dispatch(GetOneInetnationalLicense(InaternationalLicenseID));
  }, [InaternationalLicenseID]);

  const genderLabel = lic?.Gendor === 0 ? 'Male' : lic?.Gendor === 1 ? 'Female' : null;

  return (
    <div className="intl-license-details">

      {/* ── Header ── */}
      <div className="ild-header">
        {lic.ImagePath ? (
          <img className="ild-header__photo" src={lic.ImagePath} alt="Driver" />
        ) : (
          <div className="ild-header__photo-placeholder"><UserIcon /></div>
        )}
        <div className="ild-header__text">
          <div className="ild-header__label">International Driving License</div>
          <div className="ild-header__title">License #{InaternationalLicenseID}</div>
          <div className="ild-header__badges">
            <span className={`ild-status ild-status--${lic.IsActive ? 'active' : 'inactive'}`}>
              {lic.IsActive ? 'Active' : 'Inactive'}
            </span>
            <span className="ild-globe-badge">
              <GlobeIcon /> International
            </span>
          </div>
        </div>
      </div>

      {/* ── License section ── */}
      <Section title="License Information">
        <Field label="License ID"              value={lic.InternationalLicenseID} />
        <Field label="Application ID"          value={lic.ApplicationID} />
        <Field label="Issued Using Local ID"   value={lic.IssuedUsingLocalLicenseID} />
        <Field label="Issue Date"              value={safeDate(lic.IssueDate)} />
        <Field label="Expiration Date"         value={safeDate(lic.ExpirationDate)} />
        <Field label="Status">
          <span className={`ild-badge ild-badge--${lic.IsActive ? 'gold' : 'purple'}`}>
            {lic.IsActive ? 'Active' : 'Inactive'}
          </span>
        </Field>
      </Section>

      {/* ── Driver section ── */}
      <Section title="Driver Information">
        <Field label="Driver ID"    value={lic.DriverID} />
        <Field label="National No"  value={lic.NationalNo} />
        <Field label="Date of Birth" value={safeDate(lic.DateOfBirth)} />
        <Field label="Gender"       value={genderLabel} />
      </Section>

    </div>
  );
};

export default InternationalLicenseDetails;