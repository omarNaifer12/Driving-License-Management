using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Server.DataAccessLayer;

namespace Server.DataAccessLayer
{
    public class CountryDTO
    {
        public string CountyName { get; set;}
        public int  CountryID { get; set;}
        public CountryDTO(string countyName, int countryID)
        {
            this.CountyName = countyName;
            this.CountryID = countryID;
        }
    }
    public class CountriesDataAccess
    {
        public static List<CountryDTO>GetAllCountry()
        {
            var countryList = new List<CountryDTO>();
            using SqlConnection connection=new (DataAccessSettings.ConnectionString);
            string query=@"SELECT * FROM Countries";
            using SqlCommand command=new (query,connection);
            try{
                connection.Open();
                using SqlDataReader reader=command.ExecuteReader();
                while(reader.Read()){
                    countryList.Add(new CountryDTO(
                        (string)reader["CountryName"],
                        (int)reader["CountryID"]

                    ));
                }
                reader.Close();


            }
            catch (Exception ex){
                Console.WriteLine(ex.Message);
            }
            return countryList;
        }
    }
}