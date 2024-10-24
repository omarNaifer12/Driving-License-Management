import React, { useEffect, useState } from 'react'
import './TestAppointmentsForTestType.css'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import CptLocalDrivingApplicationDetails from '../../../LocalDrivingApplication/CptLocalDrivingApplicationDetails/CptLocalDrivingApplicationDetails';
import { getDataAPI } from '../../../../utils/fetchData';
import {  GetTestTypeByIdAction, PassedTestCountAction, TrialTestsAction } from '../../../../Redux/Actions/TestsAction';
import { GetLocalDrivingLicenseByIDAction, ResetLocalDrivingLicenseDataAction } from '../../../../Redux/Actions/LocalDrivingLicenseAction';
const TestAppointmentsForTestType =()=>{  
    
    const LocalDrivingLicense=useSelector((state)=>state.LocalDrivingLicenses.LocalDrivingLicense)
    const navigate=useNavigate();
    const {localDrivingLicenseID}=useParams();
    const {CountPassedTest}=useParams();
    const CountPassedTests=parseInt(CountPassedTest, 10); 
    const dispatch=useDispatch();
    useEffect(()=>{
      console.log("countpassed",CountPassedTests,'type',typeof CountPassedTests);
      
      dispatch(GetLocalDrivingLicenseByIDAction(localDrivingLicenseID));
      dispatch(PassedTestCountAction(localDrivingLicenseID));
console.log("localdribg is",localDrivingLicenseID,"typelocal",typeof localDrivingLicenseID);
      
    },[CountPassedTests,dispatch,localDrivingLicenseID])
    const [TestAppointmentsForTestType,setTestAppointmentsForTestType]=useState( []);
    const fetchTestAppointmentsForTestType=async()=>{
        try{
        const response=await getDataAPI(`TestAppointments/TestAppointmentsForTestType?testTypeID=${CountPassedTests+1}&localDrivingLicenseApplicationID=${localDrivingLicenseID}`)
        if(response.status!==404){
          setTestAppointmentsForTestType(response.data);
        }
    
    }
        catch(error){
            console.log("error",error);
            
        }
    }
    useEffect(()=>{
      console.log(localDrivingLicenseID);
       
            fetchTestAppointmentsForTestType();
            dispatch(GetTestTypeByIdAction(CountPassedTests+1));
            dispatch(TrialTestsAction(localDrivingLicenseID,CountPassedTests+1));
        
    },[CountPassedTests,localDrivingLicenseID])
    if(CountPassedTests===3){
    return<p>u already passed all tests</p>
    }
    const checkTestCompletedForValidation=async()=>{

     
      try{
        const response=await getDataAPI(`Tests/TestCompleted?localDrivingLicenseApplicationID=${localDrivingLicenseID}&testTypeID=${CountPassedTests+1}`);
        if(response.data===true){
          console.log("enter true from complete");
          
          return true;
        }
        else{
          console.log("enter false from complete");
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
        const response=await getDataAPI(`TestAppointments/ActiveScheduledTest?localDrivingLicenseApplicationID=${localDrivingLicenseID}&testTypeID=${CountPassedTests+1}`);
        if(response.data===true){
          console.log("enter true from active shedule");
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
      const handleAddTestAppointment =async (e) => {
        e.preventDefault();
        const checkComplete= await checkTestCompletedForValidation();
        if(checkComplete){
          alert("is alredy completed the test you cant enter");
          return;
        }
        const checkShedule=await checkActiveSheduledTestForValidation();
        if(checkShedule){
          alert("is already have other sheduled test ");
          return;
        }
        navigate("/Add-Test-Appointments");
      };
    
      const handleTakeTest = (TestAppointmentID,locked) => {
        if(locked){
          alert(" you already taked this test");
        }
        else
      navigate(`/pass-fail-TestAppointment/${TestAppointmentID}`);
      };
  return (
    
        <div>
      <h1 onClick={()=>{console.log('passed test count',CountPassedTests,'typeis ',typeof CountPassedTests);
      }}>{CountPassedTests===0?"vison test":(CountPassedTests===1?"written test":"practical test")} </h1>
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
              <button onClick={() => handleTakeTest(appointment.TestAppointmentID,appointment.IsLocked)}>Take Test</button>
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