import { combineReducers } from "redux";
import PeopleReducer from './Reducers/peopleReducer'
import { UsersReducer } from "./Reducers/UsersReducer";
import { localDrivingLicenseReducer } from "./Reducers/LocalDrivingLicenseReducer";
import TestReducer from "./Reducers/TestsReducer";
import LicensesReducer from "./Reducers/LicensesReducers";
const rootReducers=combineReducers({
    Persons:PeopleReducer,
    Users:UsersReducer,
    LocalDrivingLicenses:localDrivingLicenseReducer,
    Tests:TestReducer,
    LicensesReducer:LicensesReducer
    
})
export default rootReducers;