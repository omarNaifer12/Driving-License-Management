using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Server.DataAccessLayer
{
    public class LicenseDTO
    {
        public int LicenseID { get; set; }
        public int ApplicationID { get; set; }
        public int DriverID { get; set; }
        public int LicenseClass { get; set; }
        public DateTime IssueDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string Notes { get; set; }
        public float PaidFees { get; set; }
        public bool IsActive { get; set; }
        public byte IssueReason { get; set; }
        public int CreatedByUserID { get; set; }


        public LicenseDTO(int licenseID, int applicationID, int driverID, int licenseClass, DateTime issueDate,
        DateTime expirationDate, string notes, float paidFees, bool isActive, byte issueReason, int createdByUserID)
        {
            LicenseID = licenseID;
            ApplicationID = applicationID;
            DriverID = driverID;
            LicenseClass = licenseClass;
            IssueDate = issueDate;
            ExpirationDate = expirationDate;
            Notes = notes;
            PaidFees = paidFees;
            IsActive = isActive;
            IssueReason = issueReason;
            CreatedByUserID = createdByUserID;
        }
    }
    public class LicensesPersonDTO
{
    public int LicenseID { get; set; }
    public int ApplicationID { get; set; }
    public DateTime IssueDate { get; set; }
    public DateTime ExpirationDate { get; set; }
    public bool IsActive { get; set; }
    public string ClassName { get; set; }

    // Constructor
    public LicensesPersonDTO(int licenseID, int applicationID, DateTime issueDate, DateTime expirationDate, bool isActive, string className)
    {
        LicenseID = licenseID;
        ApplicationID = applicationID;
        IssueDate = issueDate;
        ExpirationDate = expirationDate;
        IsActive = isActive;
        ClassName = className;
    }
}

    public static class LicenseDataAccess
    {
        public static LicenseDTO? GetLicenseByID(int LicenseID)
        {
            LicenseDTO? license = null;

            using SqlConnection connection = new(DataAccessSettings.ConnectionString);
            string query = "SELECT * FROM Licenses WHERE LicenseID = @LicenseID";
            using SqlCommand command = new(query, connection);
            command.Parameters.AddWithValue("@LicenseID", LicenseID);

            try
            {
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                if (reader.Read())
                {
                    license = new LicenseDTO(

                        LicenseID,
                        (int)reader["ApplicationID"],
                         (int)reader["DriverID"],
                        (int)reader["LicenseClass"],
                         (DateTime)reader["IssueDate"],
                         (DateTime)reader["ExpirationDate"],
                        reader["Notes"] == DBNull.Value ? "" : (string)reader["Notes"],
                         Convert.ToSingle(reader["PaidFees"]),
                        (bool)reader["IsActive"],
                         (byte)reader["IssueReason"],
                         (int)reader["CreatedByUserID"]
                    );
                }
                reader.Close();
            }
            catch (Exception ex)
            {
                // Handle the exception (logging, etc.)
                Console.WriteLine("Error: " + ex.Message);
            }


            return license;
        }

        public static int AddNewLicense(LicenseDTO license)
        {
            int newLicenseID = -1;
            using SqlConnection connection = new(DataAccessSettings.ConnectionString);
            string query = @"
                INSERT INTO Licenses 
                (ApplicationID, DriverID, LicenseClass, IssueDate, ExpirationDate, Notes, PaidFees, IsActive, IssueReason, CreatedByUserID) 
                VALUES (@ApplicationID, @DriverID, @LicenseClass, @IssueDate, @ExpirationDate, @Notes, @PaidFees, @IsActive, @IssueReason, @CreatedByUserID);
                SELECT SCOPE_IDENTITY();";

            using SqlCommand command = new(query, connection);
            command.Parameters.AddWithValue("@ApplicationID", license.ApplicationID);
            command.Parameters.AddWithValue("@DriverID", license.DriverID);
            command.Parameters.AddWithValue("@LicenseClass", license.LicenseClass);
            command.Parameters.AddWithValue("@IssueDate", license.IssueDate);
            command.Parameters.AddWithValue("@ExpirationDate", license.ExpirationDate);
            command.Parameters.AddWithValue("@Notes", string.IsNullOrEmpty(license.Notes) ? DBNull.Value : license.Notes);
            command.Parameters.AddWithValue("@PaidFees", license.PaidFees);
            command.Parameters.AddWithValue("@IsActive", license.IsActive);
            command.Parameters.AddWithValue("@IssueReason", license.IssueReason);
            command.Parameters.AddWithValue("@CreatedByUserID", license.CreatedByUserID);

            try
            {
                connection.Open();
                object result = command.ExecuteScalar();
                if (result != null && int.TryParse(result.ToString(), out int insertedID))
                {
                    newLicenseID = insertedID;
                }
            }
            catch (Exception ex)
            {
                // Handle the exception (logging, etc.)
                Console.WriteLine("Error: " + ex.Message);
            }


            return newLicenseID;
        }

        public static bool UpdateLicense(LicenseDTO license)
        {
            bool success = false;

            using SqlConnection connection = new(DataAccessSettings.ConnectionString);
            string query = @"
                UPDATE Licenses 
                SET ApplicationID = @ApplicationID, DriverID = @DriverID, LicenseClass = @LicenseClass, 
                    IssueDate = @IssueDate, ExpirationDate = @ExpirationDate, Notes = @Notes, PaidFees = @PaidFees, 
                    IsActive = @IsActive, IssueReason = @IssueReason, CreatedByUserID = @CreatedByUserID 
                WHERE LicenseID = @LicenseID";

            using SqlCommand command = new(query, connection);
            command.Parameters.AddWithValue("@LicenseID", license.LicenseID);
            command.Parameters.AddWithValue("@ApplicationID", license.ApplicationID);
            command.Parameters.AddWithValue("@DriverID", license.DriverID);
            command.Parameters.AddWithValue("@LicenseClass", license.LicenseClass);
            command.Parameters.AddWithValue("@IssueDate", license.IssueDate);
            command.Parameters.AddWithValue("@ExpirationDate", license.ExpirationDate);
            command.Parameters.AddWithValue("@Notes", string.IsNullOrEmpty(license.Notes) ? DBNull.Value : license.Notes);
            command.Parameters.AddWithValue("@PaidFees", license.PaidFees);
            command.Parameters.AddWithValue("@IsActive", license.IsActive);
            command.Parameters.AddWithValue("@IssueReason", license.IssueReason);
            command.Parameters.AddWithValue("@CreatedByUserID", license.CreatedByUserID);

            try
            {
                connection.Open();
                success = command.ExecuteNonQuery() > 0;
            }
            catch (Exception ex)
            {
                // Handle the exception (logging, etc.)
                Console.WriteLine("Error: " + ex.Message);
            }
            return success;
        }


        public static int GetActiveLicenseIdForPerson(int PersonID, int LicenseClassID)
        {

            int LicenseID = -1;

            using SqlConnection connection = new (DataAccessSettings.ConnectionString);
            string query = @"SELECT LicenseID=l.LicenseID FROM Licenses l  INNER JOIN Drivers d ON l.DriverID=d.DriverID

                WHERE d.PersonID=@PersonID AND l.LicenseClass=@LicenseClassID AND l.IsActive=1";

            using SqlCommand command = new(query, connection);

            command.Parameters.AddWithValue("@PersonID", PersonID);
            command.Parameters.AddWithValue("@LicenseClassID", LicenseClassID);

            try
            {
                connection.Open();

                object result = command.ExecuteScalar();

                if (result != null && int.TryParse(result.ToString(), out int insertedID))
                {
                    LicenseID = insertedID;
                }
            }

            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);

            }
            return LicenseID;

        }
        public static List<LicensesPersonDTO> GetLicensesOfPerson(int PersonID)
        {
            var licensesPersonList = new List<LicensesPersonDTO>();
            using SqlConnection connection = new(DataAccessSettings.ConnectionString);
            string query = @"SELECT  l.LicenseID l.ApplicationID l.IssueDate l.ExpirationDate l.IsActive 
                               c.ClassName FROM Licenses l INNER JOIN LicenseClasses ON l.LicenseClass=c.LicenseClassID
                               INNER JOIN Drivers ON l.DiverID=Drivers.DriverID Where Drivers.PersonID=@PersonID";
            using SqlCommand command = new(query, connection);
            command.Parameters.AddWithValue("@PersonID", PersonID);

            try
            {
                connection.Open();

                using SqlDataReader reader = command.ExecuteReader();
  while (reader.Read()) 
        {
        
            LicensesPersonDTO license = new (
               (int)reader["LicenseID"],
    (int)reader["ApplicationID"],
    (DateTime)reader["IssueDate"],
    (DateTime)reader["ExpirationDate"],
    (bool)reader["IsActive"],
    (string)reader["ClassName"]
            );

            // Add the object to the list
            licensesPersonList.Add(license);
        }
            }

            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
          
          return licensesPersonList;


        }
                public static bool DeactivateLicense(int LicenseID)
        {

            int rowsAffected = 0;
            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"UPDATE Licenses
                           SET 
                              IsActive = 0
                             
                         WHERE LicenseID=@LicenseID";

            using SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("@LicenseID", LicenseID);
         

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

    }
}