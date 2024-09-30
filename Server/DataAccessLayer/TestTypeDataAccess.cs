using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Server.DataAccessLayer
{
     public class TestTypeDTO{
         public int  TestTypeID { set; get; }
        public string TestTypeTitle { set; get; }
        public string TestTypeDescription { set; get; } 
        public float TestTypeFees { set; get; }
   
        public TestTypeDTO(int  TestTypeID, string TestTypeTitle,string TestTypeDescription,float TestTypeFees)

        {
            this.TestTypeID = TestTypeID;
            this.TestTypeTitle = TestTypeTitle;
            this.TestTypeDescription = TestTypeDescription;

            this.TestTypeFees = TestTypeFees;
           
        }
    }
    public class TestTypeDataAccess
    {
         public static TestTypeDTO? GetTestTypeInfoByID(int TestTypeID)
            {
                

                using SqlConnection connection = new (DataAccessSettings.ConnectionString);

                string query = "SELECT * FROM TestTypes WHERE TestTypeID = @TestTypeID";

                SqlCommand command = new (query, connection);

                command.Parameters.AddWithValue("@TestTypeID", TestTypeID);

                try
                {
                    connection.Open();
                    using SqlDataReader reader = command.ExecuteReader();

                    if (reader.Read())
                    {

                       return new TestTypeDTO(
                        TestTypeID,
                         (string)reader["TestTypeTitle"],
                        (string)reader["TestTypeDescription"],
                        Convert.ToSingle( reader["TestTypeFees"])
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
                  
                }
                return null;
              
            }

         public static List<TestTypeDTO> GetAllTestTypes()
            {

               var allData=new List<TestTypeDTO>();
                using SqlConnection connection = new (DataAccessSettings.ConnectionString);

                string query = "SELECT * FROM TestTypes order by TestTypeID";

                using SqlCommand command = new SqlCommand(query, connection);

                try
                {
                    connection.Open();

                    using SqlDataReader reader = command.ExecuteReader();
                   while (reader.Read())
                    {

                       allData.Add( new TestTypeDTO(
                        (int) reader["TestTypeID"],
                         (string)reader["TestTypeTitle"],
                        (string)reader["TestTypeDescription"],
                        Convert.ToSingle( reader["TestTypeFees"])
                       ));

                }


                }

                catch (Exception ex)
                {
                    Console.WriteLine("Error: " + ex.Message);
                }
               

                return allData;
            }
        
    }
}