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
public class dtoViewDriver
{
    public int DriverID { get; set; }
    public int PersonID { get; set; }
    public string NationalNo { get; set; }
    public string FullName { get; set; }
    public DateTime CreatedDate { get; set; }
    public int NumberOfActiveLicenses { get; set; }

    // Constructor
    public dtoViewDriver(int driverID, int personID, string nationalNo, string fullName, DateTime createdDate, int numberOfActiveLicenses)
    {
        DriverID = driverID;
        PersonID = personID;
        NationalNo = nationalNo;
        FullName = fullName;
        CreatedDate = createdDate;
        NumberOfActiveLicenses = numberOfActiveLicenses;
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
public static List<dtoViewDriver> GetAllDrivers()
{
 var drivers = new List<dtoViewDriver>();
    using SqlConnection connection = new (DataAccessSettings.ConnectionString);

    string query = "SELECT DriverID, PersonID, NationalNo, FullName, CreatedDate, NumberOfActiveLicenses FROM Drivers_View ORDER BY FullName";

    using SqlCommand command = new (query, connection);

    try
    {
        connection.Open();
        using SqlDataReader reader = command.ExecuteReader();

       
        
            while (reader.Read())
            {
              
                dtoViewDriver driver = new (
        (int)reader["DriverID"],              // DriverID
        (int)reader["PersonID"],              // PersonID
        (string)reader["NationalNo"],     // NationalNo
        (string)reader["FullName"],        // FullName
        (DateTime)reader["CreatedDate"],      // CreatedDate
        (int)reader["NumberOfActiveLicenses"] // NumberOfActiveLicenses
    );

    drivers.Add(driver);
            }
        

     
    }
    catch (Exception ex)
    {
        
        Console.WriteLine("Error: " + ex.Message);
    }
    

    return drivers;
           }
    }
}