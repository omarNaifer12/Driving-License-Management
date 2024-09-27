using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Server.DataAccessLayer
{
    public class LocalDrivingLicenseViewDTO
    {
        public int LocalDrivingLicenseApplicationID { get; set; }
        public string ClassName { get; set; }
        public string NationalNo { get; set; }
        public string FullName { get; set; }
        public DateTime ApplicationDate { get; set; }
        public int PassedTestCount { get; set; }
        public string Status { get; set; }
         public LocalDrivingLicenseViewDTO(int LocalDrivingLicenseApplicationID,string ClassName,string NationalNo,
        string FullName,DateTime ApplicationDate,int PassedTestCount,string Status)
        {
            this.LocalDrivingLicenseApplicationID=LocalDrivingLicenseApplicationID;
            this.ClassName=ClassName;
            this.NationalNo=NationalNo;
            this.FullName=FullName;
            this.ApplicationDate=ApplicationDate;
            this.PassedTestCount=PassedTestCount;
            this.Status=Status;
        }



    }
  
    public class LocalDrivingLicenseDataAccess
    {
         public static int AddNewLocalDrivingLicenseApplication(
            int ApplicationID, int LicenseClassID )
        {   
            int LocalDrivingLicenseApplicationID = -1;

            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"INSERT INTO LocalDrivingLicenseApplications ( 
                            ApplicationID,LicenseClassID)
                             VALUES (@ApplicationID,@LicenseClassID);
                             SELECT SCOPE_IDENTITY();";

            using SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("ApplicationID", ApplicationID);
            command.Parameters.AddWithValue("LicenseClassID", LicenseClassID);
            
            try
            {
                connection.Open();

                object result = command.ExecuteScalar();

                if (result != null && int.TryParse(result.ToString(), out int insertedID))
                {
                    LocalDrivingLicenseApplicationID = insertedID;
                }
            }

            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);

            }
            return LocalDrivingLicenseApplicationID;
        }
        public static List<LocalDrivingLicenseViewDTO>GetAllLocalDrivingLicenseApplication()
        {
                var allData=new List<LocalDrivingLicenseViewDTO>();
                using SqlConnection connection = new (DataAccessSettings.ConnectionString);

                string query = @"SELECT *
                              FROM LocalDrivingLicenseApplications_View
                            
                              order by ApplicationDate Desc";
                using SqlCommand command = new (query, connection);
                try
                {
                    connection.Open();

                    using SqlDataReader reader = command.ExecuteReader();
                    while(reader.Read())
                    {
                        allData.Add(new LocalDrivingLicenseViewDTO(
                            (int)reader["LocalDrivingLicenseApplicationID"],
                            (string)reader["ClassName"],
                            (string)reader["NationalNo"],
                            (string)reader["FullName"],
                            (DateTime)reader["ApplicationDate"],
                            (int)reader["PassedTestCount"],
                            (string)reader["Status"]
                        ));
                    }
                }
                catch (Exception ex)
                {
                  Console.WriteLine("Error: " + ex.Message);
                }
               return allData;
        }
         public static bool GetLocalDrivingLicenseApplicationInfoByID(
            int LocalDrivingLicenseApplicationID, ref int ApplicationID, 
            ref int LicenseClassID)
            {
                bool isFound = false;

                using SqlConnection connection = new (DataAccessSettings.ConnectionString);


                string query = "SELECT * FROM LocalDrivingLicenseApplications WHERE LocalDrivingLicenseApplicationID = @LocalDrivingLicenseApplicationID";

                using SqlCommand command = new (query, connection);

                command.Parameters.AddWithValue("@LocalDrivingLicenseApplicationID", LocalDrivingLicenseApplicationID);

                try
                {
                    connection.Open();
                    using SqlDataReader reader = command.ExecuteReader();

                    if (reader.Read())
                    {

                        // The record was found
                        isFound = true;

                    ApplicationID = (int)reader["ApplicationID"];
                    LicenseClassID = (int)reader["LicenseClassID"];



                }
                    else
                    {
                        // The record was not found
                        isFound = false;
                    }

                 


                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error: " + ex.Message);
                    isFound = false;
                }
             
                return isFound;
            }
                       public static bool UpdateLocalDrivingLicenseApplication(
            int LocalDrivingLicenseApplicationID, int ApplicationID, int LicenseClassID)
        {

            int rowsAffected = 0;
            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"Update  LocalDrivingLicenseApplications  
                            set ApplicationID = @ApplicationID,
                                LicenseClassID = @LicenseClassID
                            where LocalDrivingLicenseApplicationID=@LocalDrivingLicenseApplicationID";

            using SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("@LocalDrivingLicenseApplicationID", LocalDrivingLicenseApplicationID);
            command.Parameters.AddWithValue("@ApplicationID", ApplicationID);
            command.Parameters.AddWithValue("@LicenseClassID", LicenseClassID);
          

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


        public static bool DeleteLocalDrivingLicenseApplication(int LocalDrivingLicenseApplicationID)
        {

            int rowsAffected = 0;

            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"Delete LocalDrivingLicenseApplications 
                                where LocalDrivingLicenseApplicationID = @LocalDrivingLicenseApplicationID";

            using SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("@LocalDrivingLicenseApplicationID", LocalDrivingLicenseApplicationID);

            try
            {
                connection.Open();

                rowsAffected = command.ExecuteNonQuery();

            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: "+ ex.Message);
            }
           
            return rowsAffected > 0;

        }
    }
}