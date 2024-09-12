import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AllUsers.css';
import { StoreContext } from '../../../context/storeContext';

const AllUsers = () => {
  const {users, setUsers} = useContext(StoreContext);
  const navigate = useNavigate();

  const handleDelete = async (UserID) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
       
        setUsers(users.filter(user => user.id !== UserID))
       
      try {
      const response=  await axios.delete(`http://localhost:3000/users/${UserID}`);
      
        
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
              <td>{user.isActive ? '✅' : '❌'}</td>
              <td>
                <button className="edit-button" onClick={() => navigate(`/edit-user/${user.id}`)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(user.id)}>Delete</button>
                <button className="details-button" onClick={() => navigate(`/user-details/${user.id}`)}>Details</button>
                <button onClick={()=>navigate(`/change-password/${user.id}`)}>change password</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllUsers;
