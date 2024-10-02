using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Server.DataAccessLayer
{
    public class TestsDTO{
        
        public int TestID { set; get; }
        public int TestAppointmentID { set; get; }
        public bool TestResult { set; get; }
        public string Notes { set; get; }
        public int CreatedByUserID { set; get; } 
       
        public TestsDTO(int TestID,int TestAppointmentID,
            bool TestResult, string Notes, int CreatedByUserID)

        {
            this.TestID = TestID;
            this.TestAppointmentID = TestAppointmentID;
            this.TestResult = TestResult;
            this.Notes = Notes;
            this.CreatedByUserID = CreatedByUserID;

           
        }
    }
    public class TestsDataAccess
    {
          public static byte GetPassedTestCount(int LocalDrivingLicenseApplicationID)
        {
            byte PassedTestCount = 0;

            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"SELECT PassedTestCount = count(TestTypeID)
                         FROM Tests INNER JOIN
                         TestAppointments ON Tests.TestAppointmentID = TestAppointments.TestAppointmentID
						 where LocalDrivingLicenseApplicationID =@LocalDrivingLicenseApplicationID and TestResult=1";

            using SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("@LocalDrivingLicenseApplicationID", LocalDrivingLicenseApplicationID);


            try
            {
                connection.Open();

                object result = command.ExecuteScalar();

                if (result != null && byte.TryParse(result.ToString(), out byte ptCount))
                {
                    PassedTestCount = ptCount;
                }
            }

            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }

            return PassedTestCount;
        }
        public static bool IsTestCompleted(int LocalDrivingLicenseApplicationID,int TestTypeID)
        {
              bool Result = false;

            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @" SELECT TOP 1 Found=1
                            FROM 
                             Tests INNER JOIN TestAppointments ON Tests.TestAppointmentID = TestAppointments.TestAppointmentID 
                              WHERE
                            LocalDrivingLicenseApplicationID = @LocalDrivingLicenseApplicationID
                            AND TestTypeID = @TestTypeID  AND TestResult=1
                            ORDER BY TestID desc";

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
        public static int AddNewTest( TestsDTO Test)
        {
            int TestID = -1;

            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"Insert Into Tests (TestAppointmentID,TestResult,
                                                Notes,   CreatedByUserID)
                            Values (@TestAppointmentID,@TestResult,
                                                @Notes,   @CreatedByUserID);
                            
                                UPDATE TestAppointments 
                                SET IsLocked=1 where TestAppointmentID = @TestAppointmentID;

                                SELECT SCOPE_IDENTITY();";

            using SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("@TestAppointmentID", Test.TestAppointmentID);
            command.Parameters.AddWithValue("@TestResult", Test.TestResult);

            if (Test.Notes != "" && Test.Notes != null)
                command.Parameters.AddWithValue("@Notes", Test.Notes);
            else
                command.Parameters.AddWithValue("@Notes", System.DBNull.Value);
            command.Parameters.AddWithValue("@CreatedByUserID", Test.CreatedByUserID);

            try
            {
                connection.Open();

                object result = command.ExecuteScalar();

                if (result != null && int.TryParse(result.ToString(), out int insertedID))
                {
                    TestID = insertedID;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);

            }

            return TestID;

        }

        public static bool UpdateTest(TestsDTO Test )
        {

            int rowsAffected = 0;
            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"Update  Tests  
                            set TestAppointmentID = @TestAppointmentID,
                                TestResult=@TestResult,
                                Notes = @Notes,
                                CreatedByUserID=@CreatedByUserID
                                where TestID = @TestID";

            using SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("@TestID", Test.TestID);
            command.Parameters.AddWithValue("@TestAppointmentID", Test.TestAppointmentID);
            command.Parameters.AddWithValue("@TestResult", Test.TestResult);
            command.Parameters.AddWithValue("@Notes", Test.Notes);
            command.Parameters.AddWithValue("@CreatedByUserID", Test.CreatedByUserID);

            try
            {
                connection.Open();
                rowsAffected = command.ExecuteNonQuery();

            }
            catch (Exception ex)
            {
                
                                Console.WriteLine("Error: " + ex.Message);
                return false;
            }

            

            return rowsAffected > 0;
        }
        public static byte CountTrialTestsForTestType(int LocalDrivingLicenseApplicationID,int TestTypeID)
        {
            
          byte TrialTests = 0;

            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query=@"SELECT TrialTests= COUNT(TestID) FROM Tests INNER JOIN TestAppointments 
                          ON Tests.TestAppointmentID = TestAppointments.TestAppointmentID
						 where LocalDrivingLicenseApplicationID =@LocalDrivingLicenseApplicationID 
                         and TestTypeID=@TestTypeID";
            using SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("@LocalDrivingLicenseApplicationID", LocalDrivingLicenseApplicationID);
            command.Parameters.AddWithValue("@TestTypeID", TestTypeID);
            try
            {
                connection.Open();

                object result = command.ExecuteScalar();

                if (result != null && byte.TryParse(result.ToString(), out byte ptCount))
                {
                    TrialTests = ptCount;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
            return TrialTests;
        }
        public static TestsDTO? GetTestByID(int TestID)
{
    using SqlConnection connection = new(DataAccessSettings.ConnectionString);

    string query = "SELECT * FROM Tests WHERE TestID = @TestID";

    using SqlCommand command = new(query, connection);
    command.Parameters.AddWithValue("@TestID", TestID);

    try
    {
        connection.Open();
        using SqlDataReader reader = command.ExecuteReader();

        if (reader.Read())
        {
            return new TestsDTO(
                TestID,
                (int)reader["TestAppointmentID"],
                (bool)reader["TestResult"],
                reader["Notes"] == DBNull.Value ? "" : (string)reader["Notes"],
                (int)reader["CreatedByUserID"]
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
        return null;
    }
}
     public static TestsDTO? GetTestByTestAppointemntID(int TestAppointmentID){
            using SqlConnection connection = new(DataAccessSettings.ConnectionString);

    string query = "SELECT * FROM Tests WHERE TestAppointmentID = @TestAppointmentID";

    using SqlCommand command = new(query, connection);
    command.Parameters.AddWithValue("@TestAppointmentID", TestAppointmentID);

    try
    {
        connection.Open();
        using SqlDataReader reader = command.ExecuteReader();

        if (reader.Read())
        {
            return new TestsDTO(
                (int)reader["TestID"],
                (int)reader["TestAppointmentID"],
                (bool)reader["TestResult"],
                reader["Notes"] == DBNull.Value ? "" : (string)reader["Notes"],
                (int)reader["CreatedByUserID"]
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
        return null;
    }
     }

    }
}