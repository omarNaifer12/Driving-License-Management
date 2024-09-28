import { combineReducers } from "redux";
import PeopleReducer from './Reducers/peopleReducer'
import { UsersReducer } from "./Reducers/UsersReducer";
import { localDrivingLicenseReducer } from "./Reducers/LocalDrivingLicenseReducer";
const rootReducers=combineReducers({
    Persons:PeopleReducer,
    Users:UsersReducer,
    LocalDrivingLicenses:localDrivingLicenseReducer
    
})
export default rootReducers;