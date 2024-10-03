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
          public string? PersonFullName   
        {
            get { 
                return PersonsBusiness.GetOnePersonByID(ApplicantPersonID)?.FullName; 
            }   
            
        }
        public LicenseClassesBusiness? LicensClassInfo; 

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
            LicensClassInfo=LicenseClassesBusiness.GetLicenseClassByID(LicenseClassID);
            
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
        public static LocalDrivingLicenseBusiness? FindLocalDrivingApplicationByID(int id)
        {
            int applicationID=-1;
            int licenseClassID=-1;
            bool isFound=
            LocalDrivingLicenseDataAccess.GetLocalDrivingLicenseApplicationInfoByID(id,ref applicationID,ref licenseClassID);
            if(isFound){
                ApplicationDto? application=ApplicationDataAccess.GetApplicationByID(applicationID);
                if(application!=null){
                    return new LocalDrivingLicenseBusiness(id,applicationID,application.ApplicantPersonID,
                    application.ApplicationDate,application.ApplicationTypeID, application.ApplicationStatus,
                    application.LastStatusDate,application.PaidFees,application.CreatedByUserID,licenseClassID,
                    EnMode2.Update);
                }
                else{
                    return null;
                }
            }
            else{
                return null;
            } 

        }
        public static int IsPersonHaveTheSameLocalDrivingLicense(int ApplicationTypeID,int ApplicantPersonID,int 
        LicenseClassID)
        {
            return LocalDrivingLicenseDataAccess.IsPersonHaveTheSameLocalDrivingLicense(ApplicationTypeID,
            ApplicantPersonID,LicenseClassID);
        }
        public  int IssueLocalDrivingLicenseFirstTime(int createdByUserID,string Note)
        {
            int driverID=-1;
            DriverDTO? driver=DriverDataAccess.GetDriverInfoByPersonID(this.ApplicantPersonID);
            if(driver!=null){
                driverID=driver.DriverID;
            }
            else{
            
                DriverBusiness Driver=new (new DriverDTO(-1,this.ApplicantPersonID,createdByUserID,DateTime.Now));
                if(Driver.Save()){
                    driverID=Driver.DriverID;
                }
                else
                {
                    return -1;
                }
            }
            DateTime newExpirationDate = LicensClassInfo?.DefaultValidityLength != null 
    ? DateTime.Now.AddYears(LicensClassInfo.DefaultValidityLength)
    : DateTime.Now;
            LicenseBusiness license=new(new LicenseDTO(-1,this.ApplicationID,driverID,this.LicenseClassID,
            DateTime.Now,newExpirationDate,Note,LicensClassInfo.ClassFees,true,1,createdByUserID) );
            if(license.Save()){
                this.CompleteApplication();
                return license.LicenseID;
            }
            else
            return -1;



        }
    }
}