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
    [Route("api/DetainedLicenses")]
    public class DetainedLicenseApiController : ControllerBase
    {
         
          [HttpGet("ByLicenseID/{LicenseID:int}", Name = "GetDetainedLicenseByLicenseId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<DetainedLicenseBusiness> GetDetainedLicenseByLicenseId(int LicenseID)
        {
            try
            {
                var detainedLicense = DetainedLicenseBusiness.FindByLicenseID(LicenseID);
                if (detainedLicense == null)
                {
                    return NotFound("Detained license not found.");
                }
                return Ok(detainedLicense);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }
          [HttpPost("release")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult ReleaseDetainedLicense(ApplicationDto applicationDto,int detainId)
        {
            
            try
            {
                   var detainedLicense = DetainedLicenseBusiness.Find(detainId);
                if (detainedLicense == null)
                {
                    return NotFound("Detained license not found.");
                }
                var application=new ApplicationBusiness(-1,applicationDto.ApplicantPersonID,DateTime.Now,5,3,DateTime.Now,
            applicationDto.PaidFees,applicationDto.CreatedByUserID);
            if(application.Save()){
             

                if (detainedLicense.ReleaseDetainedLicense(applicationDto.CreatedByUserID
                ,application.ApplicationID))
                {
                        return Ok("Detained license released successfully.");
                }
            }
                return BadRequest("Failed to release detained license.");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }
        [HttpGet("IsDetained/{licenseId:int}", Name = "IsLicenseDetained")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<bool>IsLicenseDetained(int licenseId)
        {
            try
            {
                var isDetained = DetainedLicenseBusiness.IsLicenseDetained(licenseId);
                return Ok(isDetained);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }
          [HttpPost("DetainLicense")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult ReleaseDetainedLicense(int LicenseID,float FineFees,int CreatedByUserID)
        {
            var detainedLicense=new DetainedLicenseBusiness();

            
            try
            {
                 detainedLicense.LicenseID=LicenseID;
                 detainedLicense.FineFees=FineFees;
                 detainedLicense.CreatedByUserID=CreatedByUserID;
                
           
            if(detainedLicense.Save()){ 
                        return CreatedAtAction(nameof(GetDetainedLicenseByDetainId), new { id = detainedLicense.DetainID }, detainedLicense.DetainID);         
            }
                return BadRequest("Failed to release detained license.");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }
        [HttpGet("ByDetainID/{DetainID:int}", Name = "GetDetainedLicenseByDetainId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<DetainedLicenseBusiness> GetDetainedLicenseByDetainId(int DetainID)
        {
            try
            {
                var detainedLicense = DetainedLicenseBusiness.Find(DetainID);
                if (detainedLicense == null)
                {
                    return NotFound("Detained license not found.");
                }
                return Ok(detainedLicense);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }
    }
}