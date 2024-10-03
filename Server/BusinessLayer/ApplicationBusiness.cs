using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.DataAccessLayer;
namespace Server.BusinessLayer
{
    public class ApplicationBusiness
    {
        public enum EnMode {AddNew = 0,Update = 1};
        public enum EnApplicationType { NewDrivingLicense = 1, RenewDrivingLicense = 2, ReplaceLostDrivingLicense=3,
            ReplaceDamagedDrivingLicense=4, ReleaseDetainedDrivingLicsense=5, NewInternationalLicense=6,RetakeTest=7
        };
        public enum EnApplicationStatus { New=1, Cancelled=2,Completed=3};
        public int ApplicationID { set; get; }
        public int ApplicantPersonID { set; get; }
        public DateTime ApplicationDate { set; get; }
        public int ApplicationTypeID { set; get; }
        public EnApplicationStatus ApplicationStatus { set; get; } 
        public EnMode Mode=EnMode.AddNew;
        public UsersBusiness? CreatedByUserInfo;
        public ApplicationTypeBusiness? ApplicationTypeInfo;
        public ApplicationDto ApplicationBusinessDTO
        {
            get{
                return new ApplicationDto(this.ApplicationID,this.ApplicantPersonID,this.ApplicationDate,
                this.ApplicationTypeID,(byte)this.ApplicationStatus,this.LastStatusDate,this.PaidFees,this.CreatedByUserID);
            }
        }
        public string StatusText  
        {
            get { 
            
                switch (ApplicationStatus)
                {
                    case EnApplicationStatus.New:
                        return "New";
                    case EnApplicationStatus.Cancelled:
                        return "Cancelled";
                    case EnApplicationStatus.Completed:
                        return "Completed";
                    default:
                        return "Unknown";  
                }
            }   
        }
        public DateTime LastStatusDate { set; get; }
        public float PaidFees { set; get; }
        public int CreatedByUserID { set; get; }
        public ApplicationBusiness(int ApplicationID, int ApplicantPersonID, 
             DateTime ApplicationDate, int ApplicationTypeID,
             byte ApplicationStatus, DateTime LastStatusDate,
             float PaidFees, int CreatedByUserID,EnMode Mode=EnMode.AddNew)
        {
            this.ApplicationID = ApplicationID;
            this.ApplicantPersonID = ApplicantPersonID;
            this.ApplicationDate = ApplicationDate;
            this.ApplicationTypeID = ApplicationTypeID;
            this.ApplicationStatus = (EnApplicationStatus)ApplicationStatus;
            this.LastStatusDate = LastStatusDate;
            this.PaidFees = PaidFees;
            this.CreatedByUserID = CreatedByUserID;
            this.Mode = Mode;
            this.CreatedByUserInfo=UsersBusiness.FindUserByID(CreatedByUserID);
            this.ApplicationTypeInfo=ApplicationTypeBusiness.GetApplicationTypeInfoByID(ApplicationTypeID);
        }
        private bool _AddNewApplication()
        {
            
                this.ApplicationID = ApplicationDataAccess.AddNewApplication(ApplicationBusinessDTO);
            return this.ApplicationID != -1;
        }
        private bool _UpdateApplication()
        {
            //call DataAccess Layer 

            return ApplicationDataAccess.UpdateApplication(this.ApplicationID,ApplicationBusinessDTO);
           

        }
        public static ApplicationBusiness? GetApplicationByID(int ApplicationID)
        {
            ApplicationDto? applicationDto=ApplicationDataAccess.GetApplicationByID(ApplicationID);
            if(applicationDto!=null)
            {
                return new ApplicationBusiness(ApplicationID,applicationDto.ApplicantPersonID,applicationDto.ApplicationDate,
                applicationDto.ApplicationTypeID,applicationDto.ApplicationStatus,applicationDto.LastStatusDate,
                applicationDto.PaidFees,applicationDto.CreatedByUserID,EnMode.Update);

            }
            else
            {
                return null;
            }

        }
        public  bool Save()
        {
            switch(Mode)
            {
                case EnMode.AddNew:
                if(_AddNewApplication()){
                    Mode=EnMode.Update;
                    return true;
                }
                else {
                    return false;
                }
                case EnMode.Update:
                return _UpdateApplication();
            }
            return false;
        }
        public  bool CompleteApplication()
        {
            return ApplicationDataAccess.UpdateStatus(this.ApplicationID,3);

        }
    }
}