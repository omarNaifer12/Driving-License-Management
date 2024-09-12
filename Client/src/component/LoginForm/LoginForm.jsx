import React,{useContext, useEffect, useState} from 'react'
import "./LoginForm.css"
import { StoreContext } from '../../context/storeContext';
import { useNavigate } from 'react-router-dom';
const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
   
  const{users,getUserById}=useContext(StoreContext);
  const navigate=useNavigate();
  useEffect(()=>{
const setInputs= async ()=>{
    if(localStorage.getItem("userid")){
        const userid=localStorage.getItem("userid");
        console.log("useris",userid);
    const response= await getUserById(userid);
   
   
    if(response){
        setUsername(response.UserName);
        setPassword(response.Password);
        setRememberMe(true);
    }
    }
}
setInputs();
  },[])
  const handleClickLogin=(e)=>{
    e.preventDefault();
    let CheckLogin=false;
users.map(user => {
    if(user.UserName===username&&user.Password===password){
        CheckLogin=true;
    localStorage.removeItem("userid");
    localStorage.removeItem("id");
        if(rememberMe){
        localStorage.setItem("userid",user.id);
    }
localStorage.setItem("id",user.id);
       
        navigate("/Home");
        return ;
    }
});
if(!CheckLogin){
    alert("error username or password");
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