import React, { useEffect, useState } from 'react'
import './AddInternationalLicense.css'
import { useDispatch, useSelector } from 'react-redux';
import { getDataAPI, postDataAPI } from '../../../../utils/fetchData';
import { getOneUserAction } from '../../../../Redux/Actions/UsersAction';
import { GetApplicationTypeByID } from '../../../../helper/ApplicationType';
import CptLicenseDetailsBySearch from '../../LocalLicenses/CptLicenseDetailsBySearch/CptLicenseDetailsBySearch';
const AddInternationalLicense = () => {
    const user =useSelector((state)=>state.Users.user);
    const userID=parseInt(localStorage.getItem("UserID"),10);
    const dispatch=useDispatch();
    const LicenseID=useSelector((state)=>state.LicensesReducer.LicenseID);
    const [licenseClassDetails,setLicenseClassDetails]=useState({});
    const [ApplicationID,setApplicationID]=useState(0);
    const [InternationalLicenseID,setInternationalLicenseID]=useState(0);
    const ApplicationsType=  GetApplicationTypeByID(6);
    const license=useSelector((state)=>state.LicensesReducer.licenseDetails);
    const [hideButton,setHideButton]=useState(true);
    const currentDate = new Date().toLocaleDateString();
const fetchLicenseClassDetails=async()=>{
try{
const response=await getDataAPI(`LicenseClasses/one/${3}`);
setLicenseClassDetails(response.data);
}
    catch(err){
        console.log("error",err);
    }
}
const checkPersonHaveInternationalLicense=async()=>{
    try{
const response = await getDataAPI(`International/active/${license.DriverID}`);
if(response.status===200){
return false;
}
else if(response.status===404){
return true;
}
    }
    catch(err){
        console.log("error",err);  
    }    
}
useEffect(()=>{
    fetchLicenseClassDetails();
    dispatch(getOneUserAction());
},[])
useEffect(()=>{

if(LicenseID&&license.LicenseID===LicenseID&&license.IsActive){
    if(checkPersonHaveInternationalLicense()){
        alert("you already have other international license");
        setHideButton(false);
    }
    else
setHideButton(true);
}
else{
    if(license.LicenseID&&!license.IsActive){
        alert("this licens is not active");
        setHideButton(false);
    }
}

    },[LicenseID,license])
    const IssueInternationalLicense=async()=>{
        e.preventDefault();
        const applicationDto={
           
            ApplicationID: 0,
            ApplicantPersonID: license.PersonID,
            ApplicationDate: Date.now(),
            ApplicationTypeID: 6,
            ApplicationStatus: 3,
            LastStatusDate: Date.now(),
            PaidFees: ApplicationsType.ApplicationFees,
            CreatedByUserID: userID,
  }
  try{
  const response=await postDataAPI(`InternationalLicense/Add?DriverID=${license.DriverID}/licenseClassID=${license.LicenseClassID}`,applicationDto);
  console.log("response add international license");
  setInternationalLicenseID(response.data.InternationalLicenseID);
  setApplicationID(response.data.ApplicationID);
  
  
}
  catch(err){
    console.log("error",err);
  }
  
    }
    return (
        <>
       <CptLicenseDetailsBySearch />
        <div className="license-details-container">
          <div className="column left">
            <div className="detail">
              <label>Application ID:</label>
              <span>{ApplicationID?ApplicationID:"????"}</span>
            </div>
            <div className="detail">
              <label>Application Date:</label>
              <span>{currentDate}</span>
            </div>
            <div className="detail">
              <label>Issue Date:</label>
              <span>{currentDate}</span>
            </div>
            <div className="detail">
              <label>Fees:</label>
              <span>{licenseClassDetails.ClassFees}</span>
            </div>
          </div>
    
          <div className="column right">
            <div className="detail">
              <label>International License ID:</label>
              <span>{InternationalLicenseID?InternationalLicenseID:"????"}</span>
            </div>
            <div className="detail">
              <label>Local License ID:</label>
              <span>{LicenseID?LicenseID:"????"}</span>
            </div>
            <div className="detail">
              <label>Expiration Date:</label>
              <span>{new Date(new Date().setFullYear(new Date().getFullYear() + licenseClassDetails.DefaultValidityLength)).toLocaleDateString()}</span>
            </div>
            <div className="detail">
              <label>Created By:</label>
              <span>{user.UserName}</span>
            </div>
          </div>
          {hideButton&&<button onClick={(e)=>IssueInternationalLicense(e)}>save</button>}
        </div>
        </>
      );
}

export default AddInternationalLicense