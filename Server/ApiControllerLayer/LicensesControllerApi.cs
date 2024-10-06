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
    [Route("api/Licenses")]
    public class LicensesControllerApi : ControllerBase
    {
        [HttpGet("ActiveLicensePerson/{LocalDrivingLicenseID:int}", Name ="GetActiveLicenseIdForPersonsff")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult  GetActiveLicenseIdForPersonsff(int LocalDrivingLicenseID)
        {
             try{
              LocalDrivingLicenseBusiness? localDrivinglice=LocalDrivingLicenseBusiness.FindLocalDrivingApplicationByID(LocalDrivingLicenseID);
              if(localDrivinglice==null){
                return NotFound("no local driving license found");
              }
            int result=LicenseBusiness.GetActiveLicenseIdForPerson(localDrivinglice.ApplicantPersonID,localDrivinglice.LicenseClassID);
            if(result==-1)
            {
                return NotFound("no active license for this person");
            }
            return Ok(result);
             }
         catch(Exception ex)
            {
                  Console.WriteLine(ex.Message);
                  return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");

            }

        }
        [HttpGet("one/{id:int}",Name="GetOneLicenseByID")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<object>GetOneLicenseByID(int id)
        {
        
          try{
             LicenseBusiness? license=LicenseBusiness.GetLicenseByID(id);
          if(license==null){
            return NotFound("the license not found error your id");
          }
          PersonDTO person=license.DriverInfo.personInfo.PersonBusinessDTO;
            var OtherDetails=new {
               FullName= person.FirstName+person.SecondName+person.ThirdName+person.LastName,
               NationalNo=person.NationalNo, 
               DateOfBirth = person.DateOfBirth,
               Gendor = person.Gendor,
               ClassName= license.licenseClassInfo.ClassName,
               ImagePath = person.ImagePath
            };
           LicenseDTO licenseDTO=license.ToDTO();
            return Ok(new {licenseDTO,OtherDetails});
          }
          catch(Exception ex)
          {
            Console.WriteLine(ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
          }
        }
    }
}