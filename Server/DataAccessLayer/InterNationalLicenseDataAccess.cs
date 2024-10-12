using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
namespace Server.DataAccessLayer
{
    public class InterNationalLicenseDTO{
        public int InternationalLicenseID { set; get; }  
        public int DriverID { set; get; }
        public int IssuedUsingLocalLicenseID { set; get; }   
        public DateTime IssueDate { set; get; }
        public DateTime ExpirationDate { set; get; }    
        public bool IsActive { set; get; }
        public int CreatedByUserID { set; get; }
        public int ApplicationID { set; get; }
        public InterNationalLicenseDTO(int internationalLicenseID, int driverID, int issuedUsingLocalLicenseID,
            DateTime issueDate, DateTime expirationDate, bool isActive, int createdByUserID, int applicationID)
        {
            InternationalLicenseID = internationalLicenseID;
            DriverID = driverID;
            IssuedUsingLocalLicenseID = issuedUsingLocalLicenseID;
            IssueDate = issueDate;
            ExpirationDate = expirationDate;
            IsActive = isActive;
            CreatedByUserID = createdByUserID;
            ApplicationID = applicationID;
        }
    }
    public class InterNationalLicenseDataAccess
    {
        public static List<InterNationalLicenseDTO> GetAllInterNationalLicensesOfPerson(int PersonID)
        { var allLicenses = new List<InterNationalLicenseDTO>();

            string query = @"SELECT l.InternationalLicenseID, l.DriverID, l.IssuedUsingLocalLicenseID, 
                                l.IssueDate, l.ExpirationDate, l.IsActive, l.CreatedByUserID, l.ApplicationID 
                             FROM InternationalLicenses l
                             INNER JOIN Drivers ON l.DriverID = Drivers.DriverID 
                             WHERE Drivers.PersonID = @PersonID";

            using SqlConnection connection = new(DataAccessSettings.ConnectionString);
            using SqlCommand command = new(query, connection);
            command.Parameters.AddWithValue("@PersonID", PersonID);

            try
            {
                connection.Open();
                using SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    allLicenses.Add(new InterNationalLicenseDTO(
                        (int)reader["InternationalLicenseID"],
                        (int)reader["DriverID"],
                        (int)reader["IssuedUsingLocalLicenseID"],
                        (DateTime)reader["IssueDate"],
                        (DateTime)reader["ExpirationDate"],
                        (bool)reader["IsActive"],
                        (int)reader["CreatedByUserID"],
                        (int)reader["ApplicationID"]
                    ));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
            return allLicenses;
        }
        public static int GetActiveInternationalLicenseByDriverID(int DriverID)
        {
            int InternationalLicenseID = -1;

            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"  
                            SELECT Top 1 InternationalLicenseID
                            FROM InternationalLicenses 
                            where DriverID=@DriverID and GetDate() between IssueDate and ExpirationDate 
                            order by ExpirationDate Desc;";

            using SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("@DriverID", DriverID);
          
            try
            {
                connection.Open();

                object result = command.ExecuteScalar();

                if (result != null && int.TryParse(result.ToString(), out int insertedID))
                {
                    InternationalLicenseID = insertedID;
                }
            }

            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);

            }

           


            return InternationalLicenseID;
        }
        public static InterNationalLicenseDTO? GetInternationalLicenseInfoByID(int internationalLicenseID)
    {
               using SqlConnection connection = new(DataAccessSettings.ConnectionString);
    string query = "SELECT * FROM InternationalLicenses WHERE InternationalLicenseID = @InternationalLicenseID";

    using SqlCommand command = new(query, connection);
    command.Parameters.AddWithValue("@InternationalLicenseID", internationalLicenseID);

    try
    {
        connection.Open();
        using SqlDataReader reader = command.ExecuteReader();

        if (reader.Read())
        {
            
            int applicationID = (int)reader["ApplicationID"];
            int driverID = (int)reader["DriverID"];
            int issuedUsingLocalLicenseID = (int)reader["IssuedUsingLocalLicenseID"];
            DateTime issueDate = (DateTime)reader["IssueDate"];
            DateTime expirationDate = (DateTime)reader["ExpirationDate"];
            bool isActive = (bool)reader["IsActive"];
            int createdByUserID = (int)reader["CreatedByUserID"];
            return new InterNationalLicenseDTO(
                internationalLicenseID,
                driverID,
                issuedUsingLocalLicenseID,
                issueDate,
                expirationDate,
                isActive,
                createdByUserID,
                applicationID
            );
        }
        else
        {
            
            return null;
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine("Error: " + ex.Message);
        return null;
    }
    
            }
             public static int 
             
             AddNewInternationalLicense( InterNationalLicenseDTO interNationalLicenseDTO)
        {
            int InternationalLicenseID = -1;

            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"
                               Update InternationalLicenses 
                               set IsActive=0
                               where DriverID=@DriverID;

                             INSERT INTO InternationalLicenses
                               (
                                ApplicationID,
                                DriverID,
                                IssuedUsingLocalLicenseID,
                                IssueDate,
                                ExpirationDate,
                                IsActive,
                                CreatedByUserID)
                         VALUES
                               (@ApplicationID,
                                @DriverID,
                                @IssuedUsingLocalLicenseID,
                                @IssueDate,
                                @ExpirationDate,
                                @IsActive,
                                @CreatedByUserID);
                            SELECT SCOPE_IDENTITY();";

            using SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("@ApplicationID", interNationalLicenseDTO.ApplicationID);
            command.Parameters.AddWithValue("@DriverID", interNationalLicenseDTO.DriverID);
            command.Parameters.AddWithValue("@IssuedUsingLocalLicenseID", interNationalLicenseDTO.IssuedUsingLocalLicenseID);
            command.Parameters.AddWithValue("@IssueDate", interNationalLicenseDTO.IssueDate);
            command.Parameters.AddWithValue("@ExpirationDate", interNationalLicenseDTO.ExpirationDate);

            command.Parameters.AddWithValue("@IsActive", interNationalLicenseDTO.IsActive);
            command.Parameters.AddWithValue("@CreatedByUserID", interNationalLicenseDTO.CreatedByUserID);
            try
            {
                connection.Open();

                object result = command.ExecuteScalar();

                if (result != null && int.TryParse(result.ToString(), out int insertedID))
                {
                    InternationalLicenseID = insertedID;
                }
            }

            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);

            }


            return InternationalLicenseID;

        }

        public static bool UpdateInternationalLicense(
              int InternationalLicenseID ,InterNationalLicenseDTO interNationalLicenseDTO)
        {

            int rowsAffected = 0;
            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"UPDATE InternationalLicenses
                           SET 
                              ApplicationID=@ApplicationID,
                              DriverID = @DriverID,
                              IssuedUsingLocalLicenseID = @IssuedUsingLocalLicenseID,
                              IssueDate = @IssueDate,
                              ExpirationDate = @ExpirationDate,
                              IsActive = @IsActive,
                              CreatedByUserID = @CreatedByUserID
                         WHERE InternationalLicenseID=@InternationalLicenseID";

            using SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("@InternationalLicenseID", InternationalLicenseID);
            command.Parameters.AddWithValue("@ApplicationID", interNationalLicenseDTO.ApplicationID);
            command.Parameters.AddWithValue("@DriverID", interNationalLicenseDTO.DriverID);
            command.Parameters.AddWithValue("@IssuedUsingLocalLicenseID", interNationalLicenseDTO.IssuedUsingLocalLicenseID);
            command.Parameters.AddWithValue("@IssueDate", interNationalLicenseDTO.IssueDate);
            command.Parameters.AddWithValue("@ExpirationDate", interNationalLicenseDTO.ExpirationDate);

            command.Parameters.AddWithValue("@IsActive", interNationalLicenseDTO.IsActive);
            command.Parameters.AddWithValue("@CreatedByUserID", interNationalLicenseDTO.CreatedByUserID);
           

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

    }
}