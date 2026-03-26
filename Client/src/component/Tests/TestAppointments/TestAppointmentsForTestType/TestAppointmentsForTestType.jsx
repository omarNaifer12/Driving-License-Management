import React, { useEffect, useState } from 'react';
import './TestAppointmentsForTestType.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CptLocalDrivingApplicationDetails from '../../../LocalDrivingApplication/CptLocalDrivingApplicationDetails/CptLocalDrivingApplicationDetails';
import { getDataAPI } from '../../../../utils/fetchData';
import { GetTestTypeByIdAction, PassedTestCountAction, TrialTestsAction } from '../../../../Redux/Actions/TestsAction';
import { GetLocalDrivingLicenseByIDAction } from '../../../../Redux/Actions/LocalDrivingLicenseAction';

/* ══════════════ TEST TYPE ICONS ══════════════ */

/* Vision Test — eye icon */
const VisionIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
    <line x1="12" y1="5" x2="12" y2="3"/>
    <line x1="16.95" y1="6.34" x2="18.36" y2="4.93"/>
    <line x1="19" y1="11" x2="21" y2="11"/>
  </svg>
);

/* Written Test — book/pen icon */
const WrittenIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    <path d="M4 6H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2"/>
  </svg>
);

/* Practical Test — steering wheel / car icon */
const PracticalIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="3"/>
    <line x1="12" y1="2"  x2="12" y2="9"/>
    <line x1="4.22" y1="4.22" x2="9.17" y2="9.17"/>
    <line x1="2"    y1="12" x2="9"  y2="12"/>
  </svg>
);

/* ── other icons ── */
const PlusIcon    = () => <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const CheckIcon   = () => <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>;
const LockIcon    = () => <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const PlayIcon    = () => <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const CalendarIcon= () => <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const XIcon       = () => <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

/* ── test type config ── */
const TEST_TYPES = [
  { label: 'Vision Test',    step: 'Step 1 of 3', Icon: VisionIcon,   sub: 'Eyesight & visual acuity evaluation' },
  { label: 'Written Test',   step: 'Step 2 of 3', Icon: WrittenIcon,  sub: 'Road rules & traffic regulations exam' },
  { label: 'Practical Test', step: 'Step 3 of 3', Icon: PracticalIcon,sub: 'On-road driving performance assessment' },
];

/* ── toast ── */
const Toast = ({ message }) =>
  message ? (
    <div className="taft-toast taft-toast--error">
      <XIcon /> {message}
    </div>
  ) : null;

/* ══════════════ MAIN ══════════════ */
const TestAppointmentsForTestType = () => {
  const { localDrivingLicenseID, CountPassedTest } = useParams();
  const CountPassedTests = parseInt(CountPassedTest, 10);
  const dispatch  = useNavigate();
  const navigate  = useNavigate();
  const reduxDispatch = useDispatch();

  const [appointments, setAppointments] = useState([]);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  useEffect(() => {
    reduxDispatch(GetLocalDrivingLicenseByIDAction(localDrivingLicenseID));
    reduxDispatch(PassedTestCountAction(localDrivingLicenseID));
  }, [CountPassedTests, reduxDispatch, localDrivingLicenseID]);

  useEffect(() => {
    fetchAppointments();
    reduxDispatch(GetTestTypeByIdAction(CountPassedTests + 1));
    reduxDispatch(TrialTestsAction(localDrivingLicenseID, CountPassedTests + 1));
  }, [CountPassedTests, localDrivingLicenseID]);

  const fetchAppointments = async () => {
    try {
      const response = await getDataAPI(
        `TestAppointments/TestAppointmentsForTestType?testTypeID=${CountPassedTests + 1}&localDrivingLicenseApplicationID=${localDrivingLicenseID}`
      );
      if (response.status !== 404) setAppointments(response.data);
    } catch (error) { console.error('Error fetching appointments:', error); }
  };

  const checkTestCompleted = async () => {
    try {
      const res = await getDataAPI(`Tests/TestCompleted?localDrivingLicenseApplicationID=${localDrivingLicenseID}&testTypeID=${CountPassedTests + 1}`);
      return res.data === true;
    } catch { return false; }
  };

  const checkActiveScheduled = async () => {
    try {
      const res = await getDataAPI(`TestAppointments/ActiveScheduledTest?localDrivingLicenseApplicationID=${localDrivingLicenseID}&testTypeID=${CountPassedTests + 1}`);
      return res.data === true;
    } catch { return false; }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    if (await checkTestCompleted()) { showToast('This test is already completed.'); return; }
    if (await checkActiveScheduled()) { showToast('There is already an active scheduled test.'); return; }
    navigate('/Add-Test-Appointments');
  };

  const handleTakeTest = (id, locked) => {
    if (locked) { showToast('This test appointment has already been taken.'); return; }
    navigate(`/pass-fail-TestAppointment/${id}`);
  };

  /* ── all tests passed ── */
  if (CountPassedTests === 3) {
    return (
      <div className="taft-container">
        <div className="taft-all-passed">
          <div className="taft-all-passed__icon"><CheckIcon /></div>
          <div>
            <div className="taft-all-passed__title">All Tests Passed!</div>
            <div className="taft-all-passed__sub">This applicant has successfully completed all 3 required tests.</div>
          </div>
        </div>
      </div>
    );
  }

  const testConfig = TEST_TYPES[CountPassedTests];
  const { label, step, Icon, sub } = testConfig;

  return (
    <>
      <div className="taft-container">

        {/* ── Hero banner with test-type icon ── */}
        <div className="taft-hero">
          <div className="taft-hero__icon-wrap"><Icon /></div>
          <div className="taft-hero__text">
            <div className="taft-hero__step">{step}</div>
            <h1 className="taft-hero__title">{label}</h1>
            <div className="taft-hero__sub">{sub}</div>
          </div>
        </div>

        {/* ── LDL details card ── */}
        <CptLocalDrivingApplicationDetails />

        {/* ── Appointments section ── */}
        <div className="taft-section-label">Test Appointments</div>

        <div className="test-appointments-list">
          {appointments.length > 0 ? (
            appointments.map((appt) => (
              <div key={appt.TestAppointmentID} className="test-appointment-item">
                {/* card header */}
                <div className="taf-card__header">
                  <span className="taf-card__id">Appointment #{appt.TestAppointmentID}</span>
                  <span className={`taf-card__lock taf-card__lock--${appt.IsLocked ? 'locked' : 'unlocked'}`}>
                    <LockIcon />
                    {appt.IsLocked ? 'Locked' : 'Open'}
                  </span>
                </div>

                {/* card body */}
                <div className="taf-card__body">
                  <div className="taf-card__row">
                    <span className="taf-card__key"><CalendarIcon style={{display:'inline',width:11,height:11,marginRight:4}} />Date</span>
                    <span className="taf-card__val">
                      {new Date(appt.AppointmentDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="taf-card__row">
                    <span className="taf-card__key">Fees</span>
                    <span className="taf-fees-badge">${appt.PaidFees.toFixed(2)}</span>
                  </div>
                </div>

                {/* take test button */}
                <div className="taf-card__action">
                  <button
                    className={`taf-take-btn taf-take-btn--${appt.IsLocked ? 'locked' : 'active'}`}
                    onClick={() => handleTakeTest(appt.TestAppointmentID, appt.IsLocked)}
                  >
                    {appt.IsLocked ? <><LockIcon /> Already Taken</> : <><PlayIcon /> Take Test</>}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="taft-empty">
              <CalendarIcon />
              <p>No appointments scheduled yet</p>
            </div>
          )}
        </div>

        {/* ── Add appointment ── */}
        <button className="add-test-appointment-btn" onClick={handleAddAppointment}>
          <PlusIcon /> Add Appointment
        </button>

      </div>

      <Toast message={toast} />
    </>
  );
};

export default TestAppointmentsForTestType;