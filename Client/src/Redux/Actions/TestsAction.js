import { ALERT } from "../../utils/config";
import { getDataAPI } from "../../utils/fetchData";
export const TestAction={
    GET_PASSED_TESTS_COUNT:"GET_PASSED_TESTS_COUNT",
    TRIAL_TESTS:"TRIAL_TESTS",
    TEST_TYPE_EDETAILS:"TEST_TYP_EDETAILS"
};
export const PassedTestCountAction=(localDrivingLicenseID)=>async(dispatch)=>{
    try{
        const response=await getDataAPI(`Tests/PassedTestsCount/${localDrivingLicenseID}`);
        dispatch({
            type:TestAction.GET_PASSED_TESTS_COUNT,
            payload:response.data
        });

    }
    catch(error){
        dispatch({
            type:ALERT,
            payload:error
        });

    }
}
export const TrialTestsAction=(localDrivingLicenseID,testTypeID)=>async(dispatch)=>{
    try{
        const response=await getDataAPI(`Tests/TrialCount?localDrivingLicenseApplicationID=${localDrivingLicenseID}&testTypeID=${testTypeID}`);
        dispatch({
            type:TestAction.TRIAL_TESTS,
            payload:response.data
        });

    }
    catch(error){
        dispatch({
            type:ALERT,
            payload:error
        });

    }

}
export const GetTestTypeByIdAction=(TestTypeID)=>async(dispatch)=>{
    try{
        const response=await getDataAPI(`TestType/one/${TestTypeID}`);
        dispatch({
            type:TestAction.TEST_TYPE_EDETAILS,
            payload:response.data
        });
    }
    catch(error){
        dispatch({
            type:ALERT,
            payload:error
        });

    }
}