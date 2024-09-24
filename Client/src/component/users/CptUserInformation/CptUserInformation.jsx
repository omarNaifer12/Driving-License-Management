import React, { useContext,useEffect } from 'react'
import "./CptUserInformation.css"
import { StoreContext } from '../../../context/storeContext'
import CptPersonInformation from '../../componentsPersons/CptPersonInformation/CptPersonInformation';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOneUserAction, ResetUserData } from '../../../Redux/Actions/UsersAction';
const CptUserInformation = () => {
   const {id}=useParams();
   const dispatch=useDispatch();
   const user =useSelector((state)=>state.Users.user);
    useEffect(()=>{
    const fetchUser=()=>{    
    if(id){ 
    dispatch(ResetUserData());
    dispatch(getOneUserAction(id));
    }
    };
    fetchUser();
    },[id,dispatch]);
  return (
    user.UserID&&user&& (<div className="user-info-container">
      <CptPersonInformation id={user.PersonID} />
      <div className="user-details">
        <div className="user-detail">
          <strong>User ID:</strong> {user&&user.UserID ? user.UserID : '????'}
        </div>
        <div className="user-detail">
          <strong>Username:</strong> {user&&user.UserID ? user.UserName : '????'}
        </div>
        <div className="user-detail">
          <strong>Active Status:</strong> {user&&user.UserID?user.IsActive ? 'true' : 'false':'????'}
        </div>
      </div>
    </div>)
   
  )
}

export default CptUserInformation