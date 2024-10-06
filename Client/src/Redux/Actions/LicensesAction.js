import { getDataAPI } from "../../utils/fetchData";
export const LicenseAction={
   GET_ONE_LICENSE:"GET_ONE_LICENSE",
   RESET_LICENSE_DATA:"RESET_LICENSE_DATA",
};
import { ALERT } from "../../utils/config"
export const GetOneLicense=(id)=>async(dispatch)=>{
    try{
        const response=await getDataAPI(`Licenses/one/${id}`);
        const { licenseDTO, OtherDetails } = response.data;
        const combinedData = { ...licenseDTO, ...OtherDetails };
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