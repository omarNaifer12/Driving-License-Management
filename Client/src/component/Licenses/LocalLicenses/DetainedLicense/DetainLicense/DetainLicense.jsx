import React, { useEffect, useState } from 'react'
import './DetainLicense.css'
import CptLicenseDetailsBySearch from '../../CptLicenseDetailsBySearch/CptLicenseDetailsBySearch';
import { postDataAPI } from '../../../../../utils/fetchData';
import axios from 'axios';
import { BASE_URL } from '../../../../../utils/config';
export const DetainLicense = () => {
    const [fineFees,setFineFees]=useState("");
    const [DetainID,setDetainID]=useState(0);
    const userID=parseInt(localStorage.getItem("UserID"),10);
  const license=useSelector((state)=>state.LicensesReducer.licenseDetails);
  const User=useSelector((state)=>state.Users.user);
  const [hideButton,setHideButton]=useState(false);
  useEffect(()=>{
    setDetainID(0);
    setFineFees("");
    if(!license.LicenseID){
      setHideButton(false);
    }
    else if(license.LicenseID&&license.IsDetain){
        alert("this license is already detained");
        setHideButton(false);
    }
    else{
setHideButton(true);
    }

  },[license.LicenseID]);
  const handleDetainLicense=async(e)=>{
    e.preventDefault();
    const fees=Number(fineFees);
    try{
        const response=await axios.post(`${BASE_URL}/DetainedLicenses/DetainLicense?LicenseID=${license.LicenseID}&FineFees=${fees}&CreatedByUserID=${userID}`)
        setDetainID(response.data.DetainID);
        setHideButton(false);
    }
    catch(err){
        console.log("errro");
        
    }
  }
  const handleChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setFineFees(value);
  };
  return (
    <div>
         <CptLicenseDetailsBySearch/>
        <div className="license-details-container">
        <div className="license-details">
        
          <div className="left-section">
            <div className="detail">
              <label>Detain ID:</label>
              <span>{license.LicenseID?DetainID?DetainID:'????':'????'}</span>
            </div>
            <div className="detail">
              <label>Detain Date:</label>
              <span>????</span>
            </div>
          
          </div>
  
      
          <div className="right-section">
            <div className="detail">
              <label> License ID:</label>
              <span>{license.LicenseID?license.LicenseID:"????"}</span>
            </div>
            <div className="detail">
              <label>Old License ID:</label>
              <span>{license.LicenseID?license.LicenseID:'????'}</span>
            </div>
            <div className="detail">
              <label>Created By:</label>
              <span>{User.UserName}</span>
            </div>
            <div className="detail">
            <label>Fine Fees:</label>
      <input 
        type="number" 
        value={fineFees} 
        onChange={handleChange} 
        placeholder="0"
      />
            </div>
          </div>
        </div>
       {hideButton&&<button className="renew-button" onClick={(e)=>handleDetainLicense(e)}>Renew</button>}
      </div>
    </div>
  )
}
