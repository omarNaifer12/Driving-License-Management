import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AllUsers.css';
import { StoreContext } from '../../../context/storeContext';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserAction, GetAllUsersAction } from '../../../Redux/Actions/UsersAction';
import { deleteDataAPI } from '../../../utils/fetchData';

const AllUsers = () => {
const dispatch=useDispatch();
  const navigate = useNavigate();
  const users=useSelector((state)=>state.Users.users);
  useEffect(()=>{
    dispatch(GetAllUsersAction());

  },[dispatch])

  const handleDelete = async (UserID) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
       
       
       
      try {
      const response=  await deleteDataAPI(`Users/Delete/${UserID}`);
      dispatch(deleteUserAction(UserID))
        
        alert('User deleted successfully');
      } catch (error) {
        console.log('Error deleting user:', error);
        alert('Failed to delete user. Please try again later.');
      }
    
    }
  };

  return (
    <div className="all-users">
      <h1 className="label-manage-users">Manage Users</h1>
      <button className="add-button" onClick={() => navigate('/add-users')}>Add User</button>
     
      <table className="users-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Person ID</th>
            <th>Full Name</th>
            <th>UserName</th>
            <th>IsActive</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.UserID}</td>
              <td>{user.PersonID}</td>
              <td>{user.FullName}</td>
              <td>{user.UserName}</td>
              <td>{user.IsActive ? '✅' : '❌'}</td>
              <td>
                <button className="edit-button" onClick={() => navigate(`/edit-user/${user.UserID}`)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(user.UserID)}>Delete</button>
                <button className="details-button" onClick={() => navigate(`/user-details/${user.UserID}`)}>Details</button>
                <button onClick={()=>navigate(`/change-password/${user.UserID}`)}>change password</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllUsers;
