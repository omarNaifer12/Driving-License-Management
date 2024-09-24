import React, { useContext,useState,useEffect } from 'react'
import "./ChangePassword.css"
import axios from "axios"
import { useNavigate,useParams } from 'react-router-dom'
import CptUserInformation from '../CptUserInformation/CptUserInformation'
import { StoreContext } from '../../../context/storeContext'
import { useDispatch, useSelector } from 'react-redux'
import { getOneUserAction } from '../../../Redux/Actions/UsersAction'
import { postDataAPI } from '../../../utils/fetchData'
import { BASE_URL } from '../../../utils/config'
const ChangePassword = () => {
    const { id } = useParams();
    const user=useSelector((state)=>state.Users.user);
    const [currentPassword,setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const dispatch=useDispatch();
    useEffect(()=>{
      if(id){
        dispatch(getOneUserAction(id));
      }

    },[id,dispatch]);
    const handleChangePassword = async () => {
      if (currentPassword!== user.Password){
        alert('Current password is incorrect');
        return;
      }
      if (newPassword !== confirmPassword) {
        alert('New password and confirm password do not match');
        return;
      }
      try {
        console.log("before add try this pass and id user",user.UserID,newPassword);
        
        const response= await axios.post(`${BASE_URL}/api/Users/ChangePassword?UserID=${user.UserID}&password=${newPassword}`);
        console.log("response of change password is ",response);
        
          if(response.status===200){
          alert('Password changed successfully');
          }
          else 
          alert('error change password');
        
      } catch (error) {
        console.log('Error changing password:', error);
        alert('Failed to change password');
      }
    };
  
    return (
      <div className="change-password-container">
        <CptUserInformation />
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