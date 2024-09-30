using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.DataAccessLayer;

namespace Server.BusinessLayer
{
    public class TestAppointmentsBusiness
    {
         public int TestAppointmentID { get; set; }
        public int TestTypeID { get; set; }
        public int LocalDrivingLicenseApplicationID { get; set; }
        public DateTime AppointmentDate { get; set; }
        public float PaidFees { get; set; }
        public int CreatedByUserID { get; set; }
        public bool IsLocked { get; set; }
        public int RetakeTestApplicationID { get; set; }
        public enum EnMode2 {AddNew=0,Update=1}
        public EnMode2 Mode=EnMode2.AddNew;

        public TestAppointmentsBusiness(TestAppointmentsDTO testAppointments,EnMode2 mode=EnMode2.AddNew)
        {
            TestAppointmentID = testAppointments.TestAppointmentID;
            TestTypeID = testAppointments.TestTypeID;
            LocalDrivingLicenseApplicationID = testAppointments.LocalDrivingLicenseApplicationID;
            AppointmentDate = testAppointments.AppointmentDate;
            PaidFees = testAppointments.PaidFees;
            CreatedByUserID = testAppointments.CreatedByUserID;
            IsLocked = testAppointments.IsLocked;
            RetakeTestApplicationID = testAppointments.RetakeTestApplicationID;
            Mode = mode;
        }

        public TestAppointmentsDTO ToDTO()
        {
            return new TestAppointmentsDTO(TestAppointmentID, TestTypeID, LocalDrivingLicenseApplicationID, 
            AppointmentDate, PaidFees, CreatedByUserID, IsLocked, RetakeTestApplicationID);
        }

        private bool _AddNewTestAppointment()
        {
            this.TestAppointmentID = TestAppointmentsDataAccess.AddNewTestAppointment(this.ToDTO());
            return this.TestAppointmentID != -1;
        }

        private bool _UpdateTestAppointment()
        {
            return TestAppointmentsDataAccess.UpdateTestAppointment(this.ToDTO());
        }
           public bool Save()
        {
            switch (Mode)
            {
                case EnMode2.AddNew:
                    if (_AddNewTestAppointment())
                    {

                        Mode = EnMode2.Update;
                        return true;
                    }
                    else
                    {
                        return false;
                    }

                case EnMode2.Update:

                    return _UpdateTestAppointment();

            }

            return false;
        }

        public static List<TestAppointmentsDTO> GetTestAppointmentsForTestType(int testTypeID, int localDrivingLicenseApplicationID)
        {
            return TestAppointmentsDataAccess.GetTestAppointmentsForTestTypeByLocalDrivingLicenseID(testTypeID, localDrivingLicenseApplicationID);
            

           
        }

        public static bool IsThereAnActiveScheduledTest(int localDrivingLicenseApplicationID, int testTypeID)
        {
            return TestAppointmentsDataAccess.IsThereAnActiveSheduledTest(localDrivingLicenseApplicationID, testTypeID);
        }

        public static TestAppointmentsBusiness? GetTestAppointmentByID(int TestAppointmentID)
        {
          
            TestAppointmentsDTO? testAppointments=TestAppointmentsDataAccess.GetTestAppointmentInfoByID(TestAppointmentID);

            if (testAppointments!=null)

                return new TestAppointmentsBusiness(testAppointments,EnMode2.Update);
            else 
                return null;

        }
    }
}