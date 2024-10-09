import { LicenseAction } from "../Actions/LicensesAction"

const initialState={
    licenseDetails: {
    LicenseID: 0,
    ApplicationID: 0,
    DriverID: 0,
    LicenseClass: 0,
    IssueDate: "",
    ExpirationDate: "",
    Notes: "",
    PaidFees: 250,
    IsActive: true,
    IssueReason: 1,
    CreatedByUserID: 0,
    PersonID:0,
    FullName: "",
    NationalNo: "",
    DateOfBirth: "",
    Gendor: 0,
    ClassName: "",
    ImagePath: ""
  },
  LicenseID:0
  
}
const LicensesReducer=(state=initialState,action)=>{
switch(action.type){
    case LicenseAction.GET_ONE_LICENSE:
        return {
           ...state,licenseDetails:action.payload
        }
    case LicenseAction.LICENSE_ID:
        return {
            ...state,licenseID:action.payload
        }
    case LicenseAction.RESET_LICENSE_ID:
        return {
            ...state,licenseID:action.payload
        } 
    case LicenseAction.RESET_LICENSE_DATA:
      return   {
            ...state,licenseDetails:action.payload
        }       
        default:
            return state
}
}
export default LicensesReducer;