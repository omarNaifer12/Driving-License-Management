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
    [Route("api/Users")]
    public class UsersControllerApi : ControllerBase
    {
        
        [HttpGet("All", Name ="GetAllUsers")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IEnumerable<UserDTO>>GetAllUsers()
        {
            Console.WriteLine("reach all users");
        try{
             var allUsers= UsersBusiness.GetAllUsers();
            
           
            if(allUsers.Count==0)
            {
                return NotFound("no data found");
            }
            return Ok(allUsers);
        }
          catch(Exception ex)
        {
            Console.WriteLine(ex.Message);
         return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");

        }
        }
        [HttpGet("one/{id:int}", Name ="GetOneUserByID")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<UserDTO>GetOneUserByID(int id)
        {
            UsersBusiness? user=UsersBusiness.FindUserByID(id);
          try{
          if(user==null){
            return NotFound("the user not found error your id");
          }
            
           UserDTO userDto=user.UserBusinessDTO;
            return Ok(userDto);
          }
          catch(Exception ex)
          {
            Console.WriteLine(ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");

          }
        }
         [HttpPost("Add", Name ="AddUser")] 
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<PersonDTO>AddUser(UserDTO user)
        {
               

            Console.WriteLine("reach before try add save");
           try
            {
                if (user == null)
                {
                    return BadRequest("Invalid user data");
                }
                
                UsersBusiness userBusiness = new (user);
                Console.WriteLine("reach before add save");
                if (userBusiness.Save())
                {
                    Console.WriteLine("reach in  save");
                    user.UserID=userBusiness.UserID;


                    return CreatedAtRoute("GetOneUserByID",new {id = user.UserID}, user );
                }
                else
                {
                    return BadRequest("Failed to add the user");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "An error occurred while adding the person.");
            }
        }
          [HttpPut("Update/{id:int}", Name = "UpdateUser")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult UpdateUser( int id,UserDTO user)
        {
            try
            {
                UsersBusiness? existingUserToUpdate = UsersBusiness.FindUserByID(id);
                if (existingUserToUpdate == null)
                {
                    return NotFound("user not found for the provided ID");
                }
               existingUserToUpdate.UserName=user.UserName;
               existingUserToUpdate.IsActive=user.IsActive;
               existingUserToUpdate.Password=user.Password;
               existingUserToUpdate.PersonID=user.PersonID;

               
                if (existingUserToUpdate.Save())
                {
                    return Ok(existingUserToUpdate.UserBusinessDTO);
                }
                else
                {
                    return BadRequest("Failed to update the user");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "An error occurred while updating the person.");
            }
        }
                [HttpDelete("Delete/{id:int}", Name = "DeleteUser")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult DeleteUser(int id)
        {
            try
            {
                UsersBusiness? user=UsersBusiness.FindUserByID(id);
                if (user==null)
                {
                    return NotFound("user not found for the provided ID");
                }
                UsersBusiness.DeleteUserByID(id);
                return Ok($"user with {id} deleted");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the user.");
            }
        }
         [HttpPost("Login", Name = "LoginUser")]
         [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public ActionResult LoginUser(string Username,string password)
        {
           try{
            UsersBusiness? user=UsersBusiness.FindUserByUserNameAndPassword(Username,password);
            if (user==null)
            {
                return NotFound("user email or password not found");
            }
            if(user.IsActive==false){
                return StatusCode(StatusCodes.Status403Forbidden, "User account is inactive.");
            }
            return Ok(user.UserBusinessDTO);
           }
           catch(Exception ex)
           {
             Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while find username and password.");
  

           }


        }
        [HttpPost("checkPersonAcc", Name = "checkPersonHaveUserAcc")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult CheckPersonHaveUserAcc(int personID)
        {
         try{
                        bool hasAccount = UsersBusiness.IsPersonHaveUserAcc(personID);

    if (hasAccount)
    {
        return Ok(new { message = "Person already has a user account.", hasAccount = true });
    }
    else
    {
        return Ok(new { message = "Person does not have a user account.", hasAccount = false });
    }
         }
         catch(Exception ex)
           {
             Console.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while check person have users acc.");
  

           }
           }
    }
}