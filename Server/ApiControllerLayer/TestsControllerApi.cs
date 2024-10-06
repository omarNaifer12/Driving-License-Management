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
    [Route("api/Tests")]
    public class TestsControllerApi : ControllerBase
    {
         
        [HttpGet("one/{testID:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<TestsDTO> GetTestByID(int testID)
        {
            try
            {
                var test = TestsDataAccess.GetTestByID(testID); 
                if (test == null)
                {
                    return NotFound($"No test found with ID {testID}.");
                }
                return Ok(test);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving the test.");
            }
        }

        
        [HttpPost("Add")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult CreateTest([FromBody] TestsDTO testsDto)
        {
            try
            {
                var newTest = new TestsBusiness(testsDto, TestsBusiness.EnMode.AddNew);
Console.WriteLine("reach add test ");
                if (newTest.Save())
                {
                    return CreatedAtAction(nameof(GetTestByID), new { testID = newTest.TestID }, newTest.TestsBusinessDTO);
                }
                else
                {
                    return BadRequest("Unable to create the test.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the test.");
            }
        }

       
        [HttpPut("Update/{testID:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult UpdateTest(int testID, [FromBody] TestsDTO testsDto)
        {
            try
            {
                var existingTest = TestsDataAccess.GetTestByID(testID); 
                if (existingTest == null)
                {
                    return NotFound($"No test found with ID {testID}.");
                }

                var updatedTest = new TestsBusiness(testsDto, TestsBusiness.EnMode.Update);
                if (updatedTest.Save())
                {
                    return Ok(updatedTest.TestsBusinessDTO);
                }
                else
                {
                    return BadRequest("Unable to update the test.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the test.");
            }
        }


        [HttpGet("PassedTestsCount/{localDrivingLicenseApplicationID:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<byte> GetPassedTestCount(int localDrivingLicenseApplicationID)
        {
            try
            {
                byte passedCount = TestsBusiness.GetPassedTestCount(localDrivingLicenseApplicationID);
                return Ok(passedCount);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while counting passed tests.");
            }
        }

        
        [HttpGet("AllPassedTests/{localDrivingLicenseApplicationID:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<bool> CheckAllTestsPassed(int localDrivingLicenseApplicationID)
        {
            try
            {
                bool allPassed = TestsBusiness.PassedAllTests(localDrivingLicenseApplicationID);
                return Ok(allPassed);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while checking if all tests are passed.");
            }
        }

        
        [HttpGet("TestCompleted")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<bool> IsTestCompleted(int localDrivingLicenseApplicationID, int testTypeID)
        {
            try
            {
                bool isCompleted = TestsBusiness.IsTestCompleted(localDrivingLicenseApplicationID, testTypeID);
                return Ok(isCompleted);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while checking if the test is completed.");
            }
        }


        [HttpGet("TrialCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<byte> CountTrialTests(int localDrivingLicenseApplicationID, int testTypeID)
        {
            try
            {
                byte trialCount = TestsBusiness.CountTrialTestsForTestType(localDrivingLicenseApplicationID, testTypeID);
                return Ok(trialCount);
            }
            catch (Exception ex)
            {
                
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while counting trial tests.");
            }
        }
        [HttpGet("GetByTestAppointmentID/{TestAppointmentID:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<TestAppointmentsDTO> GetTestByTestAppointmentByID(int TestAppointmentID)
        {
            try
            {
                var test = TestsBusiness.GetTestByTestAppointmentID(TestAppointmentID);

                if (test == null)
                {
                    return NotFound($"No test  found with ID {TestAppointmentID}.");
                }
                return Ok(test.TestsBusinessDTO);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving the test appointment.");
            }
        }
    }
}