import React, { useEffect, useState } from 'react'
import './IssueLocalDrivingLicenseFirstTime.css'
import CptLocalDrivingApplicationDetails from '../../../LocalDrivingApplication/CptLocalDrivingApplicationDetails/CptLocalDrivingApplicationDetails'
import { useDispatch } from 'react-redux'
import { GetLocalDrivingLicenseByIDAction } from '../../../../Redux/Actions/LocalDrivingLicenseAction'
import { useParams } from 'react-router-dom'
import { PassedTestCountAction } from '../../../../Redux/Actions/TestsAction'
import { postDataAPI } from '../../../../utils/fetchData'
import axios from 'axios'
import { BASE_URL } from '../../../../utils/config'
const IssueLocalDrivingLicenseFirstTime = () => {
const dispatch=useDispatch();
const [Note,setNote]=useState("");
const {id}=useParams();
const issueFirstTimeLicense=async(e)=>{
    e.preventDefault();
    const userID=parseInt(localStorage.getItem("UserID"),10);
    try{
    const response=await axios.post(`${BASE_URL}/api/LocalDrivingLicenses/IssueLocalDrivingLicense?createdByUserID=${userID}
        &LocalDrivingLicenseApplicationID=${id}`,Note,{ headers: { 'Content-Type': 'application/json' } })
    console.log("addedd success",response.data);
    }
    catch(error){
    console.log("error",error);
    }
}
    useEffect(()=>{
        dispatch(GetLocalDrivingLicenseByIDAction(id));
        dispatch(PassedTestCountAction(id));

 },[id,dispatch]);
    return (
    <div>
        <label>IssueLocalDrivingLicenseFirstTime</label>
        <CptLocalDrivingApplicationDetails />
        <textarea 
            value={Note} 
            onChange={(e) => setNote(e.target.value)} 
            placeholder="Enter any notes here..."
        />
        <button onClick={(e)=>issueFirstTimeLicense(e)}>save</button>
    </div>
  )
}
export default IssueLocalDrivingLicenseFirstTime