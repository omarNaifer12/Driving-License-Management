using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.DataAccessLayer;

namespace Server.BusinessLayer
{
    public class LicenseBusiness
    {
    
        public int LicenseID { get; set; }
        public int ApplicationID { get; set; }
        public int DriverID { get; set; }
        public int LicenseClass { get; set; }
        public DateTime IssueDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string Notes { get; set; }
        public float PaidFees { get; set; }
        public bool IsActive { get; set; }
        public byte IssueReason { get; set; }
        public int CreatedByUserID { get; set; }
        public DriverBusiness? DriverInfo;
        public LicenseClassesBusiness? licenseClassInfo;

       
        public enum EnMode2 { AddNew = 0, Update = 1 }
        public EnMode2 Mode { get; set; } = EnMode2.AddNew;

    
        public LicenseBusiness(LicenseDTO licenseDTO, EnMode2 mode = EnMode2.AddNew)
        {
            LicenseID = licenseDTO.LicenseID;
            ApplicationID = licenseDTO.ApplicationID;
            DriverID = licenseDTO.DriverID;
            LicenseClass = licenseDTO.LicenseClass;
            IssueDate = licenseDTO.IssueDate;
            ExpirationDate = licenseDTO.ExpirationDate;
            Notes = licenseDTO.Notes;
            PaidFees = licenseDTO.PaidFees;
            IsActive = licenseDTO.IsActive;
            IssueReason = licenseDTO.IssueReason;
            CreatedByUserID = licenseDTO.CreatedByUserID;
            Mode = mode;
            DriverInfo=DriverBusiness.GetDriverByID(DriverID);
            licenseClassInfo=LicenseClassesBusiness.GetLicenseClassByID(licenseDTO.LicenseClass);
            
            
        }

        // Convert business object to DTO
        public LicenseDTO ToDTO()
        {
            return new LicenseDTO
            (
                LicenseID ,
                ApplicationID ,
                DriverID ,
                LicenseClass ,
                IssueDate ,
                ExpirationDate ,
                Notes ,
                PaidFees ,
                IsActive ,
                IssueReason ,
                CreatedByUserID 
            );
        }

  
        private bool _AddNewLicense()
        {
            this.LicenseID = LicenseDataAccess.AddNewLicense(this.ToDTO());
            return this.LicenseID != -1;
        }

      
        private bool _UpdateLicense()
        {
            return LicenseDataAccess.UpdateLicense(this.ToDTO());
        }

       
        public bool Save()
        {
            switch (Mode)
            {
                case EnMode2.AddNew:
                    if (_AddNewLicense())
                    {
                        Mode = EnMode2.Update;
                        return true;
                    }
                    return false;

                case EnMode2.Update:
                    return _UpdateLicense();
            }
            return false;
        }

    
        public static LicenseBusiness? GetLicenseByID(int licenseID)
        {
            LicenseDTO? licenseDTO = LicenseDataAccess.GetLicenseByID(licenseID);

            if (licenseDTO != null)
            {
                return new LicenseBusiness(licenseDTO, EnMode2.Update);
            }
            return null;
        }
        public static int GetActiveLicenseIdForPerson(int PersonID,int LicenseClassID)
        {
            return LicenseDataAccess.GetActiveLicenseIdForPerson(PersonID,LicenseClassID);
        }
        public static List<LicensesPersonDTO> GetLicensesOfPerson(int PersonID)
        {
            return LicenseDataAccess.GetLicensesOfPerson(PersonID);
        }
        public static bool DeactivateLicense (int licenseID)
        {
        return LicenseDataAccess.DeactivateLicense(licenseID);
        }
    }
}