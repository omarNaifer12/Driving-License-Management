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
    [Route("api/InternationalLicenses")]
    public class InternationalLicenseApiController : ControllerBase
    {
         [HttpGet("one/{internationalLicenseID:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<InterNationalLicenseDTO> GetInternationalLicenseByID(int internationalLicenseID)
        {
            try
            {
                var license = InterNationalLicenseBusiness.Find(internationalLicenseID);

                if (license == null)
                {
                    return NotFound($"No international license found with ID {internationalLicenseID}.");
                }

                return Ok(license.INLbusinessDTO);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving the international license.");
            }
        }

        // POST: api/InternationalLicense/Add
        [HttpPost("Add")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult AddInternationalLicense([FromBody] ApplicationDto applicationDto,int DriverID,int IssuedUsingLocalLicenseID
        ,DateTime ExpirationDate,float fees)
        {
            try
            {
                var newLicense = new InterNationalLicenseBusiness(
                    -1,
                    applicationDto.ApplicantPersonID,
                    DateTime.Now,  
                    ApplicationBusiness.EnApplicationStatus.Completed, 
                    DateTime.Now,  
                    fees,  
                    applicationDto.CreatedByUserID,
                    -1,
                    DriverID,
                    IssuedUsingLocalLicenseID,
                    DateTime.Now,
                    ExpirationDate,
                    true
                );
                if(newLicense.Save())
                {
                  return CreatedAtAction(nameof(GetInternationalLicenseByID), new { internationalLicenseID = newLicense.InternationalLicenseID }, newLicense.INLbusinessDTO);
                }
                else
                {
                    return BadRequest("Unable to create the international license.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the international license.");
            }
        }
         // GET: api/InternationalLicense/active/{driverID}
        [HttpGet("active/{driverID:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<int> GetActiveLicenseIDByDriverID(int driverID)
        {
            try
            {
                int licenseID = InterNationalLicenseBusiness.GetActiveInternationalLicenseIDByDriverID(driverID);
                if (licenseID == -1)  // Assuming -1 means no active license found
                {
                    return NotFound($"No active international license found for Driver ID {driverID}.");
                }
                return Ok(licenseID);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving the active license.");
            }
        }
        // GET: api/InternationalLicense/person/{personID}
        [HttpGet("Licensesperson/{personID:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<List<InterNationalLicenseDTO>> GetAllLicensesByPersonID(int personID)
        {
            try
            {
                var licenses = InterNationalLicenseBusiness.GetAllInterNationalLicensesOfPerson(personID);
                if (licenses == null || licenses.Count == 0)
                {
                    return NotFound($"No international licenses found for Person ID {personID}.");
                }
                return Ok(licenses);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving the licenses.");
            }
        }
    }
}