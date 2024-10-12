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
                 PersonDTO person=license.DriverInfo.personInfo.PersonBusinessDTO;
               var OtherDetails=new {
              PersonID=person.PersonID,
              
               NationalNo=person.NationalNo, 
               DateOfBirth = person.DateOfBirth,
               Gendor = person.Gendor,
               LicenseID=license.LicenseID,
               ImagePath = person.ImagePath
            };

                return Ok(new {license.INLbusinessDTO,OtherDetails});
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving the international license.");
            }
        }

        // POST: api/InternationalLicense/Add
        [HttpPost("Add",Name ="AddInternationalLicense")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult AddInternationalLicense(int CreatedByUserID,int LicenseID)
        {
            Console.WriteLine("reach add international license");
            try
            {
                LicenseBusiness? licenseBusiness=LicenseBusiness.GetLicenseByID(LicenseID);
               if(licenseBusiness!=null){
                    

                
                var newLicense = new InterNationalLicenseBusiness(
                    -1,
                    licenseBusiness.DriverInfo.PersonID,
                    DateTime.Now,  
                    ApplicationBusiness.EnApplicationStatus.Completed, 
                    DateTime.Now,  
                    licenseBusiness.licenseClassInfo.ClassFees,  
                    CreatedByUserID,
                    -1,
                    licenseBusiness.DriverID,
                    LicenseID,
                    DateTime.Now,
                    DateTime.Now.AddYears(licenseBusiness.licenseClassInfo.DefaultValidityLength),
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
               else{
                return NotFound("the licenseId not found ");
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
        public ActionResult<int> CheckActiveInternationalLicenseIDByDriverID(int driverID)
        {
            try
            {
                int licenseID = InterNationalLicenseBusiness.GetActiveInternationalLicenseIDByDriverID(driverID);
                if (licenseID == -1)  
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
        public ActionResult<List<InterNationalLicenseDTO>> GetAllInterNationalLicensesOfPerson(int personID)
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