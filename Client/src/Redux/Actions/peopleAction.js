import { getDataAPI } from "../../utils/fetchData";
export const people={
    GET_ALL_PEOPLE:"GET_ALL_PEOPLE",
    GET_ONE_PERSON:"GET_ONE_PERSON",
    ADD_PERSON:"ADD_PERSON",
    EDIT_PERSON:"EDIT_PERSON",
    DELETE_PERSON:"DELETE_PERSON",
    RESET_PERSON_DATA:"RESET_PERSON_DATA"

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
        const person=await getDataAPI(`Persons/one/${perosnID}`);
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
export const ResetPersonData=()=>(dispatch)=>{
    dispatch({
        type:people.RESET_PERSON_DATA,
        payload:{
            PersonID:'',
            FirstName: '',
            SecondName: '',
            ThirdName: '',
            LastName: '',
            NationalNo: '',
            DateOfBirth: '',
            Gendor: '',
            Address: '',
            Phone: '',
            Email: '',
            NationalityCountryID: '',
            ImagePath: '',
            CountryName:'',
            GendorCaption:'',
          }
    })
}
