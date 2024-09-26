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
    [Route("api/ApplicationType")]
    public class ApplicationTypeControllerApi : ControllerBase
    {
        [HttpGet("one/{id:int}", Name ="GetAllicationTypeInfo")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult GetAllicationTypeInfo(int id)
        {
             ApplicationTypeBusiness? ApplicationType=ApplicationTypeBusiness.GetApplicationTypeInfoByID(id);
          try{
          if(ApplicationType==null){
            return NotFound("the ApplicationType not found error your id");
          }
            
           ApplicationTypeDTO ApplicationTypeResult=ApplicationType.ApplicationTypeDtoBusiness;
            return Ok(ApplicationTypeResult);
          }
          catch(Exception ex)
          {
            Console.WriteLine(ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");

          }
        }
    }
}