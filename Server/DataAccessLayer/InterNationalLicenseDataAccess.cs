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
    }
}