import { LocalDrivingLicenseAction } from "../Actions/LocalDrivingLicenseAction"

const initialState={
  LocalDrivingLicense:{
    ApplicationID: '',
    ApplicantPersonID: '',
    ApplicationDate: '',
    ApplicationTypeID: '',
    ApplicationStatus: '',
    LastStatusDate: '',
    PaidFees: '',
    CreatedByUserID: '',
    CreatedByUserName: '',
    ApplicationFees: '',
    LicenseClassID: '',
    localDrivingLicenseID: ''
  }
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
                }
    }
}