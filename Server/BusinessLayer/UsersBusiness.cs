using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.DataAccessLayer;

namespace Server.BusinessLayer
{
    public class UsersBusiness
    {
        public static bool DeleteUsersOfPerson(int personID)
        {
            return UsersDataAccess.DeleteUsersOfPerson(personID);
        }
    }
}