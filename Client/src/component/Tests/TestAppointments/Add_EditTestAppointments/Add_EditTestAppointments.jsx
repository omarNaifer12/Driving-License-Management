import React, { useState } from 'react'
import './Add_EditTestAppointments.css'
import { useSelector } from 'react-redux';
import { postDataAPI } from '../../../../utils/fetchData';
const Add_EditTestAppointments = () => {
  const TestTrials=useSelector((state)=>state.Tests.TestTrials);
    const TestType=useSelector((state)=>state.Tests.TestType);
    const LocalDrivingLicense=useSelector((state)=>state.LocalDrivingLicenses.LocalDrivingLicense);
    const [date, setDate] = useState(new Date());

  
  const handleDateChange = (e) => {
    setDate(new Date(e.target.value));
  };
    const AddTestAppointement=async(e)=>{
      e.preventDefault();
      
const LocalDrivingLicenseApplicationID=LocalDrivingLicense.localDrivingLicenseID;
console.log("id is from add appointemrnt",LocalDrivingLicenseApplicationID);

        const userID=parseInt(localStorage.getItem("UserID"),10);
        const data={
          TestAppointmentID:-1,
         TestTypeID:TestType.TestTypeID,
        LocalDrivingLicenseApplicationID,
         AppointmentDate:date,
         PaidFees:TestType.TestTypeFees,
         CreatedByUserID:userID,
         RetakeTestApplicationID:-1
         
        }
        const response=await postDataAPI('TestAppointments/Add',data);
        console.log("the test appointment add success with response is ",response.data);
        alert("appointment saved successfully");
    }
  return (
    <div className="local-driving-license-details">
      {/* License Class Name */}
      <div className="detail-row">
        <label>License Class Name:</label>
        <span>{LocalDrivingLicense.LicenseClassName}</span>
      </div>
      {/* Local Driving License ID */}
      <div className="detail-row">
        <label>Local Driving License ID:</label>
        <span>{LocalDrivingLicense.localDrivingLicenseID}</span>
      </div>
      {/* Person Full Name */}
      <div className="detail-row">
        <label>Person Full Name:</label>
        <span>{LocalDrivingLicense.PersonFullName}</span>
      </div>

      {/* Application Fees */}
      <div className="detail-row">
        <label>Application Fees:</label>
        <span>{TestType.TestTypeFees}$</span>
      </div>

      {/* Test Trials */}
      <div className="detail-row">
        <label>Test Trials:</label>
        <span>{TestTrials}</span>
      </div>

      {/* Select Appointment Date */}
      <div className="detail-row">
        <label>Select Appointment Date:</label>
        <input 
          type="date" 
          value={date.toISOString().split('T')[0]} 
          onChange={handleDateChange} 
          className="date-picker"
        />
      </div>

      {/* Save Button */}
      <div className="button-row">
        <button onClick={AddTestAppointement} className="save-button">Save</button>
      </div>
    </div>
    )
}
export default Add_EditTestAppointments