import { getDataAPI } from "../../utils/fetchData";
export const LicenseAction={
   GET_ONE_LICENSE:"GET_ONE_LICENSE",
   RESET_LICENSE_DATA:"RESET_LICENSE_DATA",
   LICENSE_ID:"LICENSE_ID",
   RESET_LICENSE_ID:"RESET_LICENSE_ID",
   GET_ONE_INETRNATIONAL_LICENSE:"GET_ONE_INETRNATIONAL_LICENSE",
   SET_LICENSEID_FOR_CHANGE_LICENSE:"SET_LICENSEID_FOR_CHANGE_LICENSE",
   SET_APPLICATIONID_FOR_CHANGE_LICENSE:"SET_APPLICATION_FOR_CHANGE_LICENSE",
   RESET_LICENSEID_FOR_CHANGE_LICENSE:"SET_LICENSEID_FOR_CHANGE_LICENSE",
   RESET_APPLICATIONID_FOR_CHANGE_LICENSE:"SET_APPLICATION_FOR_CHANGE_LICENSE"

};
import { ALERT } from "../../utils/config"
export const GetOneLicense=(id)=>async(dispatch)=>{
    try{
        const response=await getDataAPI(`Licenses/one/${id}`);
        const { licenseDTO, OtherDetails } = response.data;
        const combinedData = { ...licenseDTO, ...OtherDetails };
        console.log("combine data",combinedData);
        
        dispatch({
            type:LicenseAction.GET_ONE_LICENSE,
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
    export const setLicenseID=(licenseId)=>(dispatch)=>{
        dispatch({
            type:LicenseAction.LICENSE_ID,
            payload:licenseId
        });
    }
    export const ResetLicenseID=()=>(dispatch)=>{
        dispatch({
            type:LicenseAction.RESET_LICENSE_ID,
            payload:0
        });
    }
    export const ResetLicenseData=()=>(dispatch)=>{
        dispatch({
            type:LicenseAction.RESET_LICENSE_DATA,
            payload:{
                LicenseID: 0,
                ApplicationID: 0,
                DriverID: 0,
                LicenseClass: 0,
                IssueDate: "",
                ExpirationDate: "",
                Notes: "",
                PaidFees: 250,
                IsActive: true,
                IssueReason: 1,
                CreatedByUserID: 0,
                PersonID:0,
                FullName: "",
                NationalNo: "",
                DateOfBirth: "",
                Gendor: 0,
                ClassName: "",
                ImagePath: ""
              }
        })
    }
export const GetOneInetnationalLicense=(id)=>async(dispatch)=>{
    try{
        const response=await getDataAPI(`InternationalLicenses/one/${id}`);
        const { INLbusinessDTO, OtherDetails } = response.data;
        const combinedData = { ...INLbusinessDTO, ...OtherDetails };
        console.log("combine data",combinedData);        
        dispatch({
            type:LicenseAction.GET_ONE_INETRNATIONAL_LICENSE,
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
    export const setLicenseIdForChangeLicense = (licenseId) => (dispatch) => {
        dispatch({
          type: LicenseAction.SET_LICENSEID_FOR_CHANGE_LICENSE,
          payload: licenseId,
        });
      };
      
     
      export const setApplicationIdForChangeLicense = (applicationId) => (dispatch) => {
        dispatch({
          type: LicenseAction.SET_APPLICATIONID_FOR_CHANGE_LICENSE,
          payload: applicationId,
        });
      };
      
     
      export const resetLicenseIdForChangeLicense = () => (dispatch) => {
        dispatch({
          type: LicenseAction.RESET_LICENSEID_FOR_CHANGE_LICENSE,
        });
      };
      
      
      export const resetApplicationIdForChangeLicense = () => (dispatch) => {
        dispatch({
          type: LicenseAction.RESET_APPLICATIONID_FOR_CHANGE_LICENSE,
        });
      };