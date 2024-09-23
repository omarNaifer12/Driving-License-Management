import { usersAction } from "../Actions/UsersAction"

const initialState={
    users:[],
    user:{
        UserID:0,
        PersonID:0,
        FullName:"",
        IsActive:false,
        UserName:"",
        Password:"",

    }
}
export const UsersReducer=(state=initialState,action)=>{
    switch(action.type){
        case usersAction.GET_ALL_Users:
            return {
                ...state,users:action.payload
            };
        case usersAction.GET_ONE_USER:
            return {
                ...state,user:action.payload
            }; 
        case usersAction.DELETE_USER:
            return{
                ...state,users:state.users.filter((user)=>user.UserID!==action.payload)
            };
            default:
                return state;

    }

}