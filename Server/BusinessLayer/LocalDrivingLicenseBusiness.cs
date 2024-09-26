using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Server.DataAccessLayer;

namespace Server.BusinessLayer
{
    public class LocalDrivingLicenseBusiness:ApplicationBusiness
    {
        public enum EnMode2 {AddNew=0,Update=1}
        public EnMode2 mode=EnMode2.AddNew;

        public int LocalDrivingLicenseApplicationID { set; get; }
        public int LicenseClassID { set;get;}

        public LocalDrivingLicenseBusiness(int LocalDrivingLicenseApplicationID, int ApplicationID, int ApplicantPersonID, 
                DateTime ApplicationDate, int ApplicationTypeID,
             byte ApplicationStatus, DateTime LastStatusDate,
             float PaidFees, int CreatedByUserID, int LicenseClassID,EnMode2 mode=EnMode2.AddNew)
             : base(ApplicationID, ApplicantPersonID,
              ApplicationDate, ApplicationTypeID, ApplicationStatus, LastStatusDate, PaidFees, CreatedByUserID)
        {
            this.LocalDrivingLicenseApplicationID= LocalDrivingLicenseApplicationID; ;
            this.LicenseClassID = LicenseClassID;
            this.mode=mode;
            
        }
        public static List<LocalDrivingLicenseViewDTO> GetAllLocalDrivingLicense()
        {
            return LocalDrivingLicenseDataAccess.GetAllLocalDrivingLicenseApplication();
        }
        private bool _AddNewLocalDrivingLicenseApplication()
        {
            this.LocalDrivingLicenseApplicationID=LocalDrivingLicenseDataAccess.AddNewLocalDrivingLicenseApplication(
               this.ApplicationID,this.LicenseClassID 
            );
            return this.LocalDrivingLicenseApplicationID!=-1;

        }
         private bool _UpdateLocalDrivingLicenseApplication()
        {
            return LocalDrivingLicenseDataAccess.UpdateLocalDrivingLicenseApplication(
                this.LocalDrivingLicenseApplicationID,this.ApplicationID,this.LicenseClassID
            );
        }
        public new bool Save()
        {
            base.Mode=(ApplicationBusiness.EnMode)mode;
            if(!base.Save()){
                return false;
            }
            switch (mode)
            {
                case EnMode2.AddNew:
                    if (_AddNewLocalDrivingLicenseApplication())
                    {
                        mode = EnMode2.Update;
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                case EnMode2.Update:
                    return _UpdateLocalDrivingLicenseApplication();

                  }  
                  return false;
            
        }
    }
}