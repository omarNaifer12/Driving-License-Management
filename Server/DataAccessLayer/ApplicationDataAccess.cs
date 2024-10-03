using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Server.DataAccessLayer
{
    public class ApplicationDto{
        
        public int ApplicationID { set; get; }
        public int ApplicantPersonID { set; get; }
         public DateTime ApplicationDate { set; get; }
        public int ApplicationTypeID { set; get; }
        public byte ApplicationStatus { set; get; } 
        public DateTime LastStatusDate { set; get; }
        public float PaidFees { set; get; }
        public int CreatedByUserID { set; get; }
         public ApplicationDto(int ApplicationID, int ApplicantPersonID, 
            DateTime ApplicationDate, int ApplicationTypeID,
             byte ApplicationStatus, DateTime LastStatusDate,
             float PaidFees, int CreatedByUserID)
        {
            this.ApplicationID = ApplicationID;
            this.ApplicantPersonID = ApplicantPersonID;
            this.ApplicationDate = ApplicationDate;
            this.ApplicationTypeID = ApplicationTypeID;
            this.ApplicationStatus = ApplicationStatus;
            this.LastStatusDate = LastStatusDate;
            this.PaidFees = PaidFees;
            this.CreatedByUserID = CreatedByUserID;
            
        }
        

    }
    public class ApplicationDataAccess
    {
        public static int AddNewApplication(ApplicationDto application)
        {
            int ApplicationID = -1;

            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"INSERT INTO Applications ( 
                            ApplicantPersonID,ApplicationDate,ApplicationTypeID,
                            ApplicationStatus,LastStatusDate,
                            PaidFees,CreatedByUserID)
                             VALUES (@ApplicantPersonID,@ApplicationDate,@ApplicationTypeID,
                                      @ApplicationStatus,@LastStatusDate,
                                      @PaidFees, @CreatedByUserID);
                             SELECT SCOPE_IDENTITY();";
            using SqlCommand command = new (query, connection);
            command.Parameters.AddWithValue("@ApplicantPersonID", application.ApplicantPersonID);
            command.Parameters.AddWithValue("@ApplicationDate", application.ApplicationDate);
            command.Parameters.AddWithValue("@ApplicationTypeID", application.ApplicationTypeID);
            command.Parameters.AddWithValue("@ApplicationStatus", application.ApplicationStatus);
            command.Parameters.AddWithValue("@LastStatusDate", application.LastStatusDate);
            command.Parameters.AddWithValue("@PaidFees", application.PaidFees);
            command.Parameters.AddWithValue("@CreatedByUserID",application.CreatedByUserID);
            try
            {
                connection.Open();

                object result = command.ExecuteScalar();

                if (result != null && int.TryParse(result.ToString(), out int insertedID))
                {
                    ApplicationID = insertedID;
                }
            }

            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);

            }

            
            return ApplicationID;
        }
        public static bool UpdateApplication(int ApplicationID, ApplicationDto application)
        {
            int rowsAffected = 0;
            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"Update  Applications  
                            set ApplicantPersonID = @ApplicantPersonID,
                                ApplicationDate = @ApplicationDate,
                                ApplicationTypeID = @ApplicationTypeID,
                                ApplicationStatus = @ApplicationStatus, 
                                LastStatusDate = @LastStatusDate,
                                PaidFees=@PaidFees,
                                CreatedByUserID=@CreatedByUserID
                            where ApplicationID=@ApplicationID";

            using SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("@ApplicationID", ApplicationID);
            command.Parameters.AddWithValue("ApplicantPersonID", application.ApplicantPersonID);
            command.Parameters.AddWithValue("ApplicationDate", application.ApplicationDate);
            command.Parameters.AddWithValue("ApplicationTypeID", application.ApplicationTypeID);
            command.Parameters.AddWithValue("ApplicationStatus", application.ApplicationStatus);
            command.Parameters.AddWithValue("LastStatusDate", application.LastStatusDate);
            command.Parameters.AddWithValue("PaidFees", application.PaidFees);
            command.Parameters.AddWithValue("CreatedByUserID",application.CreatedByUserID);
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
        public static ApplicationDto? GetApplicationByID(int ApplicationID)
        {
             
                using SqlConnection connection = new (DataAccessSettings.ConnectionString);
                string query = "SELECT * FROM Applications WHERE ApplicationID = @ApplicationID";
                using SqlCommand command = new (query, connection);
                command.Parameters.AddWithValue("@ApplicationID",ApplicationID);
                try
                {
                    connection.Open();
                    SqlDataReader reader = command.ExecuteReader();

                    if (reader.Read())
                    { 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                      return new ApplicationDto(
                       (int)reader["ApplicantPersonID"],
                       (int)reader["ApplicationTypeID"],
                       (DateTime) reader["ApplicationDate"],
                       (int)reader["ApplicationTypeID"],
                       (byte)reader["ApplicationStatus"],
                       (DateTime)reader["LastStatusDate"],
                       Convert.ToSingle(reader["PaidFees"]),
                       (int)reader["CreatedByUserID"]
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
         public static bool UpdateStatus(int ApplicationID, short NewStatus)

        { int rowsAffected = 0;
            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"Update  Applications  
                            set 
                                ApplicationStatus = @NewStatus, 
                                LastStatusDate = @LastStatusDate
            where ApplicationID=@ApplicationID;";           
            using SqlCommand command = new (query, connection);
            command.Parameters.AddWithValue("@ApplicationID", ApplicationID);
            command.Parameters.AddWithValue("@NewStatus", NewStatus);
            command.Parameters.AddWithValue("LastStatusDate", DateTime.Now);
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