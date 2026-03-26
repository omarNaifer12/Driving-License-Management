import React, { useEffect, useState } from 'react';
import './AllLocalDrivingApplication.css';
import { deleteDataAPI, getDataAPI } from '../../utils/fetchData';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetLocalDrivingLicenseByIDAction, ResetLocalDrivingLicenseDataAction } from '../../Redux/Actions/LocalDrivingLicenseAction';
import { PassedTestCountAction } from '../../Redux/Actions/TestsAction';
import { ResetLicenseData, ResetLicenseID, setLicenseID } from '../../Redux/Actions/LicensesAction';

/* ── icons ── */
const InfoIcon    = () => <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
const EditIcon    = () => <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon   = () => <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const TestIcon    = () => <svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
const StarIcon    = () => <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const LicenseIcon = () => <svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const AlertIcon   = () => <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const SwapIcon    = () => <svg viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>;
const LockIcon    = () => <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const UnlockIcon  = () => <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>;
const RefreshIcon = () => <svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;
const GlobeIcon   = () => <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const CheckIcon   = () => <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>;
const XIcon       = () => <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

/* ── helpers ── */
const statusClass = (status) => {
  if (!status) return 'default';
  const s = status.toLowerCase();
  if (s === 'new')       return 'new';
  if (s === 'completed') return 'completed';
  if (s === 'cancelled') return 'cancelled';
  return 'default';
};

const ConfirmModal = ({ name, onConfirm, onCancel }) => (
  <div className="confirm-overlay" onClick={onCancel}>
    <div className="confirm-modal" onClick={e => e.stopPropagation()}>
      <div className="confirm-modal__header">
        <div className="confirm-modal__icon"><AlertIcon /></div>
        <span className="confirm-modal__title">Delete Application</span>
      </div>
      <div className="confirm-modal__body">
        <p>Delete application <strong>#{name}</strong>? This action cannot be undone.</p>
        <div className="confirm-modal__actions">
          <button className="confirm-modal__cancel" onClick={onCancel}>Cancel</button>
          <button className="confirm-modal__confirm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  </div>
);

const Toast = ({ message, type }) =>
  message ? (
    <div className={`alda-toast alda-toast--${type}`}>
      {type === 'success' ? <CheckIcon /> : <XIcon />}
      {message}
    </div>
  ) : null;

/* ── main ── */
const AllLocalDrivingApplication = () => {
  const [applications, setApplications] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const response = await getDataAPI('LocalDrivingLicenses/All');
      setApplications(response.data);
    } catch (error) { console.error('Error fetching applications:', error); }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  const confirmDelete = async () => {
    try {
      await deleteDataAPI(`LocalDrivingLicenses/Delete/${pendingDelete}`);
      setApplications(prev => prev.filter(a => a.LocalDrivingLicenseApplicationID !== pendingDelete));
      showToast('Application deleted successfully', 'success');
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Failed to delete application', 'error');
    } finally { setPendingDelete(null); }
  };

  const handleDetails = (id) => {
    dispatch(ResetLocalDrivingLicenseDataAction());
    dispatch(GetLocalDrivingLicenseByIDAction(id));
    dispatch(PassedTestCountAction(id));
    navigate('/LocalDrivingLicenseDetails');
  };

  const resetAndNavigate = (path) => {
    dispatch(ResetLicenseData());
    dispatch(ResetLicenseID());
    navigate(path);
  };

  const checkLicenseAndNavigate = async (id) => {
    try {
      const response = await getDataAPI(`Licenses/ActiveLicensePerson/${id}`);
      if (response.data !== -1) {
        dispatch(setLicenseID(response.data));
        navigate('/license-details');
      }
    } catch (error) { console.error('License check error:', error); }
  };

  return (
    <>
      <div className="local-driving-application-list-container">
        {/* ── Top bar ── */}
        <div className="ldl-list-topbar">
          <div>
            <h1>Driving License Applications</h1>
            <p className="ldl-list-topbar__sub">{applications.length} application{applications.length !== 1 ? 's' : ''} found</p>
          </div>
         
        </div>

        {/* ── Table ── */}
        <div className="ldl-table-wrap">
          <table className="local-driving-application-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Class</th>
                <th>National No</th>
                <th>Full Name</th>
                <th>Date</th>
                <th>Tests</th>
                <th>Status</th>
                <th>Actions</th>
                <th>License</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.LocalDrivingLicenseApplicationID}>
                  <td className="muted">{app.LocalDrivingLicenseApplicationID}</td>
                  <td><strong>{app.ClassName}</strong></td>
                  <td className="muted">{app.NationalNo}</td>
                  <td>{app.FullName}</td>
                  <td className="muted">{app.ApplicationDate}</td>
                  <td>
                    <span className={`test-count-badge${app.PassedTestCount === 3 ? ' test-count-badge--complete' : ''}`}>
                      {app.PassedTestCount}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill status-pill--${statusClass(app.Status)}`}>
                      {app.Status}
                    </span>
                  </td>

                  {/* main actions */}
                  <td>
                    <div className="ldl-action-cell">
                      <button className="btn-action btn-details" onClick={() => handleDetails(app.LocalDrivingLicenseApplicationID)}>
                        <InfoIcon /> Details
                      </button>
                      <button className="btn-action btn-update" onClick={() => navigate(`/EditLocalDrivingLicense/${app.LocalDrivingLicenseApplicationID}`)}>
                        <EditIcon /> Edit
                      </button>
                      <button className="btn-action btn-delete" onClick={() => setPendingDelete(app.LocalDrivingLicenseApplicationID)}>
                        <TrashIcon /> Delete
                      </button>
                      <button className="btn-action btn-tests"
                        onClick={() => navigate(`/TestAppointmentsForTestType/${app.LocalDrivingLicenseApplicationID}/${app.PassedTestCount}`)}>
                        <TestIcon /> Tests
                      </button>
                    </div>
                  </td>

                  {/* conditional license actions */}
                  <td>
                    <div className="ldl-action-cell-2">
                      {app.Status === 'New' && app.PassedTestCount === 3 && (
                        <button className="btn-action btn-issue"
                          onClick={() => navigate(`/Issue-Local-Driving-License-FirstTime/${app.LocalDrivingLicenseApplicationID}`)}>
                          <StarIcon /> Issue License
                        </button>
                      )}
                      {app.Status === 'Completed' && (
                        <button className="btn-action btn-license"
                          onClick={() => checkLicenseAndNavigate(app.LocalDrivingLicenseApplicationID)}>
                          <LicenseIcon /> View License
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pendingDelete && (
        <ConfirmModal
          name={pendingDelete}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
      <Toast message={toast.message} type={toast.type} />
    </>
  );
};

export default AllLocalDrivingApplication;