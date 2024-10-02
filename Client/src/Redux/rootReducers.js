import { combineReducers } from "redux";
import PeopleReducer from './Reducers/peopleReducer'
import { UsersReducer } from "./Reducers/UsersReducer";
import { localDrivingLicenseReducer } from "./Reducers/LocalDrivingLicenseReducer";
import TestReducer from "./Reducers/TestsReducer";
const rootReducers=combineReducers({
    Persons:PeopleReducer,
    Users:UsersReducer,
    LocalDrivingLicenses:localDrivingLicenseReducer,
    Tests:TestReducer
    
})
export default rootReducers;