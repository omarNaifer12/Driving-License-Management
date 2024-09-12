import React from 'react'
import { Link } from 'react-router-dom'
import "./Navbar .css"
const Navbar =()=>{
   
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
            <li className="navbar-item"><Link to="/all-people">People</Link></li>
            <li className="navbar-item"><Link to="/all-users">Users</Link></li>
            <li className="navbar-item dropdown">
              <span>Applications</span>
              <ul className="dropdown-menu">
                <li className="dropdown">
                  <span>Driving Licenses Service</span>
                  <ul className="dropdown-menu">
                    <li><Link to="/manage-applications">Manage Applications</Link></li>
                    <li><Link to="/detain-licenses">Detain Licenses</Link></li>
                    <li><Link to="/issue-licenses">Issue Licenses</Link></li>
                  </ul>
                </li>
                <li className="dropdown">
                  <span>Manage Application</span>
                  <ul className="dropdown-menu">
                    <li><Link to="/application-type/driving-license">Driving License</Link></li>
                    <li><Link to="/application-type/renewal">Renewal</Link></li>
                    <li><Link to="/application-type/replacement">Replacement</Link></li>
                  </ul>
                </li>
                <li className="dropdown">
                  <span>Detain Licenses</span>
                  <ul className="dropdown-menu">
                    <li><Link to="/detain-license/theft">Theft</Link></li>
                    <li><Link to="/detain-license/accident">Accident</Link></li>
                    <li><Link to="/detain-license/violation">Violation</Link></li>
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