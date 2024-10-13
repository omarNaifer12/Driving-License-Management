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
    [Route("api/Drivers")]
    public class DriversControllerApi : ControllerBase
    {
          [HttpGet("GetAllDrivers")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult<List<dtoViewDriver>> GetAllDriversController()
    {
        try
        {
            List<dtoViewDriver> drivers = DriverBusiness.GetDriversList();

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