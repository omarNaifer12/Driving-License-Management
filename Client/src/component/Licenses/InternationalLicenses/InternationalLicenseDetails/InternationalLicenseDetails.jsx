import React, { useEffect, useState } from 'react'
import "./InternationalLicenseDetails.css"
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { GetOneInetnationalLicense } from '../../../../Redux/Actions/LicensesAction';
const InternationalLicenseDetails = () => {
    
    const internationalLicenseDetails=useSelector((state)=>state.LicenseReducer.InaternationalLicenseDetails);
    const {InaternationalLicenseID}=useParams();
    const dispatch=useDispatch();
    useEffect(()=>{
       dispatch( GetOneInetnationalLicense(InaternationalLicenseID));
    },[InaternationalLicenseID])
  return (
    <div className="license-details">
    <h2>International License Details</h2>
    <div className="detail">
      <label>Driver ID:</label>
      <span>{internationalLicenseDetails.DriverID}</span>
    </div>
    <div className="detail">
      <label>National No:</label>
      <span>{internationalLicenseDetails.NationalNo}</span>
    </div>
    <div className="detail">
      <label>Date of Birth:</label>
      <span>{new Date(internationalLicenseDetails.DateOfBirth).toLocaleDateString()}</span>
    </div>
    <div className="detail">
      <label>Gender:</label>
      <span>{internationalLicenseDetails.Gendor === 0 ? 'Male' : 'Female'}</span>
    </div>
    <div className="detail">
      <label>License ID:</label>
      <span>{internationalLicenseDetails.LicenseID}</span>
    </div>
    <div className="detail">
      <label>Image Path:</label>
      <img src={internationalLicenseDetails.ImagePath} alt="Driver" />
    </div>
    <div className="detail">
      <label>Issued Using Local License ID:</label>
      <span>{internationalLicenseDetails.IssuedUsingLocalLicenseID}</span>
    </div>
    <div className="detail">
      <label>Issue Date:</label>
      <span>{new Date(internationalLicenseDetails.IssueDate).toLocaleDateString()}</span>
    </div>
    <div className="detail">
      <label>Expiration Date:</label>
      <span>{new Date(internationalLicenseDetails.ExpirationDate).toLocaleDateString()}</span>
    </div>
    <div className="detail">
      <label>Is Active:</label>
      <span>{internationalLicenseDetails.IsActive ? "Active" : "Inactive"}</span>
    </div>
    <div className="detail">
      <label>Application ID:</label>
      <span>{internationalLicenseDetails.ApplicationID}</span>
    </div>
  </div>
  )
}

export default InternationalLicenseDetails