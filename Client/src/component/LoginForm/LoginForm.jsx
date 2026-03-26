import React, { useContext, useEffect, useState } from 'react'
import "./LoginForm.css"
import { StoreContext } from '../../context/storeContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOneUserAction } from '../../Redux/Actions/UsersAction';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const user = useSelector((state) => state.Users.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const setInputs = () => {
      const stored = parseInt(localStorage.getItem("UserIDToRemember"), 10);
      if (stored) {
        dispatch(getOneUserAction(stored));
      }
    };
    setInputs();
  }, [dispatch]);

  useEffect(() => {
    if (user && user.UserID) {
      setPassword(user.Password);
      setRememberMe(true);
      setUsername(user.UserName);
    }
  }, [user]);

  const handleClickLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}/api/Users/Login?Username=${username}&password=${password}`
      );
      if (response.status === 200) {
        localStorage.setItem("UserID", response.data.UserID);
        if (rememberMe) {
          localStorage.setItem("UserIDToRemember", response.data.UserID);
        } else {
          localStorage.removeItem("UserIDToRemember");
        }
        navigate("/");
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 403) {
        alert("Your account is not active.");
      } else {
        alert("Incorrect username or password.");
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleClickLogin}>
        <h2 className="form-title">Sign In</h2>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
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

        <button type="submit" className="login-button">
          <span>Login</span>
        </button>
      </form>
    </div>
  );
};

export default LoginForm;