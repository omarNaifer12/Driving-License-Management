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
    [Route("api/LocalDrivingLicenses")]
    public class LocalDrivingLicenseControllerApi : ControllerBase
    {
         [HttpGet("All", Name ="GetAllLocalDrivingLicenses")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IEnumerable<LocalDrivingLicenseViewDTO>>GetAllLocalDrivingLicenses()
        {
            Console.WriteLine("reach all LocalDrivingLicenseViewDTO");
        try{
             List<LocalDrivingLicenseViewDTO> allLocalDrivingLicenses= LocalDrivingLicenseBusiness.GetAllLocalDrivingLicense();
            
           
            if(allLocalDrivingLicenses.Count==0)
            {
                return NotFound("no data found");
            }
            return Ok(allLocalDrivingLicenses);
        }
          catch(Exception ex)
        {
            Console.WriteLine(ex.Message);
         return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");

        }
        }
         [HttpGet("one/{id:int}", Name ="GetLocalDrivingLicenseByID")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<object>GetLocalDrivingLicenseByID(int id)
        {
            LocalDrivingLicenseBusiness? localDrivingLicense=LocalDrivingLicenseBusiness.FindLocalDrivingApplicationByID(id);
          try{
          if(localDrivingLicense==null){
            return NotFound("the data not found error your id");
          }
            
           ApplicationDto applicationDto=localDrivingLicense.ApplicationBusinessDTO;
            var OtherDetails = new
        {
            CreatedByUserName = localDrivingLicense.CreatedByUserInfo?.UserName,
            LicenseClassID = localDrivingLicense.LicenseClassID,
            localDrivingLicenseID=id,
            PersonFullName=localDrivingLicense.PersonFullName,
            LicenseClassName=localDrivingLicense.LicensClassInfo?.ClassName,
            ApplicationTypeName=localDrivingLicense.ApplicationTypeInfo?.ApplicationTypeTitle
        };

        // Returning a combined result with both `applicationDto` and `OtherDetails`
        return Ok(new { applicationDto, OtherDetails });
          }
          catch(Exception ex)
          {
            Console.WriteLine(ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");

          }
        }
          [HttpPost("Add", Name ="AddLocalDrivingLicense")] 
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<object>AddLocalDrivingLicense(ApplicationDto applicationDto,int licenseClassID=0)
        {
               

            Console.WriteLine("reach before try add save");
           try
            {
                if (applicationDto == null||licenseClassID==0)
                {
                    return BadRequest("Invalid  data");
                }
                LocalDrivingLicenseBusiness localDrivingLicenseBusiness=new(-1,-1,applicationDto.ApplicantPersonID,DateTime.Now,
                1,1,DateTime.Now,applicationDto.PaidFees,applicationDto.CreatedByUserID,licenseClassID);
                
                Console.WriteLine("reach before add save");
                if (localDrivingLicenseBusiness.Save())
                {
                    Console.WriteLine("reach in  save");
                    
                    var localDrivingLicenseData=new{
                        LocalDrivingLicenseApplicationID=localDrivingLicenseBusiness.LocalDrivingLicenseApplicationID,
                        LicenseClassID=licenseClassID,
                    };
                    applicationDto.ApplicationID=localDrivingLicenseBusiness.ApplicationID;
                    return CreatedAtRoute("GetLocalDrivingLicenseByID",new {id = localDrivingLicenseBusiness.
                    LocalDrivingLicenseApplicationID}, new{applicationDto,localDrivingLicenseData} );
                }
                else
                {
                    return BadRequest("Failed to add");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "An error occurred while adding the person.");
            }
        }
        [HttpPut("Update/{id:int}", Name ="UpdateLocalDrivingLicense")] 
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<object>UpdateLocalDrivingLicense(ApplicationDto applicationDto,int licenseClassID,int id)
        {
            Console.WriteLine("reach before try update  save ");
           try
            {
                if (applicationDto == null||licenseClassID<=0||id<=0)
                {
                   return BadRequest("Invalid  data");
                }
                LocalDrivingLicenseBusiness? localDrivingLicenseBusiness=LocalDrivingLicenseBusiness.FindLocalDrivingApplicationByID(id);
                
                if(localDrivingLicenseBusiness==null)
                {
                    return NotFound("the id not found or error ");
                }
                localDrivingLicenseBusiness.ApplicantPersonID = applicationDto.ApplicantPersonID;
                localDrivingLicenseBusiness.ApplicationDate = applicationDto.ApplicationDate;
                localDrivingLicenseBusiness.ApplicationID = applicationDto.ApplicationID;
                localDrivingLicenseBusiness.ApplicationStatus=(ApplicationBusiness.EnApplicationStatus)applicationDto.ApplicationStatus;
                localDrivingLicenseBusiness.ApplicationTypeID=applicationDto.ApplicationTypeID;
                localDrivingLicenseBusiness.LicenseClassID=licenseClassID;
                localDrivingLicenseBusiness.CreatedByUserID=applicationDto.CreatedByUserID;
                localDrivingLicenseBusiness.PaidFees=applicationDto.PaidFees;
                localDrivingLicenseBusiness.LastStatusDate=applicationDto.LastStatusDate; 
                Console.WriteLine("reach before update save");
                if (localDrivingLicenseBusiness.Save())
                {
                    Console.WriteLine("reach in  save");
                    
                    var localDrivingLicenseData=new{
                        LocalDrivingLicenseApplicationID=localDrivingLicenseBusiness.LocalDrivingLicenseApplicationID,
                        LicenseClassID=licenseClassID,
                    };
                    
                    return CreatedAtRoute("GetLocalDrivingLicenseByID",new {id = localDrivingLicenseBusiness.
                    LocalDrivingLicenseApplicationID}, new{localDrivingLicenseBusiness.ApplicationBusinessDTO,localDrivingLicenseData} );
                }
                else
                {
                    return BadRequest("Failed to update ");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "An error occurred while adding the person.");
            }
        }
        [HttpGet("checkPersonHaveSameLDL", Name ="IsPersonHaveTheSameLocalDrivingLicense")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        
        public ActionResult IsPersonHaveTheSameLocalDrivingLicense(int ApplicationTypeID,int ApplicantPersonID,int 
        LicenseClassID)
        {
            try{
            int result=LocalDrivingLicenseBusiness.IsPersonHaveTheSameLocalDrivingLicense(ApplicationTypeID,
            ApplicantPersonID,LicenseClassID);
            if (result==-1)
        {
            return Ok(new { message ="No matching license found",success = true,id=result });
        }
        else
        {
            return Ok(new { message = "License found", success = false,id=result });
        }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }
         [HttpPost("IssueLocalDrivingLicense", Name ="IssueLocalDrivingLicenseFirstTime")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult IssueLocalDrivingLicenseFirstTime(int createdByUserID,int LocalDrivingLicenseApplicationID
        ,[FromBody]string Note)
        {
           try{
            LocalDrivingLicenseBusiness? localDrivingLicenseBusiness=LocalDrivingLicenseBusiness.FindLocalDrivingApplicationByID(LocalDrivingLicenseApplicationID);
            if(localDrivingLicenseBusiness==null)
            {
                return NotFound("the id is not found ");
            }
            int result=localDrivingLicenseBusiness.IssueLocalDrivingLicenseFirstTime(createdByUserID,Note);
            if(result!=-1)
            {
                return Ok(result);
            }
            else{
                return  BadRequest("an error to create new licese");
            }
           }
           catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }

        }
                 [HttpDelete("Delete/{id:int}", Name = "DeleteLocalDrivingLicenseController")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult DeleteLocalDrivingLicenseController(int id)
        {
            try
            {
                LocalDrivingLicenseBusiness? localDrivingLicenseBusiness=LocalDrivingLicenseBusiness.FindLocalDrivingApplicationByID(id);
                if (localDrivingLicenseBusiness==null)
                {
                    return NotFound("user not found for the provided ID");
                }
                localDrivingLicenseBusiness.DeleteLocalDrivingLicense();
                return Ok($"user with {id} deleted");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the user.");
            }
        }
    }
}