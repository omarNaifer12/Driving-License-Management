using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.DataAccessLayer;

namespace Server.BusinessLayer
{
    public class InterNationalLicenseBusiness
    {
       public static List<InterNationalLicenseDTO> GetAllInterNationalLicensesOfPerson(int PersonID)
       {
        return InterNationalLicenseDataAccess.GetAllInterNationalLicensesOfPerson(PersonID);
       }
    }
}