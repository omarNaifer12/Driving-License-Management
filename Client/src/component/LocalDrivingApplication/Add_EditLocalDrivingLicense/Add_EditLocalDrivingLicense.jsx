import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { GetLocalDrivingLicenseByIDAction, ResetLocalDrivingLicenseDataAction } from '../../../Redux/Actions/LocalDrivingLicenseAction';
import { getOneUserAction } from '../../../Redux/Actions/UsersAction';
import { GetApplicationTypeByID } from '../../../helper/ApplicationType';
import { getDataAPI, postDataAPI, putDataAPI } from '../../../utils/fetchData';
import './Add_EditLocalDrivingLicense.css'
import { useParams } from 'react-router-dom';
const Add_EditLocalDrivingLicense = () =>{
    const {id}=useParams();
    const dispatch=useDispatch();
    const localDrivingLicenseFromRedux=useSelector((state)=>state.LocalDrivingLicenses.LocalDrivingLicense);
    const user=useSelector((state)=>state.Users.user);
    const personFromRedux=useSelector((state)=>state.Persons.Person);
    const [dataApplicationType,setDataApplicationType]=useState({});
  const [localDrivingLicense,setLocalDrivingLicense]=useState({
    ApplicationID: 0,
    ApplicantPersonID: 0,
    ApplicationDate: new Date().toISOString().split("T")[0],
    ApplicationTypeID: 1,
    ApplicationStatus: 1,
    LastStatusDate: new Date().toISOString().split("T")[0],
    PaidFees: 0,
    CreatedByUserID: 0,
    CreatedByUserName: '',
    LicenseClassID: 1,
    localDrivingLicenseID: 0
  });
  const [LicenseClasses,setLicenseClasses]=useState([]);
  const fetchLicenseClasses=async()=>{
    try{
        const response=await getDataAPI("LicenseClasses/All");
        setLicenseClasses(response.data);

    }
    catch(error){
        console.log("error",error);
        

    }
  }
  const CheckPersonHaveSameLocalDrivingLicense=async(ApplicantPersonID,LicenseClassID)=>{
    try{
      const response =await getDataAPI(`LocalDrivingLicenses/checkPersonHaveSameLDL?ApplicationTypeID=${1}&ApplicantPersonID=${ApplicantPersonID}&LicenseClassID=${LicenseClassID}`);
      if(response.data.success){
        return true;
      }
      else {
        return false;
      }

    }
    catch(error){
      console.log("errro ",error);
      

    }

  }
  const Save=async(e)=>{
    e.preventDefault();

  // Format the time as HH:MM:SS.sss
  const time =new Date().toISOString();

    const applicationDto={
           
              ApplicationID: localDrivingLicense.ApplicationID,
              ApplicantPersonID: localDrivingLicense.ApplicantPersonID?localDrivingLicense.ApplicantPersonID:personFromRedux.PersonID,
              ApplicationDate: localDrivingLicense.ApplicationDate,
              ApplicationTypeID: localDrivingLicense.ApplicationTypeID,
              ApplicationStatus: localDrivingLicense.ApplicationStatus,
              LastStatusDate: time,
              PaidFees: localDrivingLicense.PaidFees,
              CreatedByUserID: localDrivingLicense.CreatedByUserID?localDrivingLicense.CreatedByUserID:user.UserID,
    }
    
    
    try {
      let response;
      if(localDrivingLicense.localDrivingLicenseID===0&&!id){
        if(CheckPersonHaveSameLocalDrivingLicense(applicationDto.ApplicantPersonID,localDrivingLicense.LicenseClassID)){
          alert("this person already have active local Driving License");
          return;
        }
        response=await postDataAPI(`LocalDrivingLicenses/Add?licenseClassID=${localDrivingLicense.LicenseClassID}`,applicationDto);
        console.log("addedd success",response.data);
        setLocalDrivingLicense({...localDrivingLicense,localDrivingLicenseID:response.data.localDrivingLicenseData
           .LocalDrivingLicenseApplicationID,ApplicationID:response.data.applicationDto.ApplicationID
        });
        dispatch(GetLocalDrivingLicenseByIDAction(response.data.localDrivingLicenseData
            .LocalDrivingLicenseApplicationID));
        
        alert("data added successfuly");
      }
      else if(localDrivingLicense.localDrivingLicenseID){

        
        response=await putDataAPI(`LocalDrivingLicenses/Update/${localDrivingLicense.localDrivingLicenseID}?licenseClassID=${localDrivingLicense.LicenseClassID}`,applicationDto);
        alert("data updated successfuly");
    }
    } catch (error) {
      console.log("Error  application", error);
    }
  }
  useEffect(()=>{
 const loadData=async()=>{
    dispatch(ResetLocalDrivingLicenseDataAction());
    if(id){
 dispatch(GetLocalDrivingLicenseByIDAction(id));
    }
    else if(!id){
        const userID=parseInt(localStorage.getItem("UserID"),10);
        dispatch(getOneUserAction(userID));
        console.log("userid from add is ",userID);
        
        const ApplicationsType= await GetApplicationTypeByID(1);
        console.log("applicationtype in add is ",ApplicationsType);
        
        setLocalDrivingLicense({...localDrivingLicense,PaidFees:ApplicationsType.ApplicationFees});
    }
    }
    loadData();
    fetchLicenseClasses();
  },[id]);
  useEffect(()=>{
    console.log("from useefect localdriving redux one ",localDrivingLicenseFromRedux);
  if(localDrivingLicenseFromRedux){
            setLocalDrivingLicense(localDrivingLicenseFromRedux);
            console.log("from useefect localdriving redux",localDrivingLicenseFromRedux);
            
    }

  },[id,user,localDrivingLicenseFromRedux,personFromRedux])
  return (
    <div className="application-details">
      <div className="form-row">
        <h1>{localDrivingLicense.localDrivingLicenseID?"Update ":"Add"}</h1>
        <label>D.L. Application ID:</label>
        <span>{localDrivingLicense.localDrivingLicenseID?localDrivingLicense.localDrivingLicenseID:"????"}</span>
      </div>
      <div className="form-row">
        <label>Application Date:</label>
        <span>{localDrivingLicense.ApplicationDate}</span>
      </div>
      <div className="form-row">
        <label>License Class:</label>
        <select
          value={localDrivingLicense.LicenseClassID}
          onChange={(e) => setLocalDrivingLicense({...localDrivingLicense,LicenseClassID:e.target.value})} // Handle change if necessary
        >
          {LicenseClasses.map((cls) => (
            <option key={cls.LicenseClassID} value={cls.LicenseClassID}>
              {cls.ClassName}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label>Application Fees:</label>
        <span>{localDrivingLicense.PaidFees}$</span>
      </div>

      <div className="form-row">
        <label >Created By: </label>
        <span>{user.UserID?user.UserName:localDrivingLicense.CreatedByUserName}</span>
      </div>
      <button  onClick={(e) => Save(e)}>save</button>
    </div>
  );
}

export default Add_EditLocalDrivingLicense