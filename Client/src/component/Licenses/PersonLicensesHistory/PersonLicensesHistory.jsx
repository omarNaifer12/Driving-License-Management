import React, { useEffect, useState } from 'react'
import "./PersonLicensesHistory.css"
import { useNavigate, useParams } from 'react-router-dom'
import { getDataAPI } from '../../../utils/fetchData';
import CptPersonInformation from '../../componentsPersons/CptPersonInformation/CptPersonInformation';
import { setLicenseID } from '../../../Redux/Actions/LicensesAction';
import { useDispatch } from 'react-redux';
import { legacy_createStore } from 'redux';
const PersonLicensesHistory = () => {
  const [LocalLicensesOfPerson,setLocalLicensesOfPerson]=useState([]); 
  const [InternationalLicensesOfPerson,setInternationalLicensesOfPerson]=useState([]); 
  const [TypeTableList,setTypeTableList]=("Local");  
  const navigate=useNavigate();
  const {PersonID}=useParams();
const dispatch=useDispatch();
    const getInternationalLicenses=async()=>{
        try{
            const response=await getDataAPI(`InternationalLicenses/Licensesperson/${PersonID}`)
            setInternationalLicensesOfPerson(response.data);

        }
        catch(error){
            console.log("error",error);
            
        }
    }
    const getLocalLicenses=async()=>{
        try{
            const response=await getDataAPI(`Licenses/LicensesOfPerson?PersonID=${PersonID}`)
            setLocalLicensesOfPerson(response.data);

        }
        catch(error){
            console.log("error",error);
            
        }
    }
    useEffect(()=>{
        getLocalLicenses();
        getInternationalLicenses();
    },[PersonID]);
    const handleLocalClick = () => {
        setTypeTableList("Local");
      };
      const navigateLicenseDetails=(LicenseID)=>{
        dispatch(setLicenseID(LicenseID));
        navigate("/license-details");
      }
      const handleInternationalClick = () => {
        setTypeTableList("International");
      };
  const renderLicenses = () => {
    if (TypeTableList === "Local") {
      return LocalLicensesOfPerson.map((license) => (
        <div key={license.LicenseID}>
          <p>License ID: {license.LicenseID}</p>
          <p>Application ID: {license.ApplicationID}</p>
          <p>Issue Date: {license.IssueDate}</p>
          <p>Expiration Date: {license.ExpirationDate}</p>
          <p>Is Active: {license.IsActive ? "Yes" : "No"}</p>
          <p>Class Name: {license.ClassName}</p>
          <button onClick={()=>navigateLicenseDetails(license.LicenseID)}>show license info</button>
          <hr />
        </div>
      ));
    } else {
      return InternationalLicensesOfPerson.map((license) => (
        <div key={license.InternationalLicenseID}>
          <p>International License ID: {license.InternationalLicenseID}</p>
          <p>Driver ID: {license.DriverID}</p>
          <p>Issued Using Local License ID: {license.IssuedUsingLocalLicenseID}</p>
          <p>Issue Date: {license.IssueDate}</p>
          <p>Expiration Date: {license.ExpirationDate}</p>
          <p>Is Active: {license.IsActive ? "Yes" : "No"}</p>
          <p>Created By User ID: {license.CreatedByUserID}</p>
          <p>Application ID: {license.ApplicationID}</p>
          <button onClick={()=>navigate(`/International-license-details/${license.InternationalLicenseID}`)}>show international license info</button>
          <hr />
        </div>
      ));
    }
  };
  return(
    <div>
      <CptPersonInformation id={PersonID}/>
      <button onClick={handleLocalClick}>Show Local Licenses</button>
      <button onClick={handleInternationalClick}>Show International Licenses</button>
      <h2>{TypeTableList} Licenses</h2>
      {renderLicenses()}
    </div>
  );
}

export default PersonLicensesHistory