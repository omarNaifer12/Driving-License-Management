using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.DataAccessLayer;

namespace Server.BusinessLayer
{
    public class ApplicationTypeBusiness
    {
          public int ApplicationTypeID { get; set; }
        public string ApplicationTypeTitle { get; set; }
        public float ApplicationFees { get; set; }
        public ApplicationTypeDTO ApplicationTypeDtoBusiness{
            get {return new ApplicationTypeDTO(this.ApplicationTypeID,this.ApplicationTypeTitle,this.ApplicationFees);}
        }
        public ApplicationTypeBusiness(int applicationTypeID, string applicationTypeTitle,float applicationFees)
        {
            this.ApplicationTypeID = applicationTypeID;
            this.ApplicationTypeTitle = applicationTypeTitle;
            this.ApplicationFees = applicationFees;
        }
        public static ApplicationTypeBusiness? GetApplicationTypeInfoByID(int applicationTypeID)
        {
            ApplicationTypeDTO? applicationTypeInfo=ApplicationTypeDataAccess.GetApplicationTypeInfoByID(applicationTypeID);
            if(applicationTypeInfo!=null){
                return new ApplicationTypeBusiness(applicationTypeID,applicationTypeInfo.ApplicationTypeTitle
                ,applicationTypeInfo.ApplicationFees);  
            }
            return null;


        }
    }
}