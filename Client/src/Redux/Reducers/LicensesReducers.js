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
    ImagePath: "",
    DefaultValidityLength:0,
    ClassFees:0,
    IsDetained:false
  },
  LicenseID:0,
  InaternationalLicenseDetails:{
    PersonID: 0,
    NationalNo: "",
    DateOfBirth: "",
    Gendor: "",
    LicenseID:0,
    ImagePath: "",
    InternationalLicenseID: 0,
    DriverID: 0,
    IssuedUsingLocalLicenseID: 0,
    IssueDate: new Date(),
    ExpirationDate: new Date(),
    IsActive: true,
    CreatedByUserID: 0,
    ApplicationID: 0
},
    LicensIdForChangeLicense:0,
    ApplicationIDForChangeLicense:0

}
const LicensesReducer=(state=initialState,action)=>{
switch(action.type){
    case LicenseAction.GET_ONE_LICENSE:
        return {
           ...state,licenseDetails:action.payload
        }
    case LicenseAction.LICENSE_ID:
        return {
            ...state,LicenseID:action.payload
        }
    case LicenseAction.RESET_LICENSE_ID:
        return {
            ...state,LicenseID:action.payload
        } 
    case LicenseAction.RESET_LICENSE_DATA:
      return   {
            ...state,licenseDetails:action.payload
        }
    case LicenseAction.GET_ONE_INETRNATIONAL_LICENSE:
        return {
            ...state,InaternationalLicenseDetails:action.payload
        }
        case LicenseAction.SET_LICENSEID_FOR_CHANGE_LICENSE:
            return {
              ...state,
              LicensIdForChangeLicense: action.payload 
            };
          case LicenseAction.RESET_LICENSEID_FOR_CHANGE_LICENSE:
            return {
              ...state,
              LicensIdForChangeLicense: 0 
            };
          case LicenseAction.SET_APPLICATIONID_FOR_CHANGE_LICENSE:
            return {
              ...state,
              ApplicationIDForChangeLicense: action.payload 
            };
          case LicenseAction.RESET_APPLICATIONID_FOR_CHANGE_LICENSE:
            return {
              ...state,
              ApplicationIDForChangeLicense: 0 
            };
          
        default:
            return state
}
}
export default LicensesReducer;