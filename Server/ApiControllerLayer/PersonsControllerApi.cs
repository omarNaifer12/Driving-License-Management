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
    [Route("api/Persons")]

    public class PersonsControllerApi : ControllerBase
    {
        [HttpGet("All", Name ="GetAllPeople")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IEnumerable<PersonDTO>>GetAllPeople()
        {
          try{
            List<PersonDTO> allPeople= PersonsBusiness.GetAllPeople();
            
           
            if(allPeople.Count==0)
            {
                return NotFound("no data found");
            }
            return Ok(allPeople);
          }
          catch(Exception ex)
          {
            Console.WriteLine(ex.Message);
         return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");

          }
        }
        [HttpGet("one", Name ="GetOnePerson")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<PersonDTO>GetOnePerson(int id)
        {
            PersonsBusiness? person=PersonsBusiness.GetOnePerson(id);
          try{
          if(person==null){
            return NotFound("the person not found error your id");
          }
            
           PersonDTO personDTO=person.PersonBusinessDTO;
            return Ok(personDTO);
          }
          catch(Exception ex)
          {
            Console.WriteLine(ex.Message);
         return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");

          }
        }
         [HttpGet("Add", Name ="AddPerson")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<PersonDTO>AddPerson(PersonDTO person)
        {
           
           try
            {
                if (person == null)
                {
                    return BadRequest("Invalid person data");
                }

                PersonsBusiness personBusiness = new (person);
                if (personBusiness.Save())
                {
                    return Ok("Person added successfully");
                }
                else
                {
                    return BadRequest("Failed to add the person");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while adding the person.");
            }
        }
          [HttpPut("Update", Name = "UpdatePerson")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult UpdatePerson([FromBody] PersonDTO person)
        {
            try
            {
                PersonsBusiness? existingPersonBusiness = PersonsBusiness.GetOnePerson(person.PersonID);
                if (existingPersonBusiness == null)
                {
                    return NotFound("Person not found for the provided ID");
                }

               
                if (existingPersonBusiness.Save())
                {
                    return Ok("Person updated successfully");
                }
                else
                {
                    return BadRequest("Failed to update the person");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the person.");
            }
        }
                [HttpDelete("Delete/{id:int}", Name = "DeletePerson")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult DeletePerson(int id)
        {
            try
            {
                bool deleted = PersonsBusiness.DeletePerson(id);
                if (deleted)
                {
                    return Ok("Person deleted successfully");
                }
                else
                {
                    return NotFound("Person not found for the provided ID");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the person.");
            }

        }


    }
}