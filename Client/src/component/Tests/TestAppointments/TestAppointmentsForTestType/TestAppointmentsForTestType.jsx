import React, { useEffect, useState } from 'react'
import './TestAppointmentsForTestType.css'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CptLocalDrivingApplicationDetails from '../../../LocalDrivingApplication/CptLocalDrivingApplicationDetails/CptLocalDrivingApplicationDetails';
import { getDataAPI } from '../../../../utils/fetchData';
import { GetApplicationTypeByIdAction, GetTestTypeByIdAction, TrialTestsAction } from '../../../../Redux/Actions/TestsAction';
const TestAppointmentsForTestType = () => {
    
    const CountPassedTests=useSelector((state)=>state.Tests.PassedTestsCount);
    const TestTrials=useSelector((state)=>state.Tests.TestTrials);
    const TestType=useSelector((state)=>state.Tests.TestType);
    const localDrivingLicenseID=useParams();
    const dispatch=useDispatch();
    useEffect(()=>{
        dispatch(GetLocalDrivingLicenseByIDAction(localDrivingLicenseID));
        dispatch(PassedTestCountAction(localDrivingLicenseID));

    },[CountPassedTests,dispatch,localDrivingLicenseID])
    const [TestAppointmentsForTestType,setTestAppointmentsForTestType]=useState( []);
    const fetchTestAppointmentsForTestType=async()=>{
        try{
        const response=await getDataAPI(`TestAppointments/TestAppointmentsForTestType?testTypeID=${CountPassedTests+1}&localDrivingLicenseApplicationID=${localDrivingLicenseID}`)
    setTestAppointmentsForTestType(response.data);    
    }
        catch(error){
            console.log("error",error);
            
        }
    }
    useEffect(()=>{
        if(CountPassedTests!==-1||CountPassedTests!==3){
            fetchTestAppointmentsForTestType();
            dispatch(GetTestTypeByIdAction(CountPassedTests+1));
            dispatch(TrialTestsAction(localDrivingLicenseID,CountPassedTests+1))
        }
    },[CountPassedTests,localDrivingLicenseID])
    if(CountPassedTests===3){
        return <p>u already passed all tests</p>
    }
    const checkTestCompletedForValidation=async()=>{
      try{
        const response=await getDataAPI(`Tests/TestCompleted?localDrivingLicenseApplicationID=${localDrivingLicenseID}&testTypeID=${CountPassedTests+1}`);
        if(response.data===true){
          return true;
        }
        else{
          return false;
        }

      }
      catch(error){
        console.log("error",error);
        return false;
      }

    }
    const checkActiveSheduledTestForValidation=async()=>{
      try{
        const response=await getDataAPI(`/TestAppointments/ActiveScheduledTest?localDrivingLicenseApplicationID=${localDrivingLicenseID}&testTypeID=${CountPassedTests+1}`);
        if(response.data===true){
          return true;
        }
        else{
          return false;
        }

      }
      catch(error){
        console.log("error",error);
        return false;
      }

    }
      const handleAddTestAppointment = (e) => {
        e.preventDefault();
        if(checkTestCompletedForValidation()){
          alert("is alredy completed the test you cant enter");
          return;
        }
        if(checkActiveSheduledTestForValidation()){
          alert("is already have other sheduled test ");
          return;
        }
        console.log('Add Test Appointment');
      };
    
      const handleTakeTest = (TestAppointmentID) => {
        // Logic for taking the test with TestAppointmentID
        console.log(`Take test for appointment ID: ${TestAppointmentID}`);
      };
  return (
    
        <div>
      <CptLocalDrivingApplicationDetails />

      <h2>Test Appointments</h2>

      <div className="test-appointments-list">
        {TestAppointmentsForTestType.length > 0 ? (
          TestAppointmentsForTestType.map((appointment) => (
            <div key={appointment.TestAppointmentID} className="test-appointment-item">
              <p>Test Appointment ID: {appointment.TestAppointmentID}</p>
              <p>Appointment Date: {new Date(appointment.AppointmentDate).toLocaleDateString()}</p>
              <p>Paid Fees: ${appointment.PaidFees.toFixed(2)}</p>
              <p>{appointment.IsLocked ? 'Locked' : 'Unlocked'}</p>
              <button onClick={() => handleTakeTest(appointment.TestAppointmentID)}>Take Test</button>
            </div>
          ))
        ) : (
          <p>No test appointments available</p>
        )}
      </div>

      <button className="add-test-appointment-btn" onClick={handleAddTestAppointment}>
        Add Test Appointment
      </button>
    </div>
    
  )
}

export default TestAppointmentsForTestType