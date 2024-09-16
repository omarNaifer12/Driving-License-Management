import { people } from "../Actions/peopleAction";
const initialState={
    People:[],
    Person:{}
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
                    person.PersonID===action.payload.PersonID?action.payload:person;
                })
            };
        case people.ADD_PERSON :
            return{
              ...state,People:state.People.push(action.payload)
            };
        case people.DELETE_PERSON :
            return{
                ...state,People:state.People.filter((person)=>person.PersonID!==action.payload)
            };            
            default:
            return state;    
    }
}
export default peopleReducer