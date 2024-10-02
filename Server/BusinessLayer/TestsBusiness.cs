using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.DataAccessLayer;

namespace Server.BusinessLayer
{
    public class TestsBusiness
    {
        public enum EnMode { AddNew = 0, Update = 1 };
        public EnMode Mode = EnMode.AddNew;
        public int TestID { set; get; }
        public int TestAppointmentID { set; get; }
        public TestAppointmentsBusiness? TestAppointmentInfo { set; get; }
        public bool TestResult { set; get; }
        public string Notes { set; get; }
        public int CreatedByUserID { set; get; } 
       public TestsDTO TestsBusinessDTO{
        get{
            return new TestsDTO(this.TestID, this.TestAppointmentID, this.TestResult, this.Notes,this.CreatedByUserID);
        }
       }
        public TestsBusiness(TestsDTO tests,EnMode mode=EnMode.AddNew)
        {
            this.TestID = tests.TestID;
            this.TestAppointmentID = tests.TestAppointmentID;
            this.TestAppointmentInfo = TestAppointmentsBusiness.GetTestAppointmentByID(TestAppointmentID);
            this.TestResult = tests.TestResult;
            this.Notes = tests.Notes;
            this.CreatedByUserID = tests.CreatedByUserID;

            Mode = mode;
        }

        private bool _AddNewTest()
        {
            

            this.TestID = TestsDataAccess.AddNewTest(TestsBusinessDTO);
              

            return (this.TestID != -1);
        }

        private bool _UpdateTest()
        {
            //call DataAccess Layer 

            return TestsDataAccess.UpdateTest(TestsBusinessDTO);
        }
        public bool Save()
        {
            switch (Mode)
            {
                case EnMode.AddNew:
                    if (_AddNewTest())
                    {

                        Mode = EnMode.Update;
                        return true;
                    }
                    else
                    {
                        return false;
                    }

                case EnMode.Update:

                    return _UpdateTest();

            }

            return false;
        }

        public static byte GetPassedTestCount(int LocalDrivingLicenseApplicationID)
        {
            return TestsDataAccess.GetPassedTestCount(LocalDrivingLicenseApplicationID);
        }

        public static bool  PassedAllTests(int LocalDrivingLicenseApplicationID)
        {
            
            return GetPassedTestCount(LocalDrivingLicenseApplicationID) == 3;
        }
        public static byte CountTrialTestsForTestType(int LocalDrivingLicenseApplicationID,int TestTypeID)
        {
            return TestsDataAccess.CountTrialTestsForTestType(LocalDrivingLicenseApplicationID,TestTypeID);

        }
        public static bool IsTestCompleted(int LocalDrivingLicenseApplicationID,int TestTypeID)
        {
            return TestsDataAccess.IsTestCompleted(LocalDrivingLicenseApplicationID,TestTypeID);

        }
        public static TestsBusiness? GetTestByTestAppointmentID(int TestAppointmentID)
        {
            TestsDTO? test=TestsDataAccess.GetTestByTestAppointemntID(TestAppointmentID);
        if(test!=null){
            return new TestsBusiness(test,EnMode.Update);
        }
        return null;
        }
    }
}