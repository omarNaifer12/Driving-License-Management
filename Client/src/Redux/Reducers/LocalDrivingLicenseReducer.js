import { LocalDrivingLicenseAction } from "../Actions/LocalDrivingLicenseAction"

const initialState={
  LocalDrivingLicense:{
    ApplicationID: 0,
    ApplicantPersonID: '',
    ApplicationDate: new Date().toISOString().split('T')[0],
    ApplicationTypeID: 0,
    ApplicationStatus: '',
    LastStatusDate: new Date().toISOString().split('T')[0],
    PaidFees: 0,
    CreatedByUserID: 0,
    CreatedByUserName: '',
    LicenseClassID: 0,
    localDrivingLicenseID: 0,
    PersonFullName:'',
    ApplicationTypeName:'',
    LicenseClassName:''
  },
  localDrivingLicenseID:0
}
export const  localDrivingLicenseReducer=(state=initialState,action)=>{
    switch(action.type){
        case LocalDrivingLicenseAction.GET_ONE_LOCAL_DRIVING_LICENSE:
            return {
                ...state,LocalDrivingLicense:action.payload
            }
            case LocalDrivingLicenseAction.RESET_LOCAL_DRIVING_LICENSE_DATA:
                return {
                    ...state,LocalDrivingLicense:action.payload
                };
            case LocalDrivingLicenseAction.STORE_LOCAL_DRIVING_LICENSE_ID:
                return {
                    ...state,localDrivingLicenseID:action.payload
                }    
                default :
                return state;
    }
}