import { people } from "../Actions/peopleAction";
const initialState={
    People:[],
    Person:{
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
}
const peopleReducer=(state=initialState,action)=>{
      switch(action.type){
        case people.GET_ALL_PEOPLE :
            return {
                ...state,People:action.payload
            };
        case people.GET_ONE_PERSON :
            return{
                ...state,Person:action.payload
            };
        case people.EDIT_PERSON :
            return{
                ...state,People : state.People.map((person)=>{
                 return   person.PersonID===action.payload.PersonID?action.payload:person;
                })
            };
        case people.ADD_PERSON :
            return{
              ...state,People:[...state.People,action.payload]
            };
        case people.DELETE_PERSON :
            return{
                ...state,People:state.People.filter((person)=>person.PersonID!==action.payload)
            };  
            case people.RESET_PERSON_DATA:
                {
                    return {
                        ...state,Person:action.payload
                    }
                }          
            default:
            return state;    
    }
}
export default peopleReducer