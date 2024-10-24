using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.DataAccessLayer;
using System.Data.SqlClient;
using System.Data;

namespace Server.DataAccessLayer
{
    public class PersonDTO
    {
        public int PersonID { set; get; }
        public string FirstName { set; get; }
        public string SecondName { set; get; }
        public string ThirdName { set; get; }
        public string LastName { set; get; }
        public string NationalNo { set; get; }
        public DateTime DateOfBirth { set; get; }
        public short Gendor { set; get; }
        public string Address { set; get; }
        public string Phone { set; get; }
        public string Email { set; get; }
        public int NationalityCountryID { set; get; }
        
        public string GendorCaption {set; get; }

        public string CountryName {set; get; }

        public string ImagePath {set; get; }

       
         public PersonDTO(int PersonID, string FirstName,string SecondName, string ThirdName,
            string LastName,string NationalNo, DateTime DateOfBirth,short Gendor,
             string Address, string Phone, string Email,
            int NationalityCountryID, string ImagePath,string CountryName,string GendorCaption)

        {
            this.PersonID = PersonID;
            this.FirstName = FirstName;
            this.SecondName= SecondName;
            this.ThirdName = ThirdName;
            this.LastName = LastName;
            this.NationalNo = NationalNo;   
            this.DateOfBirth = DateOfBirth;
            this.Gendor= Gendor;
            this.Address = Address;
            this.Phone = Phone;
            this.Email = Email;
            this.NationalityCountryID = NationalityCountryID;
            this.ImagePath = ImagePath;
            this.CountryName = CountryName;
            this.GendorCaption = GendorCaption;
          
        }

    }
    public class PersonsDataAccess
    {
        public static List<PersonDTO>GetAllPeople()
        {
            var peopleList = new List<PersonDTO>();

        using    SqlConnection connection = new (DataAccessSettings.ConnectionString);
            string sql= @"SELECT People.PersonID, People.NationalNo,
              People.FirstName, People.SecondName, People.ThirdName, People.LastName,
			  People.DateOfBirth, People.Gendor,  
				  CASE
                  WHEN People.Gendor = 0 THEN 'Male'

                  ELSE 'Female'

                  END as GendorCaption ,
			  People.Address, People.Phone, People.Email, 
              People.NationalityCountryID, Countries.CountryName, People.ImagePath
              FROM  People INNER JOIN
                         Countries ON People.NationalityCountryID = Countries.CountryID
                ORDER BY People.FirstName";
              using  SqlCommand command = new (sql, connection);
                try{


                    connection.Open();
                  using  SqlDataReader reader= command.ExecuteReader();
                    while(reader.Read())
                    {
                    peopleList.Add(new PersonDTO(
                    (int)reader["PersonID"],
                    (string)reader["FirstName"],
                    (string)reader["SecondName"],
                    reader["ThirdName"] != DBNull.Value?(string)reader["ThirdName"]:"",
                    (string)reader["LastName"],
                    (string)reader["NationalNo"],

                    (DateTime)reader["DateOfBirth"],
                     -1,
                    (string)reader["Address"],
                    (string)reader["Phone"],

                    //Email: allows null in database so we should handle null
                    reader["Email"] != DBNull.Value?(string)reader["Email"]:"",
                    -1,
                    //ImagePath: allows null in database so we should handle null
                    reader["ImagePath"] != DBNull.Value?(string)reader["ImagePath"]:"",
                    (string)reader["CountryName"],
                    (string)reader["GendorCaption"]
                
                    ));
                    }
                    
                    
                }
                catch(Exception ex){
                    Console.WriteLine(ex.Message);
                    
                }
              
                return peopleList;
        }
    
        public static PersonDTO? GetOnePersonByID( int PersonID)
        {
            string query = @"SELECT People.PersonID, People.NationalNo,
              People.FirstName, People.SecondName, People.ThirdName, People.LastName,
			  People.DateOfBirth, People.Gendor,  
				  CASE
                  WHEN People.Gendor = 0 THEN 'Male'

                  ELSE 'Female'

                  END as GendorCaption ,
			  People.Address, People.Phone, People.Email, 
              People.NationalityCountryID, Countries.CountryName, People.ImagePath
              FROM  People INNER JOIN
                         Countries ON People.NationalityCountryID = Countries.CountryID  WHERE PersonID = @PersonID";
            using SqlConnection connection=new (DataAccessSettings.ConnectionString);
         
            using SqlCommand command = new (query, connection);
             
            command.Parameters.AddWithValue("@PersonID", PersonID);
           
            try
            {
                connection.Open();
              using  SqlDataReader reader = command.ExecuteReader();
              
                if (reader.Read())
                {
                    
                   return new PersonDTO( (int)reader["PersonID"],
                    (string)reader["FirstName"],
                    (string)reader["SecondName"],
                    reader["ThirdName"] != DBNull.Value?(string)reader["ThirdName"]:"",
                    (string)reader["LastName"],
                    (string)reader["NationalNo"],

                    (DateTime)reader["DateOfBirth"],
                    (byte)reader["Gendor"],
                    (string)reader["Address"],
                    (string)reader["Phone"],
                    reader["Email"] != DBNull.Value?(string)reader["Email"]:"",
                    (int)reader["NationalityCountryID"],
                    reader["ImagePath"] != DBNull.Value?(string)reader["ImagePath"]:"",
                    (string)reader["CountryName"],
                    (string)reader["GendorCaption"]);
                
                }
            else{
                return null;
            }
              
            
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
                return null;
                
            }
             }
               public static int AddPerson(PersonDTO Person)
        {
           
            int PersonID = -1;

            SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"INSERT INTO People (FirstName, SecondName, ThirdName,LastName,NationalNo,
                                                   DateOfBirth,Gendor,Address,Phone, Email, NationalityCountryID,ImagePath)
                             VALUES (@FirstName, @SecondName,@ThirdName, @LastName, @NationalNo,
                                     @DateOfBirth,@Gendor,@Address,@Phone, @Email,@NationalityCountryID,@ImagePath);
                             SELECT SCOPE_IDENTITY();";

            SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("@FirstName", Person.FirstName);
            command.Parameters.AddWithValue("@SecondName", Person.SecondName);
           
            if (Person.ThirdName != "" && Person.ThirdName != null)
                command.Parameters.AddWithValue("@ThirdName", Person.ThirdName);
            else
                command.Parameters.AddWithValue("@ThirdName", DBNull.Value);

            command.Parameters.AddWithValue("@LastName",Person.LastName);
            command.Parameters.AddWithValue("@NationalNo", Person.NationalNo);
            command.Parameters.AddWithValue("@DateOfBirth", Person.DateOfBirth);
            command.Parameters.AddWithValue("@Gendor", Person.Gendor);
            command.Parameters.AddWithValue("@Address", Person.Address);
            command.Parameters.AddWithValue("@Phone", Person.Phone);
            
            if (Person.Email != "" && Person.Email != null)
                command.Parameters.AddWithValue("@Email", Person.Email);
            else
                command.Parameters.AddWithValue("@Email", DBNull.Value);

            command.Parameters.AddWithValue("@NationalityCountryID", Person.NationalityCountryID);

            if (Person.ImagePath != "" && Person.ImagePath != null)
                command.Parameters.AddWithValue("@ImagePath", Person.ImagePath);
            else
                command.Parameters.AddWithValue("@ImagePath", DBNull.Value);

            try
            {
                connection.Open();

                var result = command.ExecuteScalar();

                if (result != null && int.TryParse(result.ToString(), out int insertedID))
                {
                    PersonID = insertedID;
                }
            }

            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);

            }

            return PersonID;
        }  
              public static bool UpdatePerson(PersonDTO Person)
        {
           
          
           int rowsAffected = 0;
           using  SqlConnection connection = new (DataAccessSettings.ConnectionString);

                       string query = @"Update  People  
                            set FirstName = @FirstName,
                                SecondName = @SecondName,
                                ThirdName = @ThirdName,
                                LastName = @LastName, 
                                NationalNo = @NationalNo,
                                DateOfBirth = @DateOfBirth,
                                Gendor=@Gendor,
                                Address = @Address,  
                                Phone = @Phone,
                                Email = @Email, 
                                NationalityCountryID = @NationalityCountryID,
                                ImagePath =@ImagePath
                                where PersonID = @PersonID";

        using SqlCommand command = new (query, connection);
            command.Parameters.AddWithValue("@PersonID", Person.PersonID);

            command.Parameters.AddWithValue("@FirstName", Person.FirstName);
            command.Parameters.AddWithValue("@SecondName", Person.SecondName);
           
            if (Person.ThirdName != "" && Person.ThirdName != null)
                command.Parameters.AddWithValue("@ThirdName", Person.ThirdName);
            else
                command.Parameters.AddWithValue("@ThirdName", DBNull.Value);

            command.Parameters.AddWithValue("@LastName",Person.LastName);
            command.Parameters.AddWithValue("@NationalNo", Person.NationalNo);
            command.Parameters.AddWithValue("@DateOfBirth", Person.DateOfBirth);
            command.Parameters.AddWithValue("@Gendor", Person.Gendor);
            command.Parameters.AddWithValue("@Address", Person.Address);
            command.Parameters.AddWithValue("@Phone", Person.Phone);
            
            if (Person.Email != "" && Person.Email != null)
                command.Parameters.AddWithValue("@Email", Person.Email);
            else
                command.Parameters.AddWithValue("@Email", DBNull.Value);

            command.Parameters.AddWithValue("@NationalityCountryID", Person.NationalityCountryID);

            if (Person.ImagePath != "" && Person.ImagePath != null)
                command.Parameters.AddWithValue("@ImagePath", Person.ImagePath);
            else
                command.Parameters.AddWithValue("@ImagePath", DBNull.Value);

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

            return rowsAffected>0;
        }
        public static bool DeletePerson(int PersonID)
        {

            int rowsAffected;

            using  SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"Delete People 
                                where PersonID = @PersonID";

          using  SqlCommand command = new (query, connection);

            command.Parameters.AddWithValue("@PersonID", PersonID);

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
        public static List<PersonDTO> GetPaginatedPeople(int pageNumber,int rowPerPage)
        {
             var peopleList = new List<PersonDTO>();

   
    using SqlConnection connection = new (DataAccessSettings.ConnectionString);

    
    using SqlCommand command = new ("[dbo].[SP_GetAllPaginationPeople]", connection);
   command.CommandType =CommandType.StoredProcedure;

    
    command.Parameters.AddWithValue("@PageNumber", pageNumber);
    command.Parameters.AddWithValue("@RowPerPage", rowPerPage);

    try
    {
        connection.Open();
        
    
        using SqlDataReader reader = command.ExecuteReader();
        while (reader.Read())
        {
          
            peopleList.Add(new PersonDTO(
                (int)reader["PersonID"],
                (string)reader["FirstName"],
                (string)reader["SecondName"],
                reader["ThirdName"] != DBNull.Value ? (string)reader["ThirdName"] : "",
                (string)reader["LastName"],
                (string)reader["NationalNo"],
                (DateTime)reader["DateOfBirth"],
                -1,  
                (string)reader["Address"],
                (string)reader["Phone"],
                reader["Email"] != DBNull.Value ? (string)reader["Email"] : "",
                -1,
                reader["ImagePath"] != DBNull.Value ? (string)reader["ImagePath"] : "",
                (string)reader["CountryName"],
                (string)reader["GendorCaption"]
            ));
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
    }

    return peopleList;
        }
        public static int GetCountPeople()
        {
            int count=0;
  SqlConnection connection = new (DataAccessSettings.ConnectionString);

            string query = @"Select COUNT(*) From People AS count";

            SqlCommand command = new (query, connection);

          

            try
            {
                connection.Open();

                var result = command.ExecuteScalar();

                if (result != null && int.TryParse(result.ToString(), out int insertedID))
                {
                    count=insertedID;
                }
            }

            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);

            }

            return count;
        }    
        }

    }
