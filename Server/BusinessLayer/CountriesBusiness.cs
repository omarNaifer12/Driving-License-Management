using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.DataAccessLayer;

namespace Server.BusinessLayer
{
    public class CountriesBusiness
    {
        public static List<CountryDTO> GetAllCountry()
        {
            return CountriesDataAccess.GetAllCountry();
        }
    }
}