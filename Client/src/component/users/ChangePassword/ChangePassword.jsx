import React, { useContext,useState,useEffect } from 'react'
import "./ChangePassword.css"
import axios from "axios"
import { useNavigate,useParams } from 'react-router-dom'
import CptUserInformation from '../CptUserInformation/CptUserInformation'
import { StoreContext } from '../../../context/storeContext'
const ChangePassword = () => {
    const { id } = useParams();
    const { user, setUser } = useContext(StoreContext);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
  
    const handleChangePassword = async () => {
      if (currentPassword !== user.Password) {
        alert('Current password is incorrect');
        return;
      }
      if (newPassword !== confirmPassword) {
        alert('New password and confirm password do not match');
        return;
      }
  
      try {
        const response = await axios.put(`http://localhost:3000/users/${user.id}`, {
          ...user,
          Password: newPassword
        });
  
      
          setUser({ ...user, Password: newPassword });
          alert('Password changed successfully');
        
        
      } catch (error) {
        console.log('Error changing password:', error);
        alert('Failed to change password');
      }
    };
  
    return (
      <div className="change-password-container">
        <CptUserInformation userID={id} />
        <div className="password-change-form">
          <h2>Change Password</h2>
          <div className="form-group">
            <label htmlFor="current-password">Current Password</label>
            <input
              type="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button  onClick={handleChangePassword}>Save</button>
        </div>
      </div>
    );
  };

export default ChangePassword