using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.DataAccessLayer;

namespace Server.BusinessLayer
{
    public class InterNationalLicenseBusiness:ApplicationBusiness
    {
           public enum EnMode2 { AddNew = 0, Update = 1 };
        public EnMode2 mode = EnMode2.AddNew;

        public DriverBusiness? DriverInfo;
        public int InternationalLicenseID { set; get; }  
        public int DriverID { set; get; }
        public int IssuedUsingLocalLicenseID { set; get; }   
        public DateTime IssueDate { set; get; }
        public DateTime ExpirationDate { set; get; }    
        public bool IsActive { set; get;}
        public int LicenseID {set; get;}
        public InterNationalLicenseBusiness(int ApplicationID, int ApplicantPersonID,
            DateTime ApplicationDate,
            EnApplicationStatus ApplicationStatus, DateTime LastStatusDate,
            float PaidFees, int CreatedByUserID, 
            int InternationalLicenseID,  int DriverID, int IssuedUsingLocalLicenseID,
            DateTime IssueDate, DateTime ExpirationDate,bool IsActive,EnMode2 Mode=EnMode2.AddNew):
            base(ApplicationID, ApplicantPersonID,
            ApplicationDate, (int)ApplicationBusiness.EnApplicationType.NewInternationalLicense,(byte)ApplicationStatus, LastStatusDate, PaidFees, CreatedByUserID)
        {
            this.InternationalLicenseID = InternationalLicenseID;
            this.ApplicationID=ApplicationID;
            this.DriverID = DriverID;
            this.IssuedUsingLocalLicenseID = IssuedUsingLocalLicenseID;
            this.IssueDate = IssueDate;
            this.ExpirationDate = ExpirationDate;
            this.IsActive = IsActive;
            this.CreatedByUserID = CreatedByUserID;
            this.DriverInfo = DriverBusiness.GetDriverByID(this.DriverID);
            this.LicenseID=LicenseBusiness.GetActiveLicenseIdForPerson(ApplicantPersonID,3);
            mode = Mode;
        }
        public InterNationalLicenseDTO INLbusinessDTO{
            get{
                return new InterNationalLicenseDTO(this.InternationalLicenseID,DriverID,IssuedUsingLocalLicenseID,
                IssueDate,ExpirationDate,IsActive,CreatedByUserID,ApplicationID);
            }
        }

        private bool _AddNewInternationalLicense()
        {
            //call DataAccess Layer 

            this.InternationalLicenseID = 
                InterNationalLicenseDataAccess.AddNewInternationalLicense(INLbusinessDTO);


            return this.InternationalLicenseID != -1;
        }

        private bool _UpdateInternationalLicense()
        {
            //call DataAccess Layer 

            return InterNationalLicenseDataAccess.UpdateInternationalLicense(
                this.InternationalLicenseID,INLbusinessDTO);
         }
        public static InterNationalLicenseBusiness? Find(int InternationalLicenseID)
        {
InterNationalLicenseDTO? interNationalLicenseDTO=InterNationalLicenseDataAccess.GetInternationalLicenseInfoByID(InternationalLicenseID);

           if(interNationalLicenseDTO != null){
            ApplicationDto? applicationDto=ApplicationDataAccess.GetApplicationByID(interNationalLicenseDTO.ApplicationID);
            if(applicationDto!=null){
                return new InterNationalLicenseBusiness(
                applicationDto.ApplicationID,               
                applicationDto.ApplicantPersonID,           
                applicationDto.ApplicationDate,             
                (EnApplicationStatus)applicationDto.ApplicationStatus, 
                applicationDto.LastStatusDate,              
                applicationDto.PaidFees,                 
                interNationalLicenseDTO.CreatedByUserID,    
                interNationalLicenseDTO.InternationalLicenseID,
                interNationalLicenseDTO.DriverID,         
                interNationalLicenseDTO.IssuedUsingLocalLicenseID,
                interNationalLicenseDTO.IssueDate,         
                interNationalLicenseDTO.ExpirationDate,    
                interNationalLicenseDTO.IsActive,          
                EnMode2.Update                              
            );
            }
           }
           return null;
        }
      
        public new bool Save()
        {
            //Because of inheritance first we call the save method in the base class,
            //it will take care of adding all information to the application table.
     
            base.Mode = (ApplicationBusiness.EnMode)mode;
            if (!base.Save())
                return false;

            switch (mode)
            {
                case EnMode2.AddNew:
                    if (_AddNewInternationalLicense())
                    {

                        Mode = EnMode.Update;
                        return true;
                    }
                    else
                    {
                        return false;
                    }

                case EnMode2.Update:

                    return _UpdateInternationalLicense();

            }
            return false;
        }

        public static int GetActiveInternationalLicenseIDByDriverID(int DriverID)
        {
            return InterNationalLicenseDataAccess.GetActiveInternationalLicenseByDriverID(DriverID);
        }
       public static List<InterNationalLicenseDTO> GetAllInterNationalLicensesOfPerson(int PersonID)
       {
        return InterNationalLicenseDataAccess.GetAllInterNationalLicensesOfPerson(PersonID);
       }
       
    }
}