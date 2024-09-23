using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Server.DataAccessLayer;

namespace Server.DataAccessLayer
{
    public class UserDTO
    {
        public int UserID { set; get; }
        public int PersonID { set; get; }
        public string UserName { set; get; }
        public string Password { set; get; }
        public bool IsActive { set; get; }
        public string FullName { set; get; }


        public UserDTO(int UserID, int PersonID, string Username,string Password,
            bool IsActive,string FullName)

        {
            this.UserID = UserID; 
            this.PersonID = PersonID;
            this.UserName = Username;
            this.Password = Password;
            this.IsActive = IsActive;
           this.FullName = FullName;
        }

        
    }
    public class UsersDataAccess
    {
        public static bool DeleteUserOfPerson(int PersonID)

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
        public static List<UserDTO>GetAllUsers()
        {
            var AllUsers=new List<UserDTO>();
            using  SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"SELECT  Users.UserID, Users.PersonID,
                            FullName = People.FirstName + ' ' + People.SecondName + ' ' + ISNULL( People.ThirdName,'') +' ' + People.LastName,
                             Users.UserName, Users.IsActive
                             FROM  Users INNER JOIN
                                    People ON Users.PersonID = People.PersonID";

             using    SqlCommand command = new (query, connection);

            try
            {
                connection.Open();
                using SqlDataReader reader = command.ExecuteReader();
                while(reader.Read())
                {
                    AllUsers.Add(
                     new UserDTO(   (int)reader["UserID"],
                     (int)reader["PersonID"],
                     (string)reader["UserName"],
                     "",
                     (bool)reader["IsActive"],
                     (string)reader["FullName"])
                    );
                }
                
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex);
            }
            return AllUsers;
        }
        public static UserDTO? GetUserByID(int UserID)
        {
             using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = "SELECT * FROM Users WHERE UserID = @UserID";

             using   SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("@UserID", UserID);

            try
            {
                connection.Open();
                using    SqlDataReader reader = command.ExecuteReader();
                if (reader.Read())
                {
                     // The record was found
                     return new UserDTO(
                     UserID,
                     (int)reader["PersonID"],
                     (string)reader["UserName"],
                     (string)reader["Password"],
                     (bool)reader["IsActive"],
                     ""
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
        public static UserDTO? GetUserByUserNameAndPassword(string UserName, string Password)
        {
            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

              string query = "SELECT * FROM Users WHERE Username = @Username and Password=@Password;";
              using  SqlCommand command = new (query, connection);
            command.Parameters.AddWithValue("@Username", UserName);
            command.Parameters.AddWithValue("@Password", Password);

            try
            {
                connection.Open();
                using    SqlDataReader reader = command.ExecuteReader();
                if (reader.Read())
                {
                    // The record was found
                   return new UserDTO(
                     (int)reader["UserID"], 
                     (int)reader["PersonID"],
                     (string)reader["UserName"],
                     (string)reader["Password"],
                     (bool)reader["IsActive"],
                     ""
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
                public static bool DeleteUserByID(int UserID)

        {
            
            int rowsAffected;
            using   SqlConnection connection=new (DataAccessSettings.ConnectionString);
            string query=@"Delete users 
                                where UserID = @UserID";

            using  SqlCommand command = new (query, connection);
            command.Parameters.AddWithValue("@UserID",UserID);
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
        public static int AddUser(UserDTO user)
        {
             int UserID = -1;

            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"INSERT INTO Users (PersonID,UserName,Password,IsActive)
                             VALUES (@PersonID, @UserName,@Password,@IsActive);
                             SELECT SCOPE_IDENTITY();";

           using  SqlCommand command = new SqlCommand(query, connection);

            command.Parameters.AddWithValue("@PersonID", user.PersonID);
            command.Parameters.AddWithValue("@UserName", user.UserName);
            command.Parameters.AddWithValue("@Password", user.Password);
            command.Parameters.AddWithValue("@IsActive", user.IsActive);

        try
        {
            connection.Open();
        
            object result = command.ExecuteScalar();
        
            if (result != null && int.TryParse(result.ToString(), out int insertedID))
            {
                UserID = insertedID;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error: " + ex.Message);
        }
        return UserID;
        }
        public static bool UpdateUser(int userID,UserDTO user)
        {
            int rowsAffected=0;
            
            using SqlConnection connection = new (DataAccessSettings.ConnectionString);
            string query = @"Update  Users  
                            set PersonID = @PersonID,
                                UserName = @UserName,
                                Password = @Password,
                                IsActive = @IsActive
                                where UserID = @UserID";
            using SqlCommand command = new (query, connection);
            command.Parameters.AddWithValue("@PersonID", user.PersonID);
            command.Parameters.AddWithValue("@UserName", user.UserName);
            command.Parameters.AddWithValue("@Password", user.Password);
            command.Parameters.AddWithValue("@IsActive", user.IsActive);
            command.Parameters.AddWithValue("@UserID", userID);
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
        public static bool ChangePassword(int userID,string password)
        {
            int rowsAffected = 0;
            using SqlConnection connection = new (DataAccessSettings.ConnectionString);
            

            string query = @"Update  Users  
                            set Password = @Password
                            where UserID = @UserID";

            using SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("@UserID",userID);
            command.Parameters.AddWithValue("@Password",password);

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
        public static bool IsPersonHaveUserAcc(int PersonID)
        {
            bool isFound = false;

            using SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = "SELECT Found=1 FROM Users WHERE PersonID = @PersonID";

            using SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("@PersonID", PersonID);

            try
            {
                connection.Open();
                using SqlDataReader reader = command.ExecuteReader();

                isFound = reader.HasRows;

                
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

    }

}