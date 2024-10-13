using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Server.DataAccessLayer;

namespace Server.BusinessLayer
{
   
    public class DriverBusiness
    {
      
  public int DriverID { get; set; }
    public int PersonID { get; set; }
    public int CreatedByUserID { get; set; }
    public DateTime CreatedDate { get; set; }
    public PersonsBusiness? personInfo;
    
    public enum EnMode2 { AddNew = 0, Update = 1 }
    public EnMode2 Mode { get; set; } = EnMode2.AddNew;

    
    public DriverBusiness(DriverDTO driverDTO, EnMode2 mode = EnMode2.AddNew)
    {
        personInfo=PersonsBusiness.GetOnePersonByID(driverDTO.PersonID);
        DriverID = driverDTO.DriverID;
        PersonID = driverDTO.PersonID;
        CreatedByUserID = driverDTO.CreatedByUserID;
        CreatedDate = driverDTO.CreatedDate;
        Mode = mode;
    }

   
    public DriverDTO ToDTO()
    {
        return new DriverDTO(DriverID, PersonID, CreatedByUserID, CreatedDate);
    }

    
    private bool _AddNewDriver()
    {
        this.DriverID = DriverDataAccess.AddNewDriver(this.ToDTO());
        return this.DriverID != -1;
    }

    
    private bool _UpdateDriver()
    {
        return DriverDataAccess.UpdateDriver(this.ToDTO());
    }

    
    public bool Save()
    {
        switch (Mode)
        {
            case EnMode2.AddNew:
                if (_AddNewDriver())
                {
                    Mode = EnMode2.Update;
                    return true;
                }
                return false;

            case EnMode2.Update:
                return _UpdateDriver();
        }
        return false;
    }

   
    public static DriverBusiness? GetDriverByPersonID(int personID)
    {
        DriverDTO? driverDTO = DriverDataAccess.GetDriverInfoByPersonID(personID);

        if (driverDTO != null)
        {
            return new DriverBusiness(driverDTO, EnMode2.Update);
        }
        return null;
    }
     public static DriverBusiness? GetDriverByID(int DriverID)
    {
        DriverDTO? driverDTO = DriverDataAccess.GetDriverInfoByDriverID(DriverID);

        if (driverDTO != null)
        {
            return new DriverBusiness(driverDTO, EnMode2.Update);
        }
        return null;
    }
     public static List<dtoViewDriver> GetDriversList()
    {
        
        return DriverDataAccess.GetAllDrivers();
    }
    }
}