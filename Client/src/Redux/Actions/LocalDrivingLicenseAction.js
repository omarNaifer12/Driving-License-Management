import { getDataAPI } from "../../utils/fetchData";
export const LocalDrivingLicenseAction={
   GET_ONE_LOCAL_DRIVING_LICENSE:"GET_ONE_LOCAL_DRIVING_LICENSE",
   RESET_LOCAL_DRIVING_LICENSE_DATA:"RESET_LOCAL_DRIVING_LICENSE_DATA",
   STORE_LOCAL_DRIVING_LICENSE_ID:"STORE_LOCAL_DRIVING_LICENSE_ID"
};
import { ALERT } from "../../utils/config";
export const GetLocalDrivingLicenseByIDAction=(id)=>async(dispatch)=>{
    try{
        const response=await getDataAPI(`LocalDrivingLicenses/one/${id}`);
        console.log("response localdrivving data get one from redux",response.data);
        
        const { applicationDto, OtherDetails } = response.data;
        const combinedData = { ...applicationDto, ...OtherDetails };
        console.log("combine data",combinedData);
        
        dispatch({
            type:LocalDrivingLicenseAction.GET_ONE_LOCAL_DRIVING_LICENSE,
            payload:combinedData
        });

    }
    catch(error){
        dispatch({
            type:ALERT,
            payload:error
        })

    }
}
export const ResetLocalDrivingLicenseDataAction=()=>(dispatch)=>{
    dispatch({
        type:LocalDrivingLicenseAction.RESET_LOCAL_DRIVING_LICENSE_DATA,
        payload:{
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
          }
    })
}
export const StoreLocalDrivingLicenseIDAction=(localDrivingLicenseID)=>(dispatch)=>{
    dispatch({
        type:LocalDrivingLicenseAction.STORE_LOCAL_DRIVING_LICENSE_ID,
        payload:localDrivingLicenseID
    });
}