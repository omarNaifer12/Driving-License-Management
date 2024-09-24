import { getDataAPI } from "../../utils/fetchData";
export const usersAction={
    GET_ALL_Users:"GET_ALL_PEOPLE",
    GET_ONE_USER:"GET_ONE_USER",
    ADD_USER:"ADD_USER",
    EDIT_USER:"EDIT_USER",
    DELETE_USER:"DELETE_USER",
    RESET_USER_DATA:"RESET_USER_DATA"

};
import { ALERT } from "../../utils/config";
export const GetAllUsersAction=()=>async(dispatch)=>{
    try{
        const resUsers=await getDataAPI("Users/All");
        dispatch({
            type:usersAction.GET_ALL_Users,
            payload:resUsers.data
        })
    }
    catch(error){
        dispatch({
            type:ALERT,
            payload:error
        })
    }    
};
export const getOneUserAction=(UserID)=>async(dispatch)=>{
    try{
        const user=await getDataAPI(`Users/one/${UserID}`);
            dispatch({
                type:usersAction.GET_ONE_USER,
                payload:user.data
            })
    }
    catch(error){
        dispatch({
            type:ALERT,
            payload:error
        })

    }
}; 
export const deleteUserAction=(UserID)=>async(dispatch)=>{
    dispatch({
        type:usersAction.DELETE_USER,
        payload:UserID
    });
}
export const ResetUserData=()=>(dispatch)=>{
    dispatch({
        type:usersAction.RESET_USER_DATA,
        payload:{
            UserID:0,
            PersonID:0,
            FullName:"",
            IsActive:false,
            UserName:"",
            Password:"",
           }
    })
}
