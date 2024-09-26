using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Server.BusinessLayer;
using Server.DataAccessLayer;

namespace Server.ApiControllerLayer
{
    [ApiController]
    [Route("api/LicenseClasses")]
    public class LicenseClassesControllerApi : ControllerBase
    {
           [HttpGet("All", Name ="GetAllLicenseClasses")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IEnumerable<LicenseClassesDTO>>GetAllLicenseClasses()
        {
            
            try{
            var licenseClasses = LicenseClassesBusiness.GetAllLicenseClasses();
            if(licenseClasses.Count==0)
            {
                return NotFound("no license classes found");
            }
            return Ok(licenseClasses);
        
            }
            catch(Exception ex){
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");


            }

        }
    }
}