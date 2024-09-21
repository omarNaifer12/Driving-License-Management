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
            Console.WriteLine("reach all people");
          try{
            var allPeople= PersonsBusiness.GetAllPeople();
            
           
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
        [HttpGet("one/{id:int}", Name ="GetOnePersonByID")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<PersonDTO>GetOnePersonByID(int id)
        {
            PersonsBusiness? person=PersonsBusiness.GetOnePersonByID(id);
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
         [HttpPost("Add", Name ="AddPerson")] 
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<PersonDTO>AddPerson(PersonDTO person)
        {
               
            Console.WriteLine("reach before try add save");
           try
            {
                if (person == null)
                {
                    return BadRequest("Invalid person data");
                }
                
                PersonsBusiness personBusiness = new (person);
                Console.WriteLine("reach before add save");
                if (personBusiness.Save())
                {
                    Console.WriteLine("reach in  save");
                    person.PersonID=personBusiness.PersonID;


                    return CreatedAtRoute("GetOnePersonByID",new {id = person.PersonID}, person );
                }
                else
                {
                    return BadRequest("Failed to add the person");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "An error occurred while adding the person.");
            }
        }
          [HttpPut("Update/{personID:int}", Name = "UpdatePerson")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult UpdatePerson( int PersonID,PersonDTO person)
        {
            try
            {
                PersonsBusiness? existingPersonToUpdate = PersonsBusiness.GetOnePersonByID(PersonID);
                if (existingPersonToUpdate == null)
                {
                    return NotFound("Person not found for the provided ID");
                }
                existingPersonToUpdate.FirstName = person.FirstName;
                existingPersonToUpdate.SecondName = person.SecondName;
                existingPersonToUpdate.ThirdName = person.ThirdName;
                existingPersonToUpdate.LastName = person.LastName;
                existingPersonToUpdate.NationalNo = person.NationalNo;
                existingPersonToUpdate.DateOfBirth = person.DateOfBirth;
                existingPersonToUpdate.Gendor = person.Gendor;
                existingPersonToUpdate.Address = person.Address;
                existingPersonToUpdate.Phone = person.Phone;
                existingPersonToUpdate.Email = person.Email;
                existingPersonToUpdate.NationalityCountryID = person.NationalityCountryID;
                existingPersonToUpdate.ImagePath = person.ImagePath;

               
                if (existingPersonToUpdate.Save())
                {
                    return Ok(existingPersonToUpdate.PersonBusinessDTO);
                }
                else
                {
                    return BadRequest("Failed to update the person");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "An error occurred while updating the person.");
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
                PersonsBusiness? person=PersonsBusiness.GetOnePersonByID(id);
                
                if (person==null)
                {
                    return NotFound("Person not found for the provided ID");
                }
                UsersBusiness.DeleteUsersOfPerson(id);
                PersonsBusiness.DeletePerson(id);
                return Ok($"person with {id} deleted");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the person.");
            }
        }


    }
}