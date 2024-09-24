import React,{useContext, useEffect, useState} from 'react'
import axios from "axios"
import './LoginInfo.css'
import { StoreContext } from '../../../context/storeContext'
import { useDispatch, useSelector } from 'react-redux'
import { postDataAPI, putDataAPI } from '../../../utils/fetchData'
import { useParams } from 'react-router-dom'
import { getOneUserAction, ResetUserData } from '../../../Redux/Actions/UsersAction'
const LoginInfo = () => {
  const person=useSelector((state)=>state.Persons.Person);
  const User=useSelector((state)=>state.Users.user)
  const dispatch=useDispatch();  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user,setUser]=useState({
  UserID:0,
  PersonID:0,
  FullName:"",
  IsActive:false,
  UserName:"",
  Password:"",
 });
 const {id}=useParams();
 useEffect( ()=>{
   dispatch(ResetUserData());
  if(id){
    dispatch(getOneUserAction(id));
  }
},[id,dispatch]);
 useEffect( ()=>{
  if(id){
    
    console.log("users data after await",User);
    
  setUser(User);
  setConfirmPassword(User.Password)
  }
  else if(person.PersonID){
    setUser({...user,PersonID:person.PersonID})
  } 
},[id,User])
useEffect(()=>{
console.log("user data add is ",user);
},[user])
  const checkPassword = () => {
    return user.Password === confirmPassword;
  };
  const handleChange=(e)=>{
    const {value,name}=e.target;
    setUser({...user,[name]:value});
  }
  const handleAciveChange=()=>{
    setUser({...user,IsActive:!user.IsActive});
  }

  const handleSave = async (e) => {
    e.preventDefault();
   
    if (!checkPassword()) {
      alert('Passwords do not match');
      return;
    }
  
    try {
      if(user.UserID){
        const res=await putDataAPI(`Users/Update/${user.UserID}`,user);
        console.log("updated success",res.data);
        alert('User updated successfully');
      }
      else if(!id&&person.PersonID){
    
        
      const res=await postDataAPI("Users/Add",user);
      alert('User added successfully');
    
    setUser({...user,UserID:res.data.UserID});
      }
    } catch (error) {
      console.error('Error  user:', error);
      alert('Failed to  user');
    }
  
  };

  return (
    <div className="login-info-container">
      <h2>{user.UserID?"update User":"create user"}</h2>
      <form>
        <div className="form-group">
          <label>UserID: {user.UserID&&user?user.UserID:"????"}</label>
        </div>
        <div className="form-group">
          <label>Username:</label>
          <input 
            type="text" 
            name="UserName"
            value={user.UserName} 
            onChange={(e) => handleChange(e)} 
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input 
            type="password" 
            name="Password"
            value={user.Password} 
            onChange={(e) => handleChange(e)} 
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
            className={`toggle-sign ${user.IsActive ? 'active' : ''}`} 
            onClick={handleAciveChange}
          >
            {user.IsActive ? '✅' : '❌'}
          </div>
        </div>
        <button type="button" onClick={handleSave}>save</button>
      </form>
    </div>
  );
}

export default LoginInfo