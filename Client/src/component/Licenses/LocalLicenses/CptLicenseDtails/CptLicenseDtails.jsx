import React, { useEffect } from 'react'
import "./CptLicenseDtails.css"
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { GetOneLicense, ResetLicenseData } from '../../../../Redux/Actions/LicensesAction';
const CptLicenseDtails = () => {
const id=useSelector((state)=>state.LicensesReducer.LicenseID);
  const dispatch=useDispatch();
  const license=useSelector((state)=>state.LicensesReducer.licenseDetails);
    useEffect(()=>{
        console.log("license id from licensedetails useeffect",license,id);
        
        dispatch(ResetLicenseData());
        if(id)
        {
            dispatch(GetOneLicense(id));
        }
    },[id])
    return(
        <div className="license-details">
        <h2>License Details</h2>
        <div className="license-info">
            <p><strong>License ID:</strong> {license.LicenseID}</p>
            <p><strong>Application ID:</strong> {license.ApplicationID}</p>
            <p><strong>Driver ID:</strong> {license.DriverID}</p>
            <p><strong>Issue Date:</strong> {license.IssueDate}</p>
            <p><strong>Expiration Date:</strong> {license.ExpirationDate}</p>
            <p><strong>Notes:</strong> {license.Notes}</p>
            <p><strong>Paid Fees:</strong> ${license.PaidFees}</p>
            <p><strong>Active:</strong> {license.IsActive ? 'Yes' : 'No'}</p>
            <p><strong>Issue Reason:</strong> {license.IssueReason}</p>
            <p><strong>Created By User ID:</strong> {license.CreatedByUserID}</p>
            <p><strong>Full Name:</strong> {license.FullName}</p>
            <p><strong>National No:</strong> {license.NationalNo}</p>
            <p><strong>Date of Birth:</strong> {license.DateOfBirth}</p>
            <p><strong>Gender:</strong> {license.Gendor === 1 ? 'Male' : 'Female'}</p>
            <p><strong>Class Name:</strong> {license.ClassName}</p>
            <p><strong>Is Detained:</strong> {license.IsDetained?"yes":"no"}</p>
            {license.ImagePath && (
                <div className="license-image">
                    <img src={license.ImagePath} alt="License" />
                </div>
            )}
        </div>
    </div>
  )
}
export default CptLicenseDtails