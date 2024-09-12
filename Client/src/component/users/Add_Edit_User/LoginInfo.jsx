import React,{useContext, useState} from 'react'
import axios from "axios"
import './LoginInfo.css'
import { StoreContext } from '../../../context/storeContext'
const LoginInfo = () => {
  const {person}=useContext(StoreContext);
    const [userID] = useState('????');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isActive, setIsActive] = useState(false);
  const checkPassword = () => {
    return password === confirmPassword;
  };


  const handleSave = async () => {
   if(person.id){
    if (!checkPassword()) {
      alert('Passwords do not match');
      return;
    }

    const user = {
      PersonID:person.id,
      Password: password,
      FullName: 'John Doe', 
      UserName: username,
      isActive: isActive,
    };

    try {
      await axios.post('http://localhost:3000/users', user);
      alert('User added successfully');
    
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setIsActive(false);
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user');
    }
  }
  };

  return (
    <div className="login-info-container">
      <h2>Login Info</h2>
      <form>
        <div className="form-group">
          <label>UserID: {userID}</label>
        </div>
        <div className="form-group">
          <label>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
          />
        </div>
        <div className="form-group is-active">
          <label>IsActive:</label>
          <div 
            className={`toggle-sign ${isActive ? 'active' : ''}`} 
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? '✅' : '❌'}
          </div>
        </div>
        <button type="button" onClick={handleSave}>Save</button>
      </form>
    </div>
  );
}

export default LoginInfo