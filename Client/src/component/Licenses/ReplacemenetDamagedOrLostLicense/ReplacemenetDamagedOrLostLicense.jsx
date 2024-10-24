import React, { useEffect, useState } from 'react'
import "./ReplacemenetDamagedOrLostLicense.css"
import { useDispatch, useSelector } from 'react-redux';
import { GetApplicationTypeByID } from '../../../helper/ApplicationType';
import { BASE_URL } from '../../../utils/config';
import CptLicenseDetailsBySearch from '../LocalLicenses/CptLicenseDetailsBySearch/CptLicenseDetailsBySearch';
import { getOneUserAction } from '../../../Redux/Actions/UsersAction';
import axios from 'axios';
import { ResetLicenseData, ResetLicenseID, setLicenseID } from '../../../Redux/Actions/LicensesAction';
const ReplacemenetDamagedOrLostLicense = () => {
    const [NewApplicationID,setNewApplicationID]=useState(0);
    const [NewLicenseID,setNewLicenseID]=useState(0);
    const userID=parseInt(localStorage.getItem("UserID"),10);
    const LicenseId=useSelector((state)=>state.LicensesReducer.LicenseID);
  const license=useSelector((state)=>state.LicensesReducer.licenseDetails);
  const [applicationTypeDamaged,setNewApplicationTypeDamaged]=useState({});
  const [applicationTypeLost,setNewApplicationTypeLost]=useState({});
  const User=useSelector((state)=>state.Users.user);
  const [hideButton,setHideButton]=useState(false);
  const [typeOfReplacemenet,setTypeOfReplacement]=useState("lost");
  const dispatch=useDispatch();
  useEffect(()=>{
    console.log("licens id from replcament license useeffcrt",LicenseId);
    
dispatch(ResetLicenseData());
},[LicenseId]);

  useEffect(()=>{
    const loadData=async()=>{
      console.log("license data is from replacement is",license);
    
      if(!license.LicenseID){
            setHideButton(false);
        }
        else if(license.LicenseID&&!license.IsActive){
          alert("this license is not active so cant replace");
          setHideButton(false);
        }
        else if(license.LicenseID&&license.IsDetained){
          alert("this license is detained");
        }
        else if(license.LicenseID&&license.IsDetained){
        alert("this license detained u cant replace it right now ");
        setHideButton(false);
        }
     else if(license.LicenseID){
      const responseDamaged=GetApplicationTypeByID(4);  
      const responseLost= GetApplicationTypeByID(3);  
      dispatch(getOneUserAction(userID));
        setHideButton(true);
        setNewApplicationTypeLost( await responseLost);
        setNewApplicationTypeDamaged(await responseDamaged);
    }
   
  }
loadData();

  },[license.LicenseID]);
 
  const handleReplacement = async() => {

  
     const ApplicationTypeID=typeOfReplacemenet==="lost"?applicationTypeLost.ApplicationTypeID:applicationTypeDamaged.ApplicationTypeID;
     
    
  
    try {
      const response = await  axios.post(BASE_URL+`/api/licenses/Change?existLicenseID=${license.LicenseID}&createdBy=${userID}&ApplicationTypeID=${ApplicationTypeID}&IssueReason=${ApplicationTypeID}`, "",{
        headers: {
          'Content-Type': 'application/json',  
        },
      }
    );
  setNewApplicationID(response.data.ApplicationID);
  setNewLicenseID(response.data.LicenseID);
      console.log('License renewed successfully:', response.data);
      setHideButton(false)
   
    } catch (err) {
      console.error('Failed to renew license:', err);
     
    }
  };
  const navigateLicenseDetails=()=>{
    dispatch(setLicenseID(NewLicenseID));
    navigate("/license-details");
  }
    return (
      <>
      <h3>{typeOfReplacemenet==="lost"?"Lost License":"Damaged License"}</h3>

        <div className="license-details-container">
        <CptLicenseDetailsBySearch/>
        <div className="license-replacement-type">
        <h3>Select Replacement Type:</h3>
        <div>
          <input
            type="radio"
            id="lost"
            name="replacement"
            value="lost"
            checked={typeOfReplacemenet === 'lost'}
            onChange={(e) => setTypeOfReplacement(e.target.value)}
          />
          <label htmlFor="lost">Lost License</label>

          <input
            type="radio"
            id="damaged"
            name="replacement"
            value="damaged"
            checked={typeOfReplacemenet === 'damaged'}
            onChange={(e) => setTypeOfReplacement(e.target.value)}
          />
          <label htmlFor="damaged">Damaged License</label>
        </div>
      </div>
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
            <label>Application Fees:</label>
              <span>{typeOfReplacemenet==="lost"?applicationTypeLost.ApplicationFees:applicationTypeDamaged.ApplicationFees}</span>
            </div>
          </div>
  
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
              <label>Created By:</label>
              <span>{User.UserName}</span>
            </div>
          </div>
        </div>
        {hideButton&&<button className="renew-button" onClick={handleReplacement}>{typeOfReplacemenet==="lost"?"Lost License":"Damaged License"}</button>}
        {license.LicenseID&&<button className="renew-button" onClick={()=>navigate(`/Person-Licenses-History/${license.PersonID}`)}>show person licenses history</button>}
        {NewLicenseID&&<button className="renew-button" onClick={()=>navigateLicenseDetails()}>show new license details</button>}

      </div>
      </>
)
}

export default ReplacemenetDamagedOrLostLicense