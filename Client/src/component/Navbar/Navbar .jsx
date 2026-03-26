import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar .css";
import { useDispatch } from "react-redux";
import { ResetPersonData } from "../../Redux/Actions/peopleAction";
import { ResetLicenseData } from "../../Redux/Actions/LicensesAction";
import { ResetUserData } from "../../Redux/Actions/UsersAction";
import { ResetLocalDrivingLicenseDataAction } from "../../Redux/Actions/LocalDrivingLicenseAction";

const Navbar = () => {
  const userId = localStorage.getItem("UserID");
  const navigate  = useNavigate();
const dispatch = useDispatch();

  const resetValues=()=>{
dispatch(ResetPersonData());
dispatch(ResetLicenseData());
dispatch(ResetUserData());
dispatch(ResetLocalDrivingLicenseDataAction());

}

  const logout=()=>{
  localStorage.removeItem("UserID");
  localStorage.removeItem("UserIDToRemember");
}

  return (
    <nav className="nav">

      <div className="logo">License System</div>

      <ul className="navbar-links">

        <li className="home">
          <Link to="/drivers">Drivers</Link>
        </li>

        <li className="home">
          <Link to="/people/page/1">People</Link>
        </li>

        <li className="home">
          <Link to="/all-users">Users</Link>
        </li>

        {/* Applications Dropdown */}
        <li className="html">
          <Link className="html-link">
            Applications
            <i className="fa-solid fa-chevron-down html-chevron"></i>
          </Link>

          <ul className="html-sub-menu">

            {/* Driving Licenses Service */}
            <li className="lin">
              <Link className="html-js-link">
                Driving Licenses Service
                <i className="fa-solid fa-chevron-right"></i>
              </Link>

              <ul className="html-js-sub-menu">
                <li onClick={resetValues}><Link to="/AddLocalDrivingLicense">New Local Driving License</Link></li>
                <li onClick={resetValues}><Link to="/issue-International-license">New International License</Link></li>
                <li onClick={resetValues}><Link to="/Renew-License">Renew Driving License</Link></li>
                <li onClick={resetValues}><Link to="/replacement-lost-damaged-License">Replacement Lost/Damaged</Link></li>
                <li onClick={resetValues}><Link to="/Release-License">Release Detained License</Link></li>
                <li onClick={resetValues}><Link to="">Retake Test</Link></li>
              </ul>
            </li>

            {/* Manage Application */}
            <li className="lin" >
              <Link className="html-js-link">
                Manage Application
                <i className="fa-solid fa-chevron-right"></i>
              </Link>

              <ul className="html-js-sub-menu">
                <li onClick={resetValues}><Link to="/AllLocalDrivingLicense">Local Driving Licenses</Link></li>
                <li onClick={resetValues}><Link to="/application-type/driving-license">International Licenses</Link></li>
              </ul>
            </li>

            {/* Detain Licenses */}
            <li className="lin">
              <Link className="html-js-link">
                Detain Licenses
                <i className="fa-solid fa-chevron-right"></i>
              </Link>

              <ul className="html-js-sub-menu">
                <li><Link to="/All-Detained-License">Manage Detained Licenses</Link></li>
                <li onClick={resetValues}><Link to="/Detain-License">Detain License</Link></li>
                <li onClick={resetValues}><Link to="/Release-License">Release License</Link></li>
              </ul>
            </li>

            <li><Link to="/Application-type">Manage Application Type</Link></li>
            <li><Link to="/Test-type">Manage Test Types</Link></li>

          </ul>
        </li>

        {/* Account Dropdown */}
        <li className="js">
          <Link className="js-link">
            Account
            <i className="fa-solid fa-chevron-down js-chevron"></i>
          </Link>

          <ul className="js-sub-menu">
            <li><Link to={`/user-details/${userId}`}>Current User Info</Link></li>
            <li><Link to={`/change-password/${userId}`}>Change Password</Link></li>
            <li>
               <Link to="/loginForm" onClick={logout}>
    Logout
  </Link>
            </li>
          </ul>
        </li>

      </ul>

    </nav>
  );
};

export default Navbar;