import React, { useState } from 'react'
import "./Pass_Fail_TestApointment.css"
import { useParams } from 'react-router-dom';
import { postDataAPI } from '../../../../utils/fetchData';
const Pass_Fail_TestApointment = () => {
    const TestTrials=useSelector((state)=>state.Tests.TestTrials);
    const TestType=useSelector((state)=>state.Tests.TestType);
    const LocalDrivingLicense=useSelector((state)=>state.LocalDrivingLicenses.LocalDrivingLicense);
    const [TestID,setTestID]=useState(null);
    const TestAppointmentID=useParams();
    const [result,setResult]=useState("pass");
    const [Note,setNote]=useState("");
    const SaveAndAddTheResult=async()=>{
        const userID=parseInt(localStorage.getItem("UserID"),10);
        const data={
            TestAppointmentID: TestAppointmentID,
            TestResult: result==='pass',
            Notes: Note,
            CreatedByUserID: userID
        };
        try{ 
        const response=await postDataAPI("Tests/Add",data);
          console.log("addedd test success ",response.data);
          setTestID(response.data.TestID);
        }
        catch(error){
            console.log("error",error);
            
        }
        }

    

  return (
    <div className="pass-fail-test-appointment">
    <h2>Test Appointment Details</h2>

   
    <div className="detail-row">
        <label>License Class Name:</label>
        <span>{LocalDrivingLicense?.LicenseClassName}</span>
    </div>

    
    <div className="detail-row">
        <label>Local Driving License ID:</label>
        <span>{LocalDrivingLicense?.localDrivingLicenseID}</span>
    </div>

    
    <div className="detail-row">
        <label>Person Full Name:</label>
        <span>{LocalDrivingLicense?.PersonFullName}</span>
    </div>

    
    <div className="detail-row">
        <label>Test Type Fees:</label>
        <span>{TestType?.TestTypeFees}</span>
    </div>

    
    <div className="detail-row">
        <label>Test Trials:</label>
        <span>{TestTrials}</span>
    </div>

   
    <div className="detail-row">
        <label>Result:</label>
        <div>
            <label>
                <input 
                    type="radio" 
                    value="pass" 
                    checked={result === 'pass'} 
                    onChange={() => setResult('pass')} 
                />
                Pass
            </label>
            <label>
                <input 
                    type="radio" 
                    value="fail" 
                    checked={result === 'fail'} 
                    onChange={() => setResult('fail')} 
                />
                Fail
            </label>
        </div>
    </div>

   
    <div className="detail-row">
        <label>Notes:</label>
        <textarea 
            value={Note} 
            onChange={(e) => setNote(e.target.value)} 
            placeholder="Enter any notes here..."
        />
    </div>

    
    {TestID ? (
        <div className="detail-row">
            <label>Test ID:</label>
            <span>{TestID}</span>
        </div>
    ) : (
        <p>Test not taken yet</p>
    )}

   
    <div className="button-row">
        <button onClick={()=>SaveAndAddTheResult()} className="save-button">Save</button>
    </div>
</div>
  )
}

export default Pass_Fail_TestApointment