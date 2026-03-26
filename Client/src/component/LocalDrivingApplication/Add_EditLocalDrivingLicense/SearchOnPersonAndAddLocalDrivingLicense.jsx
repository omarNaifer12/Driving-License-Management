import React, { useState, useEffect } from 'react';
import './SearchOnPersonAndAddLocalDrivingLicense.css';
import CptSearchForPerson from '../../componentsPersons/CptSearchForPerson/CptSearchForPerson';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  GetLocalDrivingLicenseByIDAction,
  ResetLocalDrivingLicenseDataAction,
} from '../../../Redux/Actions/LocalDrivingLicenseAction';
import { getOneUserAction } from '../../../Redux/Actions/UsersAction';
import { GetApplicationTypeByID } from '../../../helper/ApplicationType';
import { getDataAPI, postDataAPI, putDataAPI } from '../../../utils/fetchData';

/* ════════════════════ ICONS ════════════════════ */
const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" stroke="#fff" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const LicenseIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
);
const TagIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
);
const SaveIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);
const ToastCheckIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
);
const ToastXIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const Toast = ({ message, type }) =>
  message ? (
    <div className={`ldl-toast ldl-toast--${type}`}>
      {type === 'success' ? <ToastCheckIcon /> : <ToastXIcon />}
      {message}
    </div>
  ) : null;

const SearchOnPersonAndAddLocalDrivingLicense = () => {
  const { id }    = useParams();
  const dispatch  = useDispatch();
console.log("idididididididid SearchOnPersonAndAddLocalDrivingLicense",id);

  const personFromRedux              = useSelector((s) => s.Persons.Person);
  const user                         = useSelector((s) => s.Users.user);
  const localDrivingLicenseFromRedux = useSelector((s) => s.LocalDrivingLicenses.LocalDrivingLicense);

  const [step, setStep]   = useState(1);
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState({ message: '', type: 'success' });
  const [licenseClasses, setLicenseClasses] = useState([]);

  const [localDrivingLicense, setLocalDrivingLicense] = useState({
    ApplicationID: 0,
    ApplicantPersonID: 0,
    ApplicationDate: new Date().toISOString().split('T')[0],
    ApplicationTypeID: 1,
    ApplicationStatus: 1,
    LastStatusDate: new Date().toISOString().split('T')[0],
    PaidFees: 0,
    CreatedByUserID: 0,
    CreatedByUserName: '',
    LicenseClassID: 1,
    localDrivingLicenseID: 0,
  });

  /* ── load on mount ── */
  useEffect(() => {
    const loadData = async () => {
      dispatch(ResetLocalDrivingLicenseDataAction());
      if (id) {
        dispatch(GetLocalDrivingLicenseByIDAction(id));
        setStep(2); // editing an existing record → jump straight to step 2
      } else {
        const userID = parseInt(localStorage.getItem('UserID'), 10);
        dispatch(getOneUserAction(userID));
        const applicationType = await GetApplicationTypeByID(1);
        console.log("applicationTypeapplicationType",applicationType);
        console.log("applicationType.ApplicationFees",applicationType.ApplicationFees);
        console.log("localDrivingLicense.PaidFees",localDrivingLicense.PaidFees);
        
        setLocalDrivingLicense((prev) => ({ ...prev, PaidFees: applicationType.ApplicationFees }));
      }
    };
    loadData();
    fetchLicenseClasses();
  }, [id]);

  /* ── sync redux → local state ── */
  useEffect(() => {
    if (localDrivingLicenseFromRedux?.ApplicationID) {
        console.log("enter localDrivingLicenseFromRedux",localDrivingLicenseFromRedux);
        
      setLocalDrivingLicense(localDrivingLicenseFromRedux);
    }
  }, [localDrivingLicenseFromRedux, user, personFromRedux]);

  const fetchLicenseClasses = async () => {
    try {
      const response = await getDataAPI('LicenseClasses/All');
      setLicenseClasses(response.data);
    } catch (error) {
      console.error('Error fetching license classes:', error);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  /* ── validation helpers ── */
  const checkPersonHaveSameLDL = async (personID, classID) => {
    try {
      const response = await getDataAPI(
        `LocalDrivingLicenses/checkPersonHaveSameLDL?ApplicationTypeID=1&ApplicantPersonID=${personID}&LicenseClassID=${classID}`
      );
      return !response.data.success; // true = already has one (block)
    } catch { return false; }
  };

  const checkPersonHaveLicenseForClass = async (personID, classID) => {
    try {
      const response = await getDataAPI(
        `Licenses/IsHaveLicenseForLicenseClass?PersonID=${personID}&LicenseClassID=${classID}`
      );
      return response.status === 200;
    } catch (error) {
      return error?.response?.status !== 404;
    }
  };

  /* ── save ── */
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const applicationDto = {
      ApplicationID:      localDrivingLicense.ApplicationID,
      ApplicantPersonID:  localDrivingLicense.ApplicantPersonID || personFromRedux.PersonID,
      ApplicationDate:    localDrivingLicense.ApplicationDate,
      ApplicationTypeID:  localDrivingLicense.ApplicationTypeID,
      ApplicationStatus:  localDrivingLicense.ApplicationStatus,
      LastStatusDate:     new Date().toISOString(),
      PaidFees:           localDrivingLicense.PaidFees,
      CreatedByUserID:    localDrivingLicense.CreatedByUserID || user.UserID,
    };

    try {
      if (localDrivingLicense.localDrivingLicenseID === 0 && !id) {
        // ── Add new ──
        const hasLicense = await checkPersonHaveLicenseForClass(
          applicationDto.ApplicantPersonID, localDrivingLicense.LicenseClassID
        );
        if (hasLicense) {
          showToast('This person already has a license issued for this class.', 'error');
          setSaving(false); return;
        }
        const hasActiveLDL = await checkPersonHaveSameLDL(
          applicationDto.ApplicantPersonID, localDrivingLicense.LicenseClassID
        );
        if (hasActiveLDL) {
          showToast('This person already has an active local driving license.', 'error');
          setSaving(false); return;
        }
        const response = await postDataAPI(
          `LocalDrivingLicenses/Add?licenseClassID=${localDrivingLicense.LicenseClassID}`,
          applicationDto
        );
        setLocalDrivingLicense((prev) => ({
          ...prev,
          localDrivingLicenseID: response.data.localDrivingLicenseData.LocalDrivingLicenseApplicationID,
          ApplicationID: response.data.applicationDto.ApplicationID,
        }));
        dispatch(GetLocalDrivingLicenseByIDAction(
          response.data.localDrivingLicenseData.LocalDrivingLicenseApplicationID
        ));
        showToast('License application added successfully.', 'success');
      } else {
        // ── Update ──
        await putDataAPI(
          `LocalDrivingLicenses/Update/${localDrivingLicense.localDrivingLicenseID}?licenseClassID=${localDrivingLicense.LicenseClassID}`,
          applicationDto
        );
        showToast('License application updated successfully.', 'success');
      }
    } catch (error) {
      console.error('Error saving LDL application:', error);
      showToast('Failed to save. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const personSelected = Boolean(personFromRedux.PersonID);
  const isEdit         = Boolean(localDrivingLicense.localDrivingLicenseID);
console.log("localDrivingLicenselocalDrivingLicenselocalDrivingLicense",localDrivingLicense);

  return (
    <>
      <div className="ldl-container">
        {/* ── Heading ── */}
        <div>
          <h1>Local Driving License</h1>
        </div>

        {/* ── Step indicator ── */}
        <div className="ldl-steps">
          <div className={`ldl-step ${step === 1 ? 'ldl-step--active' : 'ldl-step--done'}`}>
            <div className="ldl-step__circle">{step > 1 ? <CheckIcon /> : '1'}</div>
            <span className="ldl-step__label">Find Applicant</span>
          </div>
          <div className={`ldl-step__line${step > 1 ? ' ldl-step__line--done' : ''}`} />
          <div className={`ldl-step${step === 2 ? ' ldl-step--active' : ''}`}>
            <div className="ldl-step__circle">2</div>
            <span className="ldl-step__label">License Details</span>
          </div>
        </div>

        {/* ════════════ STEP 1 ════════════ */}
        {step === 1 && (
          <>
            <CptSearchForPerson
              PersonID={personFromRedux.PersonID || undefined}
            />
            {personSelected && (
              <button className="ldl-next-btn" onClick={() => setStep(2)}>
                Next <ArrowRightIcon />
              </button>
            )}
          </>
        )}

        {/* ════════════ STEP 2 ════════════ */}
        {step === 2 && (
          <>
            {/* back */}
            {!id && (
              <button className="ldl-back-btn" onClick={() => setStep(1)}>
                <ArrowLeftIcon /> Back to Search
              </button>
            )}

            {/* person strip */}
            {personSelected && (
              <div className="ldl-person-strip">
                <div className="ldl-person-strip__avatar">
                  {personFromRedux.FirstName?.[0]}{personFromRedux.LastName?.[0]}
                </div>
                <div>
                  <div className="ldl-person-strip__name">
                    {[personFromRedux.FirstName, personFromRedux.SecondName,
                      personFromRedux.ThirdName, personFromRedux.LastName]
                      .filter(Boolean).join(' ')}
                  </div>
                  <div className="ldl-person-strip__id">
                    Person ID: {personFromRedux.PersonID}
                  </div>
                </div>
              </div>
            )}

            {/* ── License form card ── */}
            <div className="ldl-card">
              {/* header */}
              <div className="ldl-card__header">
                <div className="ldl-card__header-icon"><LicenseIcon /></div>
                <div className="ldl-card__header-text">
                  <div className="ldl-card__header-label">Application</div>
                  <div className="ldl-card__header-title">
                    {isEdit ? 'Update License Application' : 'New License Application'}
                  </div>
                </div>
              </div>

              {/* ID strip */}
              <div className="ldl-card__id-row">
                <TagIcon />
                <span>D.L. Application ID:</span>
                <span className="ldl-card__id-val">
                  {localDrivingLicense.localDrivingLicenseID || '— (new)'}
                </span>
              </div>

              {/* body */}
              <div className="ldl-card__body">

                {/* read-only info rows */}
                <div className="ldl-info-row">
                  <span className="ldl-info-row__key">Application Date</span>
                  <span className="ldl-info-row__val">{localDrivingLicense.ApplicationDate}</span>
                </div>

                <div className="ldl-info-row">
                  <span className="ldl-info-row__key">Application Fees</span>
                  <span className="ldl-info-row__badge">${localDrivingLicense.PaidFees}</span>
                </div>

                <div className="ldl-info-row">
                  <span className="ldl-info-row__key">Created By</span>
                  <span className="ldl-info-row__val">
                    {user.UserID ? user.UserName : localDrivingLicense.CreatedByUserName || '—'}
                  </span>
                </div>

                <div className="ldl-divider" />

                {/* editable: license class */}
                <div className="ldl-field">
                  <label>License Class</label>
                  <select
                    value={localDrivingLicense.LicenseClassID}
                    onChange={(e) =>
                      setLocalDrivingLicense((prev) => ({ ...prev, LicenseClassID: e.target.value }))
                    }
                  >
                    {licenseClasses.map((cls) => (
                      <option key={cls.LicenseClassID} value={cls.LicenseClassID}>
                        {cls.ClassName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ldl-divider" />

                {/* save */}
                <button className="ldl-save-btn" onClick={handleSave} disabled={saving}>
                  <SaveIcon />
                  {saving ? 'Saving…' : isEdit ? 'Update Application' : 'Submit Application'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <Toast message={toast.message} type={toast.type} />
    </>
  );
};

export default SearchOnPersonAndAddLocalDrivingLicense;