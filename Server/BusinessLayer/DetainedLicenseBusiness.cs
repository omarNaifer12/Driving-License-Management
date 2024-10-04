using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.DataAccessLayer;

namespace Server.BusinessLayer
{
    public class DetainedLicenseBusiness
    {
           public enum enMode { AddNew = 0, Update = 1 };
        public enMode Mode = enMode.AddNew;


        public int DetainID { set; get; }
        public int LicenseID { set; get; }
        public DateTime DetainDate { set; get; }

        public float  FineFees { set; get; }
        public int CreatedByUserID { set; get; }
        public UsersBusiness? CreatedByUserInfo { set; get; }
        public bool IsReleased { set; get; }
        public DateTime ReleaseDate { set; get; }
        public int ReleasedByUserID { set; get; }
        public UsersBusiness? ReleasedByUserInfo { set; get; }
        public int ReleaseApplicationID { set; get; }
       
        public DetainedLicenseBusiness()

        {
            this.DetainID = -1;
            this.LicenseID = -1;
            this.DetainDate = DateTime.Now;
            this.FineFees = 0;
            this.CreatedByUserID = -1;
            this.IsReleased = false;
            this.ReleaseDate = DateTime.MaxValue;
            this.ReleasedByUserID = 0;
            this.ReleaseApplicationID = -1;
            Mode = enMode.AddNew;
        }
        public DetainedLicenseBusiness(int DetainID,
            int LicenseID,  DateTime DetainDate,
            float FineFees,  int CreatedByUserID,
            bool IsReleased,  DateTime ReleaseDate,
            int ReleasedByUserID,  int ReleaseApplicationID)

        {
            this.DetainID = DetainID;
            this.LicenseID = LicenseID;
            this.DetainDate = DetainDate;
            this.FineFees = FineFees;
            this.CreatedByUserID = CreatedByUserID;
            this.CreatedByUserInfo = UsersBusiness.FindUserByID(this.CreatedByUserID);
            this.IsReleased = IsReleased;
            this.ReleaseDate = ReleaseDate;
            this.ReleasedByUserID = ReleasedByUserID;
            this.ReleaseApplicationID = ReleaseApplicationID;
            this.ReleasedByUserInfo= UsersBusiness.FindUserByID(this.ReleasedByUserID);
            Mode = enMode.Update;
        }

        private bool _AddNewDetainedLicense()
        {//call DataAccess Layer 
            this.DetainID = DetainedLicenseDataAccess.AddNewDetainedLicense( 
                this.LicenseID,this.DetainDate,this.FineFees,this.CreatedByUserID);
            return (this.DetainID != -1);
        }
        private bool _UpdateDetainedLicense()
        {
            //call DataAccess Layer 

            return DetainedLicenseDataAccess.UpdateDetainedLicense(
                this.DetainID,this.LicenseID,this.DetainDate,this.FineFees,this.CreatedByUserID);
        }

        public static DetainedLicenseBusiness? Find(int DetainID)
        {
            int LicenseID = -1; DateTime DetainDate = DateTime.Now;
            float FineFees= 0; int CreatedByUserID = -1;
            bool IsReleased = false; DateTime ReleaseDate = DateTime.MaxValue;
            int ReleasedByUserID = -1; int ReleaseApplicationID = -1;

            if (DetainedLicenseDataAccess.GetDetainedLicenseInfoByID(DetainID,
            ref LicenseID, ref DetainDate,
            ref FineFees, ref CreatedByUserID,
            ref IsReleased, ref ReleaseDate,
            ref ReleasedByUserID, ref ReleaseApplicationID))
                return new DetainedLicenseBusiness(DetainID,
                     LicenseID,  DetainDate,
                     FineFees,  CreatedByUserID,
                     IsReleased,  ReleaseDate,
                     ReleasedByUserID,  ReleaseApplicationID);
            else
                return null;

        }

        public bool Save()
        {
            switch (Mode)
            {
                case enMode.AddNew:
                    if (_AddNewDetainedLicense())
                    {

                        Mode = enMode.Update;
                        return true;
                    }
                    else
                    {
                        return false;
                    }

                case enMode.Update:

                    return _UpdateDetainedLicense();

            }

            return false;
        }

        public static bool IsLicenseDetained(int LicenseID)
        {
            return DetainedLicenseDataAccess.IsLicenseDetained(LicenseID);
        }

        public bool ReleaseDetainedLicense(int ReleasedByUserID, int ReleaseApplicationID)
        {
            return DetainedLicenseDataAccess.ReleaseDetainedLicense(this.DetainID,
                   ReleasedByUserID, ReleaseApplicationID);
        }
          public static DetainedLicenseBusiness? FindByLicenseID(int LicenseID)
        {
            int DetainID = -1; DateTime DetainDate = DateTime.Now;
            float FineFees = 0; int CreatedByUserID = -1;
            bool IsReleased = false; DateTime ReleaseDate = DateTime.MaxValue;
            int ReleasedByUserID = -1; int ReleaseApplicationID = -1;
            if (DetainedLicenseDataAccess.GetDetainedLicenseInfoByLicenseID(LicenseID,
            ref DetainID, ref DetainDate,
            ref FineFees, ref CreatedByUserID,
            ref IsReleased, ref ReleaseDate,
            ref ReleasedByUserID, ref ReleaseApplicationID))
                return new DetainedLicenseBusiness(DetainID,
                     LicenseID, DetainDate,
                     FineFees, CreatedByUserID,
                     IsReleased, ReleaseDate,
                     ReleasedByUserID, ReleaseApplicationID);
            else
                return null;
        }
    }
}