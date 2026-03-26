import React, { useState, useEffect } from 'react';
import './ChangePassword.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CptUserInformation from '../CptUserInformation/CptUserInformation';
import { useDispatch, useSelector } from 'react-redux';
import { getOneUserAction } from '../../../Redux/Actions/UsersAction';
import { BASE_URL } from '../../../utils/config';


const LockIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const EyeIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── password field with eye toggle ── */
const PasswordField = ({ id, label, value, onChange }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-form-group">
      <label htmlFor={id}>{label}</label>
      <div className="password-form-group__input-wrap">
        <input
          type={visible ? 'text' : 'password'}
          id={id}
          value={value}
          onChange={onChange}
          autoComplete="off"
        />
        <button
          
          className="password-form-group__eye"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
};

/* ── toast ── */
const Toast = ({ message, type }) =>
  message ? (
    <div className={`cp-toast cp-toast--${type}`}>
      {type === 'success' ? <CheckIcon /> : <XIcon />}
      {message}
    </div>
  ) : null;

/* ── main component ── */
const ChangePassword = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.Users.user);
  const dispatch = useDispatch();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    if (id) dispatch(getOneUserAction(id));
  }, [id, dispatch]);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  const handleChangePassword = async () => {
    if (currentPassword !== user.Password) {
      showToast('Current password is incorrect');
      return;
    }
    if (!newPassword) {
      showToast('New password cannot be empty');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/api/Users/ChangePassword?UserID=${user.UserID}&password=${newPassword}`
      );
      if (response.status === 200) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        showToast('Password changed successfully', 'success');
      } else {
        showToast('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showToast('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="change-password-container">
        {/* left: reusable user info card */}
        <CptUserInformation />

        {/* right: password form card */}
        <div className="password-change-form">
          <div className="password-change-form__header">
            <div className="password-change-form__header-icon"><LockIcon /></div>
            <span className="password-change-form__header-title">Change Password</span>
          </div>

          <div className="password-change-form__body">
            <PasswordField
              id="current-password"
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <div className="password-change-form__divider" />

            <PasswordField
              id="new-password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <PasswordField
              id="confirm-password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              className="password-change-form__submit"
              onClick={handleChangePassword}
              disabled={loading}
            >
              {loading ? 'Saving…' : 'Save Password'}
            </button>
          </div>
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} />
    </>
  );
};

export default ChangePassword;