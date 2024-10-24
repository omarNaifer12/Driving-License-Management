import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./Navbar .css"
import { useDispatch } from 'react-redux'
const Navbar =()=>{
  const dispatch=useDispatch();
  const resetLicenseBeforeNavigate=()=>{
    dispatch(ResetLicenseData());
    dispatch(ResetLicenseID());
   
  }
const navigate=useNavigate();
    return (
        <nav className="navbar">
          <ul className="navbar-menu">
            <li className="navbar-item dropdown">
              <span>Account Settings</span>
              <ul className="dropdown-menu">
                <li><Link to={`/user-details/${localStorage.getItem("id")}`}>Current User Info</Link></li>
                <li><Link to={`/change-password/${localStorage.getItem("id")}`}>Change Password</Link></li>
                <li><Link to="/logout">Logout</Link></li>
              </ul>
            </li>
            <li className="navbar-item"><Link to="/drivers">Drivers</Link></li>
            <li className="navbar-item" onClick={()=>navigate(`/people/page/${1}`)}>People</li>
            <li className="navbar-item"><Link to="/all-users">Users</Link></li>
            <li className="navbar-item dropdown">
              <span>Applications</span>
              <ul className="dropdown-menu">
                <li className="dropdown">
                  <span>Driving Licenses Service</span>
                  <ul className="dropdown-menu">
                    <li><Link to="/AddLocalDrivingLicense">New Local Driving License</Link></li>
                    <li>
        <Link to="/issue-International-license" >
          New International Driving License
        </Link>
      </li>
      <li>
        <Link to="/Renew-License" >
          Renew Driving License
        </Link>
      </li>
      <li>
        <Link to="/replacement-lost-damaged-License" >
          Replacement For Lost Or Damaged License
        </Link>
      </li>
      <li>
        <Link to="/Release-License" >
          Release Detained License
        </Link>
      </li>           <li><Link to="">Retake Test</Link></li>
                  </ul>
                </li>
                <li className="dropdown">
                  <span>Manage Application</span>
                  <ul className="dropdown-menu">
                  <li><Link to="/AllLocalDrivingLicense">Local Driving Licenses Appication</Link></li>
                  <li><Link to="/application-type/driving-license">International Licenses Appication</Link></li>
                  
                  </ul>
                </li>
                <li className="dropdown">
                  <span>Detain Licenses</span>
                  <ul className="dropdown-menu">
                    <li><Link to="/All-Detained-License">Manage Detained Licenses</Link></li>
                    <li>
        <Link to="/Detain-License" >
          Release Detained License
        </Link>
      </li>   
                    <li>
        <Link to="/Release-License" >
          Release Detained License
        </Link>
      </li>   
                  </ul>
                </li>
                <li><Link to="/Application-type">Manage Application Type</Link></li>
                <li><Link to="/Test-type">Manage Test Types</Link></li>
              </ul>
            </li>
          </ul>
        </nav>
      );
}

export default Navbar 