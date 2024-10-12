import React, { useEffect, useState } from 'react'
import './AddInternationalLicense.css'
import { useDispatch, useSelector } from 'react-redux';
import { getDataAPI, postDataAPI } from '../../../../utils/fetchData';
import { getOneUserAction } from '../../../../Redux/Actions/UsersAction';
import { GetApplicationTypeByID } from '../../../../helper/ApplicationType';
import CptLicenseDetailsBySearch from '../../LocalLicenses/CptLicenseDetailsBySearch/CptLicenseDetailsBySearch';
import axios from 'axios';
import { BASE_URL } from '../../../../utils/config';
const AddInternationalLicense = () =>{
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
const response = await getDataAPI(`InternationalLicenses/active/${license.DriverID}`);


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
    dispatch(getOneUserAction(userID));
  
},[])
useEffect(()=>{
const loadData=async()=>{

if(license.LicenseID&&license.IsActive){
  const res=await checkPersonHaveInternationalLicense();

  
    if(!res){
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

}
loadData();
    },[license.LicenseID])
    const IssueInternationalLicense=async(e)=>{
        e.preventDefault();
       
       
  try{
  const response=await axios.post(`${BASE_URL}/api/InternationalLicenses/Add?CreatedByUserID=${userID}&LicenseID=${license.LicenseID}`);
  console.log("response add international license");
  setInternationalLicenseID(response.data.InternationalLicenseID);
  setApplicationID(response.data.ApplicationID);
  setHideButton(false);
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
              <span>{license.LicenseID?license.LicenseID:"????"}</span>
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