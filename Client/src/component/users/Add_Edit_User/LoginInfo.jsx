import React, { useEffect, useState } from 'react';
import './LoginInfo.css';
import { useDispatch, useSelector } from 'react-redux';
import { postDataAPI, putDataAPI } from '../../../utils/fetchData';
import { useParams } from 'react-router-dom';
import { getOneUserAction, ResetUserData } from '../../../Redux/Actions/UsersAction';

/* ── icons ── */
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const TagIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
);
const EyeIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
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

/* ── password field ── */
const PasswordField = ({ label, name, value, onChange }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="user-form-group">
      <label>{label}</label>
      <div className="user-form-group__input-wrap">
        <input
          type={visible ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete="off"
        />
        <button type="button" className="user-form-group__eye"
          onClick={() => setVisible(v => !v)} tabIndex={-1}>
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
};

/* ── toast ── */
const Toast = ({ message, type }) =>
  message ? (
    <div className={`li-toast li-toast--${type}`}>
      {type === 'success' ? <CheckIcon /> : <XIcon />}
      {message}
    </div>
  ) : null;

/* ── main ── */
const LoginInfo = ({ id } ) => {
  const person = useSelector((state) => state.Persons.Person);
  const User   = useSelector((state) => state.Users.user);
  const dispatch = useDispatch();

  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState({ message: '', type: 'success' });
  const [user, setUser] = useState({
    UserID: 0, PersonID: 0, FullName: '',
    IsActive: false, UserName: '', Password: '',
  });

  useEffect(() => {
    dispatch(ResetUserData());
    if (id) dispatch(getOneUserAction(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (id && User.UserID) {
      setUser(User);
      setConfirmPassword(User.Password);
    } else if (!id && person.PersonID) {
      setUser(prev => ({ ...prev, PersonID: person.PersonID }));
    }
  }, [id, User]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("enter save user","user.UserID :",user.UserID,"  person.PersonID :",person.PersonID);
    
    if (user.Password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    setSaving(true);
    try {
      if (user.UserID) {
        await putDataAPI(`Users/Update/${user.UserID}`, user);
        showToast('User updated successfully', 'success');
      } else if (!id && person.PersonID) {
        const res = await postDataAPI('Users/Add', user);
        setUser(prev => ({ ...prev, UserID: res.data.UserID }));
        showToast('User created successfully', 'success');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      showToast('Failed to save user', 'error');
    } finally {
      setSaving(false);
    }
  };

  const isEdit = Boolean(user.UserID);

  return (
    <>
      <div className="login-info-container">
        <div className="li-card">

      

          {/* ── user ID strip ── */}
          <div className="li-card__id-row">
            <TagIcon />
            <span>User ID:</span>
            <span className="li-card__id-val">{user.UserID || '—  (new)'}</span>
          </div>

          {/* ── form ── */}
          <div className="li-card__body">
            {/* Username */}
            <div className="form-group">
              <label>Username</label>
              <input
                className="plain-input"
                type="text"
                name="UserName"
                value={user.UserName}
                onChange={handleChange}
                placeholder="Enter username…"
              />
            </div>

            <div className="li-divider" />

            {/* Passwords */}
            <PasswordField
              label="Password"
              name="Password"
              value={user.Password}
              onChange={handleChange}
            />
            <PasswordField
              label="Confirm Password"
              name="_confirm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="li-divider" />

            {/* IsActive toggle */}
            <div className="form-group is-active">
              <label>Active Status</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={`toggle-status ${user.IsActive ? 'on' : 'off'}`}>
                  {user.IsActive ? 'Active' : 'Inactive'}
                </span>
                <div
                  className={`toggle-switch ${user.IsActive ? 'active' : ''}`}
                  onClick={() => setUser(prev => ({ ...prev, IsActive: !prev.IsActive }))}
                  role="switch"
                  aria-checked={user.IsActive}
                />
              </div>
            </div>

            {/* Save */}
            <button className="li-save-btn" onClick={handleSave} disabled={saving}>
              <SaveIcon />
              {saving ? 'Saving…' : isEdit ? 'Update User' : 'Create User'}
            </button>
          </div>
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} />
    </>
  );
};

export default LoginInfo;