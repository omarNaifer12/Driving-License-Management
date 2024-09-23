import React,{useContext, useEffect, useState} from 'react'
import axios from "axios"
import './LoginInfo.css'
import { StoreContext } from '../../../context/storeContext'
import { useDispatch, useSelector } from 'react-redux'
import { postDataAPI, putDataAPI } from '../../../utils/fetchData'
import { useParams } from 'react-router-dom'
import { getOneUserAction } from '../../../Redux/Actions/UsersAction'
const LoginInfo = () => {
  const person=useSelector((state)=>state.Persons.Person);
  const User=useSelector((state)=>state.Users.user)
  const dispatch=useDispatch();  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isActive, setIsActive] = useState(false);
 const [user,setUser]=useState({
  UserID:0,
  PersonID:0,
  FullName:"",
  IsActive:false,
  UserName:"",
  Password:"",
 });
 const {id}=useParams();
 useEffect(()=>{
  if(id){
    dispatch(getOneUserAction(id));
  }

 },[id,dispatch]);
 useEffect(()=>{
  setUser(User);
 },[])
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
    console.log("person from redux when try add",person);
    
 
    if (!checkPassword()) {
      alert('Passwords do not match');
      return;
    }
  
    try {
      if(id&&user.UserID){
        const res=await putDataAPI(`Users/one/${id}`,user);
        console.log("updated success",res.data);
        alert('User updated successfully');
      }
      else if(!id&&person.PersonID){
      const res=await postDataAPI("Users/Add",user);
      alert('User added successfully');
    console.log("res add user",res.data);
    setUser({...user,UserID:res.data.UserID});
    console.log("perso redux after add",person);
      }
    } catch (error) {
      console.error('Error  user:', error);
      alert('Failed to  user');
    }
  
  };

  return (
    <div className="login-info-container">
      <h2>Login Info</h2>
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
            onChange={(e) => handleChange(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input 
            type="password" 
            name="Password"
            value={user.Password} 
            onChange={(e) => handleChange(e.target.value)} 
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
            {isActive ? '✅' : '❌'}
          </div>
        </div>
        <button type="button" onClick={handleSave}>Save</button>
      </form>
    </div>
  );
}

export default LoginInfo