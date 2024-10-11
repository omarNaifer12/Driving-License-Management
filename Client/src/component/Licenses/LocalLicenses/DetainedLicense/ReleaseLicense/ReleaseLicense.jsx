import React, { useEffect, useState } from 'react'
import './ReleaseLicense.css'
import { getDataAPI } from '../../../../../utils/fetchData';
import { GetApplicationTypeByID } from '../../../../../helper/ApplicationType';
const ReleaseLicense = () => {
    const [ApplicationReleaseID,setApplicationReleasedID]=useState(0);
    const [LicenseID,setLicenseID]=useState(0);
    const userID=parseInt(localStorage.getItem("UserID"),10);

  const license=useSelector((state)=>state.LicensesReducer.licenseDetails);
  const [applicationTypeReleased,setNewApplicationTypeReleased]=useState({});
  const User=useSelector((state)=>state.Users.user);
  const [hideButton,setHideButton]=useState(false);
  const [DetainLicenseData,setDetainLicenseData]=useState({});
  const GetDetainLicenseData=async()=>{

    try{
        const response=await getDataAPI(`DetainedLicense/ByLicenseID/${license.LicenseID}`);
        setDetainLicenseData(response.data);
    }
    catch(err){
console.log("error",err);

    }
  }
  useEffect(()=>{
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
        else if(license.LicenseID&&!license.IsDetain){
            alert("this license is not detained u cant release it");
            setHideButton(false);
        }
        else{
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
        const response=await axios.post(`${BASE_URL}/DetainedLicenses/Release/${DetainLicenseData.DetainID}`)
        setApplicationReleasedID(response.data);
        setHideButton(false);
    }
    catch(err){
        console.log("errro");
        
    }
  }
  return (
    <>
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
              <span>{license.LicenseID&&license.IsDetain?license.LicenseID:'????'}</span>
            </div>
            <div className="detail">
              <label>Created by:</label>
              <span>{license.LicenseID&&!license.IsDetain?DetainLicenseData.CreatedByUserID:'????'}</span>
            </div>
            <div className="detail">
              <label>Total Fees:</label>
              <span>{license.LicenseID&&!license.IsDetain?applicationTypeReleased.ApplicationFees+DetainLicenseData.FineFees:"????"}</span>
            </div>
          </div>
        </div>
       {hideButton&&<button className="renew-button" onClick={()=>handleReleaseLicense(e)}>Renew</button>}
      </div>
      </>
  )
}

export default ReleaseLicense