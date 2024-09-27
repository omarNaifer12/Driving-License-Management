import React, { useEffect, useState } from 'react'
import "./AllLocalDrivingApplication.css"
import axios from 'axios';
import { getDataAPI } from '../../utils/fetchData';
import { BASE_URL } from '../../utils/config';
const AllLocalDrivingApplication = () => {
    const [localDrivingApplications,setLocalDrivingApplications]=useState([]);
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
    
      const handleAdd = () => {
        console.log('Add new local driving application');
      };
    
      const handleDetails = (id) => {
        console.log('Show details for local driving application ID:', id);
      };
    
      const handleUpdate = (id) => {
        console.log('Update local driving application ID:', id);
      };
    
      const handleDelete = (id) => {
        console.log('Delete local driving application ID:', id);
      };
    
      return (
        <div className="local-driving-application-list-container">
          <div className="header">
            <h2>Local Driving License Applications</h2>
            <button className="btn-add" onClick={handleAdd}>Add New Application</button>
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
                    <button className="btn-details" onClick={() => handleDetails(application.LocalDrivingLicenseApplicationID)}>Details</button>
                    <button className="btn-update" onClick={() => handleUpdate(application.LocalDrivingLicenseApplicationID)}>Update</button>
                    <button className="btn-delete" onClick={() => handleDelete(application.LocalDrivingLicenseApplicationID)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
}

export default AllLocalDrivingApplication