import { getDataAPI } from "../utils/fetchData";

export const GetApplicationTypeByID=async(id)=>{
    try{
        const response=await getDataAPI(`ApplicationType/one/${id}`);
   
        
        return response;

    }
    catch(error){
        console.log("errro",error);
        return undefined;
        
    }
}