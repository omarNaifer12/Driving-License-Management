using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Server.DataAccessLayer
{
    public class dtoDetainedLicense
{
    public int PersonID { get; set; }
    public string NationalNo { get; set; }
    public string FullName { get; set; }
    public int DetainID { get; set; }
    public int LicenseID { get; set; }
    public DateTime DetainDate { get; set; }
    public decimal FineFees { get; set; }
    public int CreatedByUserID { get; set; }
    public bool IsReleased { get; set; }
    public DateTime? ReleaseDate { get; set; }
    public int ReleasedByUserID { get; set; }
    public int ReleaseApplicationID { get; set; }

    public dtoDetainedLicense(int personID, string nationalNo, string fullName, int detainID, int licenseID, 
                              DateTime detainDate, decimal fineFees, int createdByUserID, bool isReleased, 
                              DateTime? releaseDate, int releasedByUserID, int releaseApplicationID)
    {
        PersonID = personID;
        NationalNo = nationalNo;
        FullName = fullName;
        DetainID = detainID;
        LicenseID = licenseID;
        DetainDate = detainDate;
        FineFees = fineFees;
        CreatedByUserID = createdByUserID;
        IsReleased = isReleased;
        ReleaseDate = releaseDate;
        ReleasedByUserID = releasedByUserID;
        ReleaseApplicationID = releaseApplicationID;
    }
}
    public class DetainedLicenseDataAccess
    {
           public static int AddNewDetainedLicense(
            int LicenseID,  DateTime DetainDate,
            float FineFees,  int CreatedByUserID)
        {
            int DetainID = -1;
            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"INSERT INTO dbo.DetainedLicenses
                               (LicenseID,
                               DetainDate,
                               FineFees,
                               CreatedByUserID,
                               IsReleased
                               )
                            VALUES
                               (@LicenseID,
                               @DetainDate, 
                               @FineFees, 
                               @CreatedByUserID,
                               0
                             );
                            
                            SELECT SCOPE_IDENTITY();";

            using SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("@LicenseID", LicenseID);
            command.Parameters.AddWithValue("@DetainDate", DetainDate);
            command.Parameters.AddWithValue("@FineFees", FineFees);
            command.Parameters.AddWithValue("@CreatedByUserID", CreatedByUserID);
          
            try
            {
                connection.Open();

                object result = command.ExecuteScalar();

                if (result != null && int.TryParse(result.ToString(), out int insertedID))
                {
                    DetainID = insertedID;
                }
            }

            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);

            }

         


            return DetainID;

        }

        public static bool UpdateDetainedLicense(int DetainID, 
            int LicenseID, DateTime DetainDate,
            float FineFees, int CreatedByUserID)
        {

            int rowsAffected = 0;
            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"UPDATE dbo.DetainedLicenses
                              SET LicenseID = @LicenseID, 
                              DetainDate = @DetainDate, 
                              FineFees = @FineFees,
                              CreatedByUserID = @CreatedByUserID,   
                              WHERE DetainID=@DetainID;";

            using SqlCommand command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@DetainedLicenseID", DetainID);
            command.Parameters.AddWithValue("@LicenseID", LicenseID);
            command.Parameters.AddWithValue("@DetainDate", DetainDate);
            command.Parameters.AddWithValue("@FineFees", FineFees);
            command.Parameters.AddWithValue("@CreatedByUserID", CreatedByUserID);
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

            finally
            {
                connection.Close();
            }
            return rowsAffected > 0;
        } 
        public static bool ReleaseDetainedLicense(int DetainID,
                 int ReleasedByUserID, int ReleaseApplicationID)
        {
            int rowsAffected =0;
            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"UPDATE dbo.DetainedLicenses
                              SET IsReleased = 1, 
                              ReleaseDate = @ReleaseDate, 
                              ReleaseApplicationID = @ReleaseApplicationID,
                              ReleasedByUserID=@ReleasedByUserID
                              WHERE DetainID=@DetainID;";

            using SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("@DetainID", DetainID);
            command.Parameters.AddWithValue("@ReleasedByUserID", ReleasedByUserID);
            command.Parameters.AddWithValue("@ReleaseApplicationID", ReleaseApplicationID);
            command.Parameters.AddWithValue("@ReleaseDate", DateTime.Now);
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

        public static bool IsLicenseDetained(int LicenseID)
        {
            bool IsDetained = false;

            using SqlConnection connection = new (DataAccessSettings.ConnectionString);
            string query = @"select IsDetained=1 
                            from detainedLicenses 
                            where 
                            LicenseID=@LicenseID 
                            and IsReleased=0;";

            using SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("@LicenseID", LicenseID);

            try
            {
                connection.Open();

                object result = command.ExecuteScalar();

                if (result != null )
                {
                    IsDetained = Convert.ToBoolean(result);
                }
            }

            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);

            }


            return IsDetained;
            

        }
          public static bool GetDetainedLicenseInfoByID(int DetainID, 
            ref int LicenseID, ref DateTime DetainDate,
            ref float FineFees,ref int CreatedByUserID, 
            ref bool IsReleased, ref DateTime ReleaseDate, 
            ref int ReleasedByUserID,ref int ReleaseApplicationID)
            {
                bool isFound = false;

                using SqlConnection connection = new (DataAccessSettings.ConnectionString);

                string query = "SELECT * FROM DetainedLicenses WHERE DetainID = @DetainID";

                using SqlCommand command = new (query, connection);

                command.Parameters.AddWithValue("@DetainID", DetainID);
                try
                {
                connection.Open();
                    using SqlDataReader reader = command.ExecuteReader();

                               if (reader.Read())
                    {

                        // The record was found
                        isFound = true;

                    LicenseID = (int)reader["LicenseID"];
                    DetainDate = (DateTime)reader["DetainDate"];
                    FineFees = Convert.ToSingle(reader["FineFees"]);
                    CreatedByUserID = (int)reader["CreatedByUserID"];

                    IsReleased = (bool)reader["IsReleased"];

                    if(reader["ReleaseDate"]==DBNull.Value ) 
                   
                        ReleaseDate = DateTime.MaxValue;
                    else
                        ReleaseDate = (DateTime)reader["ReleaseDate"];


                    if (reader["ReleasedByUserID"] == DBNull.Value)
                        ReleasedByUserID = -1;
                    else
                        ReleasedByUserID = (int)reader["ReleasedByUserID"];

                    if (reader["ReleaseApplicationID"] == DBNull.Value)

                        ReleaseApplicationID = -1;
                    else
                        ReleaseApplicationID = (int)reader["ReleaseApplicationID"];

                }
                    else
                    {
                       
                        isFound = false;
                    }
                    reader.Close();
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error: " + ex.Message);
                    isFound = false;
                }
            
                return isFound;
            }
             public static bool GetDetainedLicenseInfoByLicenseID(int LicenseID,
         ref int DetainID, ref DateTime DetainDate,
         ref float FineFees, ref int CreatedByUserID,
         ref bool IsReleased, ref DateTime ReleaseDate,
         ref int ReleasedByUserID, ref int ReleaseApplicationID)
        {
            bool isFound = false;
            
            using SqlConnection connection = new (DataAccessSettings.ConnectionString);
            
            string query = "SELECT top 1 * FROM DetainedLicenses WHERE LicenseID = @LicenseID order by DetainID desc";
            
            using SqlCommand command = new (query, connection);
            
            command.Parameters.AddWithValue("@LicenseID", LicenseID);
            
            try
            {
                connection.Open();
                using SqlDataReader reader = command.ExecuteReader();
                if (reader.Read())
                 {        
                   // The record was found
                    isFound = true;

                    DetainID = (int)reader["DetainID"];
                    DetainDate = (DateTime)reader["DetainDate"];
                    FineFees = Convert.ToSingle(reader["FineFees"]);
                    CreatedByUserID = (int)reader["CreatedByUserID"];

                    IsReleased = (bool)reader["IsReleased"];

                    if (reader["ReleaseDate"] == DBNull.Value)

                        ReleaseDate = DateTime.MaxValue;
                    else 
                        ReleaseDate = (DateTime)reader["ReleaseDate"];
                    if (reader["ReleasedByUserID"] == DBNull.Value)
                        ReleasedByUserID = -1;
                    else
                        ReleasedByUserID = (int)reader["ReleasedByUserID"];

                    if (reader["ReleaseApplicationID"] == DBNull.Value)

                        ReleaseApplicationID = -1;
                    else
                        ReleaseApplicationID = (int)reader["ReleaseApplicationID"];
                   
                }
                else
                {
                   // The record was not found
                   isFound = false;
                }

                reader.Close();


            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
                isFound = false;
            }
            finally
            {
                connection.Close();
            }

            return isFound;
        }
      public static List<dtoDetainedLicense> GetAllDetainedLicenses()
{
    var detainedLicenses = new List<dtoDetainedLicense>();
    string query = @"SELECT p.PersonID, p.NationalNo, FullName = p.FirstName + ' ' + p.SecondName + ' ' +
        CASE 
            WHEN p.ThirdName IS NULL OR p.ThirdName = '' THEN ''
            ELSE p.ThirdName + ' '
        END + p.LastName, dt.DetainID, dt.LicenseID, dt.DetainDate, dt.FineFees, dt.CreatedByUserID, dt.IsReleased, 
        dt.ReleaseDate, dt.ReleasedByUserID, dt.ReleaseApplicationID 
        FROM DetainedLicenses dt 
        INNER JOIN Licenses l ON dt.LicenseID = l.LicenseID 
        INNER JOIN Drivers d ON d.DriverID = l.DriverID 
        INNER JOIN People p ON p.PersonID = d.PersonID;";

    using SqlConnection connection = new (DataAccessSettings.ConnectionString);
    
        using SqlCommand command = new SqlCommand(query, connection);
        
        try
        {
            connection.Open();
            using SqlDataReader reader = command.ExecuteReader();
            
            while (reader.Read())
            {
                dtoDetainedLicense license = new dtoDetainedLicense(
                    (int)reader["PersonID"],
                    (string)reader["NationalNo"],
                    (string)reader["FullName"],
                    (int)reader["DetainID"],
                    (int)reader["LicenseID"],
                    (DateTime)reader["DetainDate"],
                    (decimal)reader["FineFees"],
                    (int)reader["CreatedByUserID"],
                    (bool)reader["IsReleased"],
                    reader.IsDBNull(reader.GetOrdinal("ReleaseDate")) ? (DateTime?)null : (DateTime)reader["ReleaseDate"],
                    (int)reader["ReleasedByUserID"],
                    (int)reader["ReleaseApplicationID"]
                );

                detainedLicenses.Add(license);
            }

           
        }
        catch (Exception ex)
        {
            // Handle or log the error
            Console.WriteLine("Error: " + ex.Message);
        }
    

    return detainedLicenses;
}
    }
}