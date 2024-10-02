using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Server.DataAccessLayer
{
    public class TestAppointmentsDTO
    {
        public int TestAppointmentID { set; get; }
        public int  TestTypeID { set; get; }
        public int LocalDrivingLicenseApplicationID { set; get; }
        public DateTime AppointmentDate { set; get; }
        public float PaidFees { set; get; }
        public int CreatedByUserID { set; get; }
        public bool IsLocked { set; get; }
        public int RetakeTestApplicationID { set; get; }
        
      
          public  TestAppointmentsDTO(int TestAppointmentID, int TestTypeID,
           int LocalDrivingLicenseApplicationID, DateTime AppointmentDate, float PaidFees, 
           int CreatedByUserID ,bool IsLocked,int RetakeTestApplicationID)

        {
            this.TestAppointmentID = TestAppointmentID;
            this.TestTypeID = TestTypeID;
            this.LocalDrivingLicenseApplicationID = LocalDrivingLicenseApplicationID;
            this.AppointmentDate = AppointmentDate;
            this.PaidFees = PaidFees;
            this.CreatedByUserID = CreatedByUserID;
            this.IsLocked = IsLocked;
            this.RetakeTestApplicationID=RetakeTestApplicationID;
          
        }


    }
    public class TestAppointmentsDataAccess
    {
        public static List<TestAppointmentsDTO>GetTestAppointmentsForTestTypeByLocalDrivingLicenseID(
            int TestTypeID,int LocalDrivingLicenseApplicationID
        )
        {
            var data=new List<TestAppointmentsDTO>();
             using SqlConnection connection = new (DataAccessSettings.ConnectionString);
            string query = @"SELECT TestAppointmentID, AppointmentDate,PaidFees, IsLocked
                        FROM TestAppointments
                        WHERE  
TestTypeID = @TestTypeID 
AND LocalDrivingLicenseApplicationID = @LocalDrivingLicenseApplicationID
order by TestAppointmentID desc;";
            using SqlCommand command = new (query, connection);
            command.Parameters.AddWithValue("@LocalDrivingLicenseApplicationID", LocalDrivingLicenseApplicationID);
            command.Parameters.AddWithValue("@TestTypeID", TestTypeID);
            try
            {
                connection.Open();
                using SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    Console.WriteLine("reach here get list for apptypes");
                    data.Add(new TestAppointmentsDTO(
                      (int)reader["TestAppointmentID"],
                        -1,
                      -1,
                        (DateTime)reader["AppointmentDate"],
                        Convert.ToSingle( reader["PaidFees"]),
                       -1,
                       
                        (bool)reader["IsLocked"],
                        -1
                    ));
                   
                }
              
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
          

            return data;
        }
         public static int AddNewTestAppointment(TestAppointmentsDTO testAppointment)
        {
        int TestAppointmentID = -1;
        using SqlConnection connection = new (DataAccessSettings.ConnectionString);
        string query = @"Insert Into TestAppointments (TestTypeID,LocalDrivingLicenseApplicationID,AppointmentDate,PaidFees,CreatedByUserID,IsLocked,RetakeTestApplicationID
Values (@TestTypeID,@LocalDrivingLicenseApplicationID,@AppointmentDate,@PaidFees,@CreatedByUserID,0,@RetakeTestApplicationID);
            SELECT SCOPE_IDENTITY();";
            using SqlCommand command = new (query, connection);           
            command.Parameters.AddWithValue("@TestTypeID", testAppointment.TestTypeID);
            command.Parameters.AddWithValue("@LocalDrivingLicenseApplicationID", testAppointment.LocalDrivingLicenseApplicationID);
            command.Parameters.AddWithValue("@AppointmentDate", testAppointment.AppointmentDate);
            command.Parameters.AddWithValue("@PaidFees", testAppointment.PaidFees);
            command.Parameters.AddWithValue("@CreatedByUserID", testAppointment.CreatedByUserID);
            if (testAppointment.RetakeTestApplicationID == -1)
            command.Parameters.AddWithValue("@RetakeTestApplicationID", DBNull.Value);
            else command.Parameters.AddWithValue("@RetakeTestApplicationID", testAppointment.RetakeTestApplicationID);
            try
           {
                connection.Open();
  object result = command.ExecuteScalar();
  if (result != null && int.TryParse(result.ToString(), out int insertedID))
                { 
                   TestAppointmentID = insertedID;
                } 
            }
            catch (Exception ex)
            {
                                Console.WriteLine("Error: " + ex.Message);

            }
          
            return TestAppointmentID;
        }
        public static bool UpdateTestAppointment(TestAppointmentsDTO testAppointment)
        {
            int rowsAffected = 0;
            using SqlConnection connection = new (DataAccessSettings.ConnectionString);
            string query=@"Update  TestAppointments  
set TestTypeID = @TestTypeID,
LocalDrivingLicenseApplicationID = @LocalDrivingLicenseApplicationID,
AppointmentDate = @AppointmentDate,
PaidFees = @PaidFees,
CreatedByUserID = @CreatedByUserID,
IsLocked=@IsLocked,
            RetakeTestApplicationID=@RetakeTestApplicationID
            where TestAppointmentID = @TestAppointmentID";
            using SqlCommand command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@TestAppointmentID", testAppointment.TestAppointmentID);
            command.Parameters.AddWithValue("@TestTypeID", testAppointment.TestTypeID);
            command.Parameters.AddWithValue("@LocalDrivingLicenseApplicationID", testAppointment.LocalDrivingLicenseApplicationID);
            command.Parameters.AddWithValue("@AppointmentDate", testAppointment.AppointmentDate);
            command.Parameters.AddWithValue("@PaidFees", testAppointment.PaidFees);
            command.Parameters.AddWithValue("@CreatedByUserID", testAppointment.CreatedByUserID);
            command.Parameters.AddWithValue("@IsLocked", testAppointment.IsLocked);
            if (testAppointment.RetakeTestApplicationID==-1)
            command.Parameters.AddWithValue("@RetakeTestApplicationID", DBNull.Value);
            else
            command.Parameters.AddWithValue("@RetakeTestApplicationID", testAppointment.RetakeTestApplicationID);
            try
            {connection.Open();
            rowsAffected = command.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                                Console.WriteLine("Error: " + ex.Message);
            return false;
            }
        
            return rowsAffected > 0;
        }
         public static bool IsThereAnActiveSheduledTest(int LocalDrivingLicenseApplicationID, int TestTypeID)
        {

            bool Result = false;

            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @" SELECT top 1 Found=1
                            FROM 
                             TestAppointments WHERE
                            LocalDrivingLicenseApplicationID = @LocalDrivingLicenseApplicationID
                            AND TestTypeID = @TestTypeID  AND isLocked=0
                            ORDER BY TestAppointmentID desc";

            using SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("@LocalDrivingLicenseApplicationID", LocalDrivingLicenseApplicationID);
            command.Parameters.AddWithValue("@TestTypeID", TestTypeID);

            try
            {
                connection.Open();

                object result = command.ExecuteScalar();
             

               if (result != null )
                {
                    Result = true;
                }

            }

            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);

            }


            return Result;

        }
        public static TestAppointmentsDTO? GetTestAppointmentInfoByID(int TestAppointmentID)
            {
                using SqlConnection connection = new (DataAccessSettings.ConnectionString);
                string query = "SELECT * FROM TestAppointments WHERE TestAppointmentID = @TestAppointmentID";
                using SqlCommand command = new (query, connection);
                command.Parameters.AddWithValue("@TestAppointmentID", TestAppointmentID);
                try
                {connection.Open();
                using SqlDataReader reader = command.ExecuteReader();
                if (reader.Read())
                {
return new TestAppointmentsDTO(
    TestAppointmentID,
 (int)reader["TestTypeID"],
  (int)reader["LocalDrivingLicenseApplicationID"],
 (DateTime)reader["AppointmentDate"],
 Convert.ToSingle( reader["PaidFees"]),
  (int)reader["CreatedByUserID"],
  
 (bool)reader["IsLocked"],
 reader["RetakeTestApplicationID"] ==DBNull.Value?-1:(int)reader["RetakeTestApplicationID"]
);
}
                else
{
                        // The record was not found
                        return null;
}
                    
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
               return null;
        }
    }
}