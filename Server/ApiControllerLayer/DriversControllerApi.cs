using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Server.BusinessLayer;
using Server.DataAccessLayer;
using Microsoft.Extensions.Caching.Memory;
namespace Server.ApiControllerLayer
{
    [ApiController]
    [Route("api/Drivers")]
    public class DriversControllerApi : ControllerBase
    {
         private readonly IMemoryCache _cache;

        public DriversControllerApi(IMemoryCache cache)
        {
            _cache = cache;
        }
          [HttpGet("GetAllDrivers")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult<List<dtoViewDriver>> GetAllDriversController()
    {
         
        try
        {
            
            var drivers = DriverBusiness.GetDriversList();

            if (drivers == null || drivers.Count == 0)
            {
                return NotFound("No drivers found.");
            }
            return Ok(drivers);
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving data from the database: {ex.Message}");
        }
    }
    }
}