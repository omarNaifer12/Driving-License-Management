using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SqlClient;
namespace Server.DataAccessLayer
{
    public class ApplicationTypeDTO
    {
        public int ApplicationTypeID { get; set; }
        public string ApplicationTypeTitle { get; set; }
        public float ApplicationFees { get; set; }
        public ApplicationTypeDTO(int applicationTypeID, string applicationTypeTitle,float applicationFees)
        {
            this.ApplicationTypeID = applicationTypeID;
            this.ApplicationTypeTitle = applicationTypeTitle;
            this.ApplicationFees = applicationFees;
        }

    }
    public class ApplicationTypeDataAccess
    {
          public static ApplicationTypeDTO? GetApplicationTypeInfoByID(int ApplicationTypeID)
            {

                

                using SqlConnection connection = new (DataAccessSettings.ConnectionString);

                string query = "SELECT * FROM ApplicationTypes WHERE ApplicationTypeID = @ApplicationTypeID";

                using SqlCommand command = new (query, connection);

                command.Parameters.AddWithValue("@ApplicationTypeID", ApplicationTypeID);

                try
                {
                    connection.Open();
                    using SqlDataReader reader = command.ExecuteReader();

                    if (reader.Read())
                    {

                       return new  ApplicationTypeDTO(ApplicationTypeID, (string)reader["ApplicationTypeTitle"],
                         Convert.ToSingle( reader["ApplicationFees"]));
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
       
    }
}