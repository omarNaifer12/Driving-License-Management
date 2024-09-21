using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Server.DataAccessLayer;
using Server.BusinessLayer;

namespace Server.ApiControllerLayer
{
    [ApiController]
    [Route("api/countries")]
    
    public class CountriesControllerApi : ControllerBase
    {
        [HttpGet("All", Name ="GetAllCountries")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IEnumerable<CountryDTO>>GetAllCountries()
        {
            
            try{
            var countries = CountriesBusiness.GetAllCountry();
            if(countries.Count==0)
            {
                return NotFound("no country found");
            }
            return Ok(countries);
        
            }
            catch(Exception ex){
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");


            }

        }
    }
}