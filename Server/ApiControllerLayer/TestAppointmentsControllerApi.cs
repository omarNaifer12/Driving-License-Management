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
    [Route("api/TestAppointments")]
    public class TestAppointmentsControllerApi : ControllerBase
    {
          [HttpGet("TestAppointmentsForTestType")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IEnumerable<TestAppointmentsDTO>> GetTestAppointmentsForTestType(int testTypeID, int localDrivingLicenseApplicationID)
        {
            try
            {
                var testAppointments = TestAppointmentsBusiness.GetTestAppointmentsForTestType(testTypeID, localDrivingLicenseApplicationID);

                if ( testAppointments.Count == 0)
                {
                    return NotFound("No test appointments found for the specified TestType and LicenseApplication.");
                }
                return Ok(testAppointments);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving test appointments.");
            }
        }

        
        [HttpGet("one/{TestAppointmentID:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<TestAppointmentsDTO> GetTestAppointmentByID(int TestAppointmentID)
        {
            try
            {
                var testAppointment = TestAppointmentsBusiness.GetTestAppointmentByID(TestAppointmentID);

                if (testAppointment == null)
                {
                    return NotFound($"No test appointment found with ID {TestAppointmentID}.");
                }
                return Ok(testAppointment.ToDTO());
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving the test appointment.");
            }
        }

        // Add a new test appointment
        [HttpPost("Add")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult CreateTestAppointment([FromBody] TestAppointmentsDTO testAppointmentsDto)
        {
            try
            {
                var newAppointment = new TestAppointmentsBusiness(testAppointmentsDto, TestAppointmentsBusiness.EnMode2.AddNew);

                if (newAppointment.Save())
                {
                    return CreatedAtAction(nameof(GetTestAppointmentByID), new { TestAppointmentID = newAppointment.TestAppointmentID }, newAppointment.ToDTO());
                }
                else
                {
                    return BadRequest("Unable to create the test appointment.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the test appointment.");
            }
        }

        // Update an existing test appointment
        [HttpPut("Update/{TestAppointmentID:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult UpdateTestAppointment(int TestAppointmentID, [FromBody] TestAppointmentsDTO testAppointmentsDto)
        {
            try
            {
                var existingAppointment = TestAppointmentsBusiness.GetTestAppointmentByID(TestAppointmentID);

                if (existingAppointment == null)
                {
                    return NotFound($"No test appointment found with ID {TestAppointmentID}.");
                }

                var updatedAppointment = new TestAppointmentsBusiness(testAppointmentsDto, TestAppointmentsBusiness.EnMode2.Update);
                if (updatedAppointment.Save())
                {
                    return Ok(updatedAppointment.ToDTO());
                }
                else
                {
                    return BadRequest("Unable to update the test appointment.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the test appointment.");
            }
        }
           [HttpGet("ActiveScheduledTest")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<bool> IsThereAnActiveScheduledTest(int localDrivingLicenseApplicationID, int testTypeID)
        {
            try
            {
                bool Result = TestAppointmentsBusiness.IsThereAnActiveScheduledTest(localDrivingLicenseApplicationID, testTypeID);
                return Ok(Result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while checking for active scheduled tests.");
            }
        }
    }
}