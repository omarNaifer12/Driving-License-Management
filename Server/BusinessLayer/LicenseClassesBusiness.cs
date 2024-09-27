using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.DataAccessLayer;

namespace Server.BusinessLayer
{
    public class LicenseClassesBusiness
    {
         
        public int LicenseClassID { set; get; }
        public string ClassName { set; get; }
        public string ClassDescription { set; get; }
        public byte MinimumAllowedAge { set; get; }
        public byte DefaultValidityLength { set; get; }
        public float ClassFees { set; get; }
      
        public LicenseClassesBusiness(int LicenseClassID, string ClassName,
            string ClassDescription,
            byte MinimumAllowedAge, byte DefaultValidityLength, float ClassFees)
        {
            this.LicenseClassID = LicenseClassID;
            this.ClassName = ClassName;
            this.ClassDescription = ClassDescription;
            this.MinimumAllowedAge = MinimumAllowedAge;
            this.DefaultValidityLength = DefaultValidityLength;
            this.ClassFees = ClassFees;
           
        }
        public static List<LicenseClassesDTO>GetAllLicenseClasses()
        {
            return LicenseClassesDataAccess.GetAllLicenseClasses();
        }
        public static LicenseClassesBusiness? GetLicenseClassByID(int licenseClassID)
        {
            LicenseClassesDTO? licenseClass=LicenseClassesDataAccess.GetLicenseClassByID(licenseClassID);
        if(licenseClass!=null)
        {
            return new LicenseClassesBusiness(licenseClass.LicenseClassID, licenseClass.ClassName,
            licenseClass.ClassDescription,licenseClass.MinimumAllowedAge,licenseClass.DefaultValidityLength,
            licenseClass.ClassFees);
        }
        else{
        return null;
        }
        }
    }
}