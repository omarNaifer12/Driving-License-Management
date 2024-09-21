import { getDataAPI } from "../../utils/fetchData";
export const people={
    GET_ALL_PEOPLE:"GET_ALL_PEOPLE",
    GET_ONE_PERSON:"GET_ONE_PERSON",
    ADD_PERSON:"ADD_PERSON",
    EDIT_PERSON:"EDIT_PERSON",
    DELETE_PERSON:"DELETE_PERSON"
};
import { ALERT } from "../../utils/config";
export const getAllPeopleAction=()=>async(dispatch)=>{
    try{
        const resPeople=await getDataAPI("Persons/All");
        dispatch({
            type:people.GET_ALL_PEOPLE,
            payload:resPeople.data
        })

    }
    catch(error){
        dispatch({
            type:ALERT,
            payload:error
        })
    }    
};
export const getOnePersonAction=(perosnID)=>async(dispatch)=>{
    try{
        const person=await getDataAPI(`persons/one/${perosnID}`);
            dispatch({
                type:people.GET_ONE_PERSON,
                payload:person.data
            })
    }
    catch(error){
        dispatch({
            type:ALERT,
            payload:error
        })

    }
};
export const editPersonAction=(Person)=>async(dispatch)=>{
    dispatch({
        type:people.EDIT_PERSON,
        payload:Person
    });
};
export const addPersonAction=(Person)=>async(dispatch)=>{
    dispatch({
        type:people.ADD_PERSON,
        payload:Person
    });
};
export const deletePersonAction=(PersonID)=>async(dispatch)=>{
    dispatch({
        type:people.DELETE_PERSON,
        payload:PersonID
    });
}
