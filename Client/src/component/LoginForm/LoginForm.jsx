import React,{useContext, useEffect, useState} from 'react'
import "./LoginForm.css"
import { StoreContext } from '../../context/storeContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOneUserAction } from '../../Redux/Actions/UsersAction';
import axios from 'axios';
import { postDataAPI } from '../../utils/fetchData';
import { BASE_URL } from '../../utils/config';
const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
   const user=useSelector((state)=>state.Users.user);
const dispatch=useDispatch();  
  const navigate=useNavigate();
  useEffect(()=>{
const setInputs=  ()=>{
    if(parseInt(localStorage.getItem("UserIDToRemember"),10)){
        const userid=parseInt(localStorage.getItem("UserIDToRemember"),10);
        console.log("useris",userid);
    dispatch(getOneUserAction(userid));
    }
}
setInputs();
  },[dispatch])
  useEffect(()=>{
if(user&&user.UserID){
  setPassword(user.Password);
  setRememberMe(true);
  setUsername(user.UserName);
}
  },[user])
  const handleClickLogin=async(e)=>{
    e.preventDefault();
    
    
try{
  const loginData = {
    Username: username,  
    password: password,
  };
  const response= await axios.post(`${BASE_URL}/api/Users/Login?Username=${username}&password=${password}`);
  if(response.status===404){
    alert("incorrect email or password");
  }
  else if(response.status===403){
    alert("your account not active");
  }
  else if(response.status===200){
    localStorage.setItem("UserID",response.data.UserID);
    console.log("the user id is after login correct",response.data.UserID);
    alert("you can enter ");
    if(rememberMe){
      localStorage.setItem("UserIDToRemember",response.data.UserID);
    }
    else{
      localStorage.removeItem("UserIDToRemember");
    }
  }

}
catch(error){
console.log("error",error);

}

  
}
   
  
    return (
      <div className="login-container">
        <form className="login-form" onSubmit={handleClickLogin}>
          <h2 className="form-title">Login</h2>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group remember-me">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    );
}

export default LoginForm