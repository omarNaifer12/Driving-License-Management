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
        public ActionResult GetActiveLicenseIdForPersonsff(int LocalDrivingLicenseID)
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
              PersonID=person.PersonID,
               FullName= person.FirstName+person.SecondName+person.ThirdName+person.LastName,
               NationalNo=person.NationalNo, 
               DateOfBirth = person.DateOfBirth,
               Gendor = person.Gendor,
               ClassName= license.licenseClassInfo.ClassName,
               ClassFees=license.licenseClassInfo.ClassFees,
               DefaultValidityLength=license.licenseClassInfo.DefaultValidityLength,
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
         [HttpGet("Decativate/{id:int}",Name="DeactivateLicense")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]

        public ActionResult<object>DeactivateLicense(int id)
        {
        
          try{
             LicenseBusiness? license=LicenseBusiness.GetLicenseByID(id);
          if(license==null){
            return NotFound("the license not found error your id");
          }
       bool result= LicenseBusiness.DeactivateLicense(id);
            if(result){
              return Ok("deactivate success");
            }else{
              return BadRequest("error bad request for deactivate");
            }
          }
          catch(Exception ex)
          {
            Console.WriteLine(ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
          }
        }
         [HttpPost("Change",Name="ChangeLicense")] 
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        
        public ActionResult ChangeLicenseAndDeactivateTheOld(int existLicenseID,int createdBy,string Note,int ApplicationTypeID,byte IssueReason)
        {
          try{
             LicenseBusiness? Oldlicense=LicenseBusiness.GetLicenseByID(existLicenseID);
          if(Oldlicense==null){
            return NotFound("the license not found error your id");
          }
          ApplicationTypeBusiness? applicationTypeBusiness=ApplicationTypeBusiness.GetApplicationTypeInfoByID(ApplicationTypeID);
          int PersonID=Oldlicense.DriverInfo.PersonID;
          ApplicationBusiness applicationBusiness=new(0,PersonID,DateTime.Now,ApplicationTypeID,3,DateTime.Now,applicationTypeBusiness.ApplicationFees,createdBy);
       applicationBusiness.Save();
       LicenseBusiness newLicense=new(new LicenseDTO(0,applicationBusiness.ApplicationID,Oldlicense.DriverID,Oldlicense.LicenseClass
       ,DateTime.Now,DateTime.Now.AddYears(Oldlicense.licenseClassInfo.DefaultValidityLength),Note,applicationTypeBusiness.ApplicationFees+
       Oldlicense.licenseClassInfo.ClassFees,true,IssueReason,createdBy));  
            if(newLicense.Save()){
              LicenseBusiness.DeactivateLicense(existLicenseID);
               return Ok( newLicense.ToDTO());
            }else{
              return BadRequest("error bad request for new chnaged license");
            }
          }
          catch(Exception ex)
          {
            Console.WriteLine(ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
          }
        }
    }
}