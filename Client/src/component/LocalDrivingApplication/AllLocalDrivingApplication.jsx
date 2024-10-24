import React, { useEffect, useState } from 'react'
import "./AllLocalDrivingApplication.css"
import axios from 'axios';
import { deleteDataAPI, getDataAPI } from '../../utils/fetchData';
import { BASE_URL } from '../../utils/config';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetLocalDrivingLicenseByIDAction, ResetLocalDrivingLicenseDataAction } from '../../Redux/Actions/LocalDrivingLicenseAction';
import { PassedTestCountAction } from '../../Redux/Actions/TestsAction';
import { ResetLicenseData, ResetLicenseID, setLicenseID } from '../../Redux/Actions/LicensesAction';
const AllLocalDrivingApplication = () => {
    const [localDrivingApplications,setLocalDrivingApplications]=useState([]);
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const fetchData=async()=>{
        try{
          const response=await getDataAPI(`LocalDrivingLicenses/All`);
    setLocalDrivingApplications(response.data);    
    }
        catch(error){
            console.log("error",error);
           
        }
    }
    useEffect(()=>{
        fetchData();
    },[])
    const handleDelete=async(id)=>{
      try{
        const response=await deleteDataAPI(`LocalDrivingLicenses/Delete/${id}`);
  setLocalDrivingApplications(localDrivingApplications.filter((local)=>local.LocalDrivingLicenseApplicationID!==id));    
  }
      catch(error){
          console.log("error",error);
         
      }
  }
      const handleDetails=(id)=>{
        console.log('Show details for local driving application ID:', id);
        dispatch(ResetLocalDrivingLicenseDataAction());
        dispatch(GetLocalDrivingLicenseByIDAction(id));
        dispatch(PassedTestCountAction(id));
        navigate("/LocalDrivingLicenseDetails");
      };
 
      const resetLicenseBeforeNavigate=(name)=>{
        dispatch(ResetLicenseData());
        dispatch(ResetLicenseID());
        navigate(name);
      }
      const handleNavigateReplacementLicense= () => {
        resetLicenseBeforeNavigate('/replacement-lost-damaged-License');
      };const handleNavigateDetainLicense= () => {
        resetLicenseBeforeNavigate('/Detain-License');
      };const handleNavigateReleaseLicense= () => {
        resetLicenseBeforeNavigate('/Release-License');
      };const handleNavigateRenewLicense= () => {
      
        resetLicenseBeforeNavigate('/Renew-License');
      };
      const handleNavigateInternationLicense=()=>{
resetLicenseBeforeNavigate('/issue-International-license');
      }


    const checkPersonHaveLicenseAndnavigate=async(LocalDrivingLicenseID)=>{
try{
  const response=await getDataAPI(`Licenses/ActiveLicensePerson/${LocalDrivingLicenseID}`);
  if(response.data!=-1){
    console.log("data licese from all local ",response.data);
    dispatch(setLicenseID(response.data));
    navigate(`/license-details`);
  }
}
catch(error){
console.log("error",error);

}
    }
      return (
        <div className="local-driving-application-list-container">
          <div className="header">
            <h2>Local Driving License Applications</h2>
            <button className="btn-add" onClick={()=>navigate('/AddLocalDrivingLicense')}>Add New Application</button>
                 
            <button className="btn-add" onClick={()=>handleNavigateInternationLicense()}>Add New International license</button>
            <button className="btn-add" onClick={()=>navigate("/All-Detained-License")}>all detained license</button>
            <button className="btn-add" onClick={()=>handleNavigateRenewLicense()}>renew license</button>
            <button className="btn-add" onClick={()=>handleNavigateReplacementLicense()}>replacement lost damaged License</button>
            <button className="btn-add" onClick={()=>handleNavigateDetainLicense()}>detain License </button>
            <button className="btn-add" onClick={()=>handleNavigateReleaseLicense()}>release License </button>
          </div>
          <table className="local-driving-application-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Class Name</th>
                <th>National No</th>
                <th>Full Name</th>
                <th>Application Date</th>
                <th>Passed Test Count</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {localDrivingApplications.map((application) => (
                <tr key={application.LocalDrivingLicenseApplicationID}>
                  <td data-label="Application ID">{application.LocalDrivingLicenseApplicationID}</td>
                  <td data-label="Class Name">{application.ClassName}</td>
                  <td data-label="National No">{application.NationalNo}</td>
                  <td data-label="Full Name">{application.FullName}</td>
                  <td data-label="Application Date">{application.ApplicationDate}</td>
                  <td data-label="Passed Test Count">{application.PassedTestCount}</td>
                  <td data-label="Status">{application.Status}</td>
                  <td>
                    <button className="btn-details"onClick={() =>handleDetails(application.LocalDrivingLicenseApplicationID)}>Details</button>
                    <button className="btn-update" onClick={() =>navigate(`/UpdateLocalDrivingLicense
                    ${application.LocalDrivingLicenseApplicationID}`) }>Update</button>
                    <button className="btn-delete" onClick={() => handleDelete(application.LocalDrivingLicenseApplicationID)}>Delete</button>
                    <button onClick={()=>navigate(`/TestAppointmentsForTestType/${application.LocalDrivingLicenseApplicationID}/${application.PassedTestCount}`)}>go tests</button>

                  </td>
                  <td> 
                  {application.Status==="New"&&application.PassedTestCount===3&&<button 
                  onClick={()=>navigate(`/Issue-Local-Driving-License-FirstTime/${application.LocalDrivingLicenseApplicationID}`)}>
                    issue First TimeLicense
                    </button>}
                   {application.Status==="Completed"&& <button onClick={()=>checkPersonHaveLicenseAndnavigate(application.LocalDrivingLicenseApplicationID)}>
                    check license details</button>}
                  </td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
}

export default AllLocalDrivingApplication