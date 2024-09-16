using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Server.DataAccessLayer
{
    public class UsersDataAccess
    {
        public static bool DeleteUsersOfPerson(int PersonID)
        {
            
            int rowsAffected;
            using   SqlConnection connection=new (DataAccessSettings.ConnectionString);
            string query=@"Delete users 
                                where PersonID = @PersonID";

            using  SqlCommand command = new (query, connection);
            command.Parameters.AddWithValue("@PersonID",PersonID);
            try{
                connection.Open();
                rowsAffected=command.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;

            }
            return rowsAffected>0;
        }
    }
}