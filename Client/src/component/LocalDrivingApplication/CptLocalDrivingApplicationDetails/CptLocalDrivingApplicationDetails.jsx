import React, { useEffect } from 'react'
import "./CptLocalDrivingApplicationDetails.css"
import { useDispatch, useSelector } from 'react-redux'

const CptLocalDrivingApplicationDetails = () => {
    const LocalDrivingLicense=useSelector((state)=>state.LocalDrivingLicenses.LocalDrivingLicense);
    const CountPassedTests=useSelector((state)=>state.Tests.PassedTestsCount);
    
   
    return (
        <div className="application-info-container">
            <h2>Local Driving License Information</h2>
            
            <div className="info-group">
                <label>License Class Name:</label>
                <span>{LocalDrivingLicense.LicenseClassName || 'N/A'}</span>
            </div>
            
            <div className="info-group">
                <label>Local Driving License ID:</label>
                <span>{LocalDrivingLicense.localDrivingLicenseID || 'N/A'}</span>
            </div>
            
            <div className="info-group">
                <label>Passed Test Count:</label>
                <span>{CountPassedTests || 'N/A'}</span>
            </div>

            <h3>Application Information</h3>
            
            <div className="info-group">
                <label>Application ID:</label>
                <span>{LocalDrivingLicense.ApplicationID || 'N/A'}</span>
            </div>
            
            <div className="info-group">
                <label>Application Date:</label>
                <span>{LocalDrivingLicense.ApplicationDate || 'N/A'}</span>
            </div>
            
            <div className="info-group">
                <label>Application Status:</label>
                <span>{LocalDrivingLicense.ApplicationStatus || 'N/A'}</span>
            </div>
            
            <div className="info-group">
                <label>Last Status Date:</label>
                <span>{LocalDrivingLicense.LastStatusDate || 'N/A'}</span>
            </div>
            
            <div className="info-group">
                <label>Paid Fees:</label>
                <span>{LocalDrivingLicense.PaidFees || 'N/A'}</span>
            </div>

            <div className="info-group">
                <label>Created By User Name:</label>
                <span>{LocalDrivingLicense.CreatedByUserName || 'N/A'}</span>
            </div>
            
            <div className="info-group">
                <label>Person Full Name:</label>
                <span>{LocalDrivingLicense.PersonFullName || 'N/A'}</span>
            </div>
            
            <div className="info-group">
                <label>Application Type Name:</label>
                <span>{LocalDrivingLicense.ApplicationTypeName || 'N/A'}</span>
            </div>
        </div>
    );
}

export default CptLocalDrivingApplicationDetails