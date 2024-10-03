using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Server.DataAccessLayer
{
     public class DriverDTO
{
    public int DriverID { get; }
    public int PersonID { get; }
    public int CreatedByUserID { get; }
    public DateTime CreatedDate { get; }

    // Constructor to initialize the properties
    public DriverDTO(int driverID, int personID, int createdByUserID, DateTime createdDate)
    {
        DriverID = driverID;
        PersonID = personID;
        CreatedByUserID = createdByUserID;
        CreatedDate = createdDate;
    }
}

    public class DriverDataAccess
    {
          public static DriverDTO? GetDriverInfoByDriverID(int DriverID)
{
    DriverDTO? driver = null;

    string query = "SELECT * FROM Drivers WHERE DriverID = @DriverID";

    using (SqlConnection connection = new (DataAccessSettings.ConnectionString))
    using (SqlCommand command = new (query, connection))
    {
        command.Parameters.AddWithValue("@DriverID", DriverID);

        try
        {
            connection.Open();
            using SqlDataReader reader = command.ExecuteReader();
            
                if (reader.Read())
                {
                    driver = new DriverDTO(
                        (int)reader["DriverID"],
                        (int)reader["PersonID"],
                        (int)reader["CreatedByUserID"],
                        (DateTime)reader["CreatedDate"]
                    );
                }
            
        }
        catch (Exception ex)
        {
            // Log error if necessary
            Console.WriteLine("Error: "+ ex.Message);
        }
    }

    return driver;
}
public static DriverDTO? GetDriverInfoByPersonID(int PersonID)
{
    DriverDTO? driver = null;

    string query = "SELECT * FROM Drivers WHERE PersonID = @PersonID";

    using SqlConnection connection = new (DataAccessSettings.ConnectionString);
    using SqlCommand command = new (query, connection);
    
        command.Parameters.AddWithValue("@PersonID", PersonID);

        try
        {
            connection.Open();
            using SqlDataReader reader = command.ExecuteReader();
            
                if (reader.Read())
                {
                    driver = new DriverDTO(
                        (int)reader["DriverID"],
                        (int)reader["PersonID"],
                        (int)reader["CreatedByUserID"],
                        (DateTime)reader["CreatedDate"]
                    );
                }
            
        }
        catch (Exception ex)
        {
            // Log error if necessary
            Console.WriteLine("Error: "+ ex.Message);
        }
    

    return driver;
}
public static int AddNewDriver(DriverDTO driver)
{
    int DriverID = -1;

    string query = @"INSERT INTO Drivers (PersonID, CreatedByUserID, CreatedDate)
                    VALUES (@PersonID, @CreatedByUserID, @CreatedDate);
                    SELECT SCOPE_IDENTITY();";

    using SqlConnection connection = new (DataAccessSettings.ConnectionString);
    using SqlCommand command = new (query, connection);
    
        command.Parameters.AddWithValue("@PersonID", driver.PersonID);
        command.Parameters.AddWithValue("@CreatedByUserID", driver.CreatedByUserID);
        command.Parameters.AddWithValue("@CreatedDate", DateTime.Now);

        try
        {
            connection.Open();
            object result = command.ExecuteScalar();

            if (result != null && int.TryParse(result.ToString(), out int insertedID))
            {
                DriverID = insertedID;
            }
        }
        catch (Exception ex)
        {
            // Log error if necessary
            Console.WriteLine("Error: "+ ex.Message);
        }
    

    return DriverID;
}

public static bool UpdateDriver(DriverDTO driver)
{
    int rowsAffected = 0;

    string query = @"UPDATE Drivers 
                    SET PersonID = @PersonID, CreatedByUserID = @CreatedByUserID 
                    WHERE DriverID = @DriverID";

    using SqlConnection connection = new (DataAccessSettings.ConnectionString);
    using SqlCommand command = new (query, connection);
    
        command.Parameters.AddWithValue("@DriverID", driver.DriverID);
        command.Parameters.AddWithValue("@PersonID", driver.PersonID);
        command.Parameters.AddWithValue("@CreatedByUserID", driver.CreatedByUserID);

        try
        {
            connection.Open();
            rowsAffected = command.ExecuteNonQuery();
        }
        catch (Exception ex)
        {
            // Log error if necessary
            Console.WriteLine("Error: "+ ex.Message);
        }
    

    return rowsAffected > 0;
}
    }
}