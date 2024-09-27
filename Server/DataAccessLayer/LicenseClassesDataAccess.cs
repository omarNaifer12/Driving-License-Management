using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Server.DataAccessLayer
{
    public class LicenseClassesDTO{
           public int LicenseClassID { set; get; }
          public string ClassName { set; get; }
        public string ClassDescription { set; get; }
        public byte MinimumAllowedAge { set; get; }
        public byte DefaultValidityLength { set; get; }
        public float ClassFees { set; get; }
      
        public LicenseClassesDTO(int LicenseClassID, string ClassName,
            string ClassDescription,
            byte MinimumAllowedAge, byte DefaultValidityLength, float ClassFees)
        {
            this.LicenseClassID = LicenseClassID;
            this.ClassName = ClassName;
            this.ClassDescription = ClassDescription;
            this.MinimumAllowedAge = MinimumAllowedAge;
            this.DefaultValidityLength = DefaultValidityLength;
            this.ClassFees = ClassFees;
            
        }
    }
    public class LicenseClassesDataAccess
    {
         public static List<LicenseClassesDTO> GetAllLicenseClasses()
            {

                var licenseClasses=new List<LicenseClassesDTO>();
                using SqlConnection connection = new (DataAccessSettings.ConnectionString);

                string query = "SELECT * FROM LicenseClasses order by ClassName";

                using SqlCommand command = new SqlCommand(query, connection);

                try
                {
                    connection.Open();

                    using SqlDataReader reader = command.ExecuteReader();

                    while(reader.Read()){
                        licenseClasses.Add(new  LicenseClassesDTO(
                            (int)reader["LicenseClassID"],
                             (string)reader["ClassName"],
                         (string)reader["ClassDescription"],
                        (byte)reader["MinimumAllowedAge"],
                        (byte) reader["DefaultValidityLength"],
                        Convert.ToSingle(reader["ClassFees"])

                        ));

                    }

                }

                catch (Exception ex)
                {
                    Console.WriteLine("Error: " + ex.Message);
                }
                return licenseClasses;
              

            }
             public static LicenseClassesDTO? GetLicenseClassByID(int LicenseClassID)
            {
                

                using SqlConnection connection = new (DataAccessSettings.ConnectionString);

                string query = "SELECT * FROM LicenseClasses WHERE LicenseClassID = @LicenseClassID";

                using SqlCommand command = new (query, connection);

                command.Parameters.AddWithValue("@LicenseClassID", LicenseClassID);

                try
                {
                    connection.Open();
                    using SqlDataReader reader = command.ExecuteReader();

                    if (reader.Read())
                    {
                       return new LicenseClassesDTO(
                        (int)reader["LicenseClassID"],
                             (string)reader["ClassName"],
                         (string)reader["ClassDescription"],
                        (byte)reader["MinimumAllowedAge"],
                        (byte) reader["DefaultValidityLength"],
                        Convert.ToSingle(reader["ClassFees"])
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
                    Console.WriteLine("Error: " + ex.Message);
                    return null;
                }
            
            }
    }
}