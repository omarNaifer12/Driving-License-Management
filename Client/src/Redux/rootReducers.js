import { combineReducers } from "redux";
import PeopleReducer from './Reducers/peopleReducer'
import { UsersReducer } from "./Reducers/UsersReducer";
const rootReducers=combineReducers({
    Persons:PeopleReducer,
    Users:UsersReducer,
})
export default rootReducers;