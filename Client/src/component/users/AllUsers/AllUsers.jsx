import React, { useState, useEffect } from 'react';
import './AllUsers.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserAction, GetAllUsersAction } from '../../../Redux/Actions/UsersAction';
import { deleteDataAPI } from '../../../utils/fetchData';
import { ResetPersonData } from '../../../Redux/Actions/peopleAction';

/* ── icons ── */
const PlusIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
);
const InfoIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);
const KeyIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
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

/* ── confirm modal ── */
const ConfirmModal = ({ onConfirm, onCancel }) => (
  <div className="confirm-overlay" onClick={onCancel}>
    <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
      <div className="confirm-modal__header">
        <div className="confirm-modal__icon"><AlertIcon /></div>
        <span className="confirm-modal__title">Delete User</span>
      </div>
      <div className="confirm-modal__body">
        <p>Are you sure you want to delete this user? This action cannot be undone.</p>
        <div className="confirm-modal__actions">
          <button className="confirm-modal__cancel" onClick={onCancel}>Cancel</button>
          <button className="confirm-modal__confirm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  </div>
);

/* ── toast ── */
const Toast = ({ message, type }) =>
  message ? (
    <div className={`au-toast au-toast--${type}`}>
      {type === 'success' ? <CheckIcon /> : <XIcon />}
      {message}
    </div>
  ) : null;

/* ── main component ── */
const AllUsers = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const users      = useSelector((state) => state.Users.users);
  const [pendingDeleteID, setPendingDeleteID] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => { dispatch(GetAllUsersAction()); }, [dispatch]);
const navigateAddUser=()=>{
  dispatch(ResetPersonData());
  navigate('/add-users');
}
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  const confirmDelete = async () => {
    try {
      await deleteDataAPI(`Users/Delete/${pendingDeleteID}`);
      dispatch(deleteUserAction(pendingDeleteID));
      showToast('User deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Failed to delete user', 'error');
    } finally {
      setPendingDeleteID(null);
    }
  };

  return (
    <>
      <div className="all-users">
        {/* top bar */}
        <div className="all-users__topbar">
          <div className="all-users__titles">
            <h1 className="label-manage-users">Manage Users</h1>
            <p className="all-users__sub">{users.length} user{users.length !== 1 ? 's' : ''} registered</p>
          </div>
          <button className="user-add-button" onClick={() => navigateAddUser()}>
            <PlusIcon /> Add User
          </button>
        </div>

        {/* table */}
        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Person ID</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.UserID ?? index}>
                  <td className="muted">{user.UserID}</td>
                  <td className="muted">{user.PersonID}</td>
                  <td><strong>{user.FullName}</strong></td>
                  <td>{user.UserName}</td>
                  <td>
                    <span className={`status-badge status-badge--${user.IsActive ? 'active' : 'inactive'}`}>
                      {user.IsActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn-action edit-button"
                        onClick={() => navigate(`/edit-users/${user.UserID}/${user.PersonID}`)}>
                        <EditIcon /> Edit
                      </button>
                      <button className="btn-action delete-button"
                        onClick={() => setPendingDeleteID(user.UserID)}>
                        <TrashIcon /> Delete
                      </button>
                      <button className="btn-action details-button"
                        onClick={() => navigate(`/user-details/${user.UserID}`)}>
                        <InfoIcon /> Details
                      </button>
                      <button className="btn-action password-button"
                        onClick={() => navigate(`/change-password/${user.UserID}`)}>
                        <KeyIcon /> Password
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pendingDeleteID && (
        <ConfirmModal
          onConfirm={confirmDelete}
          onCancel={() => setPendingDeleteID(null)}
        />
      )}

      <Toast message={toast.message} type={toast.type} />
    </>
  );
};

export default AllUsers;