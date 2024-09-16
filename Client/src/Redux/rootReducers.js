import { combineReducers } from "redux";
import PeopleReducer from './Reducers/peopleReducer'
const rootReducers=combineReducers({
    Persons:PeopleReducer,
})
export default rootReducers;