import { getDataAPI } from "../../utils/fetchData";
export const LicenseAction={
   GET_ONE_LICENSE:"GET_ONE_LICENSE",
   RESET_LICENSE_DATA:"RESET_LICENSE_DATA",
   LICENSE_ID:"LICENSE_ID",
   RESET_LICENSE_ID:"RESET_LICENSE_ID"
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