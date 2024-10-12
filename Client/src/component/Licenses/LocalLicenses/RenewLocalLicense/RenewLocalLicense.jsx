import React, { useEffect, useState } from 'react'
import './RenewLocalLicense.css'
import { useDispatch, useSelector } from 'react-redux';
import { GetApplicationTypeByID } from '../../../../helper/ApplicationType';
import axios from 'axios';
import { BASE_URL } from '../../../../utils/config';
import CptLicenseDetailsBySearch from "../CptLicenseDetailsBySearch/CptLicenseDetailsBySearch"
import { getOneUserAction } from '../../../../Redux/Actions/UsersAction';
const RenewLocalLicense = () => {
    const [note, setNote] = useState("");
    const [NewApplicationID,setNewApplicationID]=useState(0);
    const [NewLicenseID,setNewLicenseID]=useState(0);
    const userID=parseInt(localStorage.getItem("UserID"),10);
    const LicenseId=useSelector((state)=>state.LicensesReducer.LicenseID);
  const license=useSelector((state)=>state.LicensesReducer.licenseDetails);
  const [applicationType,setNewApplicationType]=useState({});
  const User=useSelector((state)=>state.Users.user);
  const [hideButton,setHideButton]=useState(false);

  const dispatch=useDispatch();
  useEffect(()=>{
    const loadData=async()=>{
    if(license.LicenseID&&license.ExpirationDate>Date.now())
    {
      alert('this license is not finish their expiration date you cant renew');
      setHideButton(false);

    }
     else if(license.LicenseID){
      const response= GetApplicationTypeByID(2);  
      dispatch(getOneUserAction(userID));
        setHideButton(true);
        setNewApplicationType( await response);
    }
}
loadData();

  },[license.LicenseID])
  const handleRenew = async() => {
    const data = {
      CreatedBy: userID, 
      Note: note, 
      ApplicationTypeID: 2, 
      IssueReason: 2 
    };
  
    try {



      const response = await axios.post(BASE_URL+`/api/licenses/Change?existLicenseID=${license.LicenseID}&createdBy=${userID}&ApplicationTypeID=${2}&IssueReason=${2}`, note,{
        headers: {
          'Content-Type': 'application/json',  
        },
      }
    );
  setNewApplicationID(response.data.ApplicationID);
  setNewLicenseID(response.data.LicenseID);
  setHideButton(false);
      console.log('License renewed successfully:', response.data);
   
    } catch (err) {
      console.error('Failed to renew license:', err);
     
    }
  };
    return (
      <>
<label>Renew License</label>
     <CptLicenseDetailsBySearch/>
     
        <div className="license-details-container">
        <div className="license-details">
        
          <div className="left-section">
            <div className="detail">
              <label>Application ID:</label>
              <span>{NewApplicationID?NewApplicationID:"????"}</span>
            </div>
            <div className="detail">
              <label>Application Date:</label>
              <span>????</span>
            </div>
            <div className="detail">
              <label>Issue Date:</label>
              <span></span>
            </div>
            <div className="detail">
              <label>Application Fees:</label>
              <span>{license.LicenseID?applicationType.ApplicationFees:'????'}</span>
            </div>
            <div className="detail">
              <label>Class Fees:</label>
              <span>{license.LicenseID?license.ClassFees:'????'}</span>
            </div>
          </div>
  
          {/* Right side labels and values */}
          <div className="right-section">
            <div className="detail">
              <label>Renewed License ID:</label>
              <span>{NewLicenseID?NewLicenseID:'????'}</span>
            </div>
            <div className="detail">
              <label>Old License ID:</label>
              <span>{license.LicenseID?license.LicenseID:'????'}</span>
            </div>
            <div className="detail">
              <label>Expiration Date:</label>
              <span>????</span>
            </div>
            <div className="detail">
              <label>Created By:</label>
              <span>{User.UserName}</span>
            </div>
            <div className="detail">
              <label>Total Fees:</label>
              <span>{license.LicenseID?license.ClassFees+applicationType.ApplicationFees:"????"}</span>
            </div>
          </div>
        </div>
        <div className="note-section">
          <label>Note:</label>
          <input 
            type="text" 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            placeholder="Write a note here..."
          />
        </div>
       {hideButton&&<button className="renew-button" onClick={handleRenew}>Renew</button>}
      </div>
      </>
)
}
export default RenewLocalLicense