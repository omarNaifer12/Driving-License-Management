import React, { useEffect } from 'react';
import './CptUserInformation.css';
import CptPersonInformation from '../../componentsPersons/CptPersonInformation/CptPersonInformation';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOneUserAction, ResetUserData } from '../../../Redux/Actions/UsersAction';

const UserIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const CptUserInformation = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.Users.user);

  useEffect(() => {
    if (id) {
      dispatch(ResetUserData());
      dispatch(getOneUserAction(id));
    }
  }, [id, dispatch]);

  if (!user?.UserID) return null;

  const isActive = user.IsActive;

  return (
    <div className="user-info-container">
      {/* Reusable person card */}
      <CptPersonInformation id={user.PersonID} />

      {/* User-specific card */}
      <div className="user-details">
        <div className="user-details__header">
          <div className="user-details__header-icon"><UserIcon /></div>
          <span className="user-details__header-title">Account Details</span>
        </div>

        <div className="user-details__row">
          <span className="user-details__key">User ID</span>
          <span className="user-details__val">{user.UserID ?? '—'}</span>
        </div>

        <div className="user-details__row">
          <span className="user-details__key">Username</span>
          <span className="user-details__val">{user.UserName ?? '—'}</span>
        </div>

        <div className="user-details__row">
          <span className="user-details__key">Status</span>
          <span className="user-details__val">
            <span className={`user-details__badge user-details__badge--${isActive ? 'active' : 'inactive'}`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CptUserInformation;