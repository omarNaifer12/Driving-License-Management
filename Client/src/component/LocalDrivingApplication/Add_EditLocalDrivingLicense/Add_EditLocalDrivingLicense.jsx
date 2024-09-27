import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { GetLocalDrivingLicenseByID, GetLocalDrivingLicenseByIDAction, ResetLocalDrivingLicenseDataAction } from '../../../Redux/Actions/LocalDrivingLicenseAction';

const Add_EditLocalDrivingLicense = () => {
    const id=0;
    const dispatch=useDispatch();
    const localDrivingLicenseFromRedux=useSelector((state)=>state.LocalDrivingLicenses.localDrivingLicense);
  const [localDrivingLicense,setLocalDrivingLicense]=useState({
    ApplicationID: '',
    ApplicantPersonID: '',
    ApplicationDate: '',
    ApplicationTypeID: '',
    ApplicationStatus: '',
    LastStatusDate: '',
    PaidFees: '',
    CreatedByUserID: '',
    CreatedByUserName: '',
    ApplicationFees: '',
    LicenseClassID: '',
    localDrivingLicenseID: ''
  });
  useEffect(()=>{
    dispatch(ResetLocalDrivingLicenseDataAction());
    if(id){
dispatch(GetLocalDrivingLicenseByIDAction(id));
    }
    else if(!id&&!localDrivingLicense){

    }

  },[])
    return (
    <div>
        
    </div>
  )
}

export default Add_EditLocalDrivingLicense