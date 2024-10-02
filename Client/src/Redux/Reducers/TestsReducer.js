import { PassedTestCount, TestAction } from "../Actions/TestsAction";

const initialState={
    PassedTestsCount:-1,
    TestTrials:-1,
    TestType:{
         TestTypeID :"",
          TestTypeTitle:"",
          TestTypeDescription :"",
          TestTypeFees :""
    },

};
const TestReducer=(state=initialState,action)=>{
    switch(action.type){
        case TestAction.GET_PASSED_TESTS_COUNT:
            return {
               ...state,PassedTestsCount:action.payload
            };
         case TestAction.TRIAL_TESTS:
            return{
                ...state,TestTrials:action.payload
            };
         case TestAction.TEST_TYPE_EDETAILS:
            return{
                ...state,TestType:action.payload
            }      

            default:
                return state;
    }
} 
export default TestReducer