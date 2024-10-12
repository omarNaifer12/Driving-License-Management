import React, { useEffect, useState } from 'react'
import './ReleaseLicense.css'
import { getDataAPI } from '../../../../../utils/fetchData';
import { GetApplicationTypeByID } from '../../../../../helper/ApplicationType';
import { useDispatch, useSelector } from 'react-redux';
import CptLicenseDetailsBySearch from '../../CptLicenseDetailsBySearch/CptLicenseDetailsBySearch';
import { ResetLicenseData } from '../../../../../Redux/Actions/LicensesAction';
import axios from 'axios';
import { BASE_URL } from '../../../../../utils/config';
const ReleaseLicense = () => {
    const [ApplicationReleaseID,setApplicationReleasedID]=useState(0);
    const [LicenseID,setLicenseID]=useState(0);
    const userID=parseInt(localStorage.getItem("UserID"),10);
const dispatch=useDispatch();
  const license=useSelector((state)=>state.LicensesReducer.licenseDetails);
  const [applicationTypeReleased,setNewApplicationTypeReleased]=useState({});
  const User=useSelector((state)=>state.Users.user);
  const [hideButton,setHideButton]=useState(false);
  const [DetainLicenseData,setDetainLicenseData]=useState({});
  const GetDetainLicenseData=async()=>{

    try{
        const response=await getDataAPI(`DetainedLicenses/ByLicenseID/${license.LicenseID}`);
        console.log("response detain daata",response.data);
        
        setDetainLicenseData(response.data);
    }
    catch(err){
console.log("error",err);

    }
  }
  useEffect(()=>{
    dispatch(ResetLicenseData());
const fetchApplicationType=async()=>{
    const res=await GetApplicationTypeByID(5);
    setNewApplicationTypeReleased(res);
}
fetchApplicationType();
  },[])
  useEffect(()=>{
    const loadData=async()=>{
        setDetainLicenseData({});
        if(!license.LicenseID){
            setHideButton(false);
        }
        else if(license.LicenseID){
            setHideButton(true);
           await GetDetainLicenseData();
        }

    }
    loadData();
  },[license.LicenseID]);
  const handleReleaseLicense=async(e)=>{
    e.preventDefault();
    const applicationDto={
           
        ApplicationID: 0,
        ApplicantPersonID: license.PersonID,
        ApplicationDate: Date.now,
        ApplicationTypeID: 5,
        ApplicationStatus: 3,
        LastStatusDate: Date.now,
        PaidFees: applicationTypeReleased.ApplicationFees,
        CreatedByUserID: userID,
}
    
    try{
        const response=await axios.post(`${BASE_URL}/api/DetainedLicenses/Release/${DetainLicenseData.DetainID}`,applicationDto)
        setApplicationReleasedID(response.data);
        setHideButton(false);
    }
    catch(err){
        console.log("errro",err);
        
    }
  }
  return (
    <>
    <label>release license</label>
     <CptLicenseDetailsBySearch/>
        <div className="license-details-container">
        <div className="license-details">
        
          <div className="left-section">
            <div className="detail">
              <label>Detain ID:</label>
              <span>{DetainLicenseData.DetainID?DetainLicenseData.DetainID:"????"}</span>
            </div>
            <div className="detail">
              <label>Detain Date:</label>
              <span>{DetainLicenseData.DetainID?DetainLicenseData.DetainDate:"????"}</span>
            </div>
            <div className="detail">
              <label>Application Fees:</label>
              <span>{license.LicenseID?applicationTypeReleased.ApplicationFees:'????'}</span>
            </div>
          </div>
  
          <div className="right-section">
            <div className="detail">
              <label> License ID:</label>
              <span>{license.LicenseID?license.LicenseID:'????'}</span>
            </div>
            <div className="detail">
              <label>Created by:</label>
              <span>{DetainLicenseData.DetainID?DetainLicenseData.CreatedByUserID:'????'}</span>
            </div>
            <div className="detail">
              <label>Total Fees:</label>
              <span>{DetainLicenseData.DetainID?applicationTypeReleased.ApplicationFees+DetainLicenseData.FineFees:"????"}</span>
            </div>
            <div className="detail">
              <label>Application ReleaseID</label>
              <span>{ApplicationReleaseID?ApplicationReleaseID:"????"}</span>
            </div>
          </div>
        </div>
       {hideButton&&<button className="renew-button" onClick={(e)=>handleReleaseLicense(e)}>Renew</button>}
      </div>
      </>
  )
}

export default ReleaseLicense