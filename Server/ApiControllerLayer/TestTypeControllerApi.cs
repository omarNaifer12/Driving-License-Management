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
    [Route("api/TestType")]
    public class TestTypeControllerApi : ControllerBase
    {
          [HttpGet("one/{TestTypeID:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<TestTypeDTO> GetTestTypeByID(int TestTypeID)
        {
            try
            {
                var TestType = TestTypeBusiness.GetTestTypeByID(TestTypeID);

                if (TestType == null)
                {
                    return NotFound($"No test appointment found with ID {TestTypeID}.");
                }
                return Ok(TestType.TestTypeBusinessDTO);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving the test appointment.");
            }
        }

    }
}