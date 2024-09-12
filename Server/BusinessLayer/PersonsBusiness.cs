using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.DataAccessLayer;
namespace Server.BusinessLayer
{
    public class PersonsBusiness
    {
   public enum EnMode { AddNew = 0, Update = 1 };
        public EnMode Mode = EnMode.AddNew;
         public PersonDTO PersonBusinessDTO
        {
           get {return new PersonDTO(this.PersonID, this.FirstName, this.SecondName,this.ThirdName, this.LastName,
           this.NationalNo,this.DateOfBirth,this.Gendor,this.Address,this.Phone,this.Email,this.NationalityCountryID,
           this.ImagePath,"","");}
        }
       

        public int PersonID { set; get; }
        public string FirstName { set; get; }
        public string SecondName { set; get; }
        public string ThirdName { set; get; }
        public string LastName { set; get; }
        public string NationalNo { set; get; }
        public DateTime DateOfBirth { set; get; }
        public short Gendor { set; get; }
        public string Address { set; get; }
        public string Phone { set; get; }
        public string Email { set; get; }
        public int NationalityCountryID { set; get; }
        public string ImagePath { set; get; }

        

        public PersonsBusiness(PersonDTO person,EnMode mode=EnMode.AddNew)
        {
            
        this.PersonID = person.PersonID;
        this.FirstName = person.FirstName;
        this.SecondName = person.SecondName;
        this.ThirdName = person.ThirdName;
        this.LastName = person.LastName;
        this.NationalNo = person.NationalNo;
        this.DateOfBirth = person.DateOfBirth;
        this.Gendor = person.Gendor;
        this.Address = person.Address;
        this.Phone = person.Phone;
        this.Email = person.Email;
        this.NationalityCountryID = person.NationalityCountryID;
        this.ImagePath = person.ImagePath;
        Mode = mode;

        }
        public static PersonsBusiness? GetOnePerson(int PersonID)
        {
            PersonDTO? person=PersonsDataAccess.GetOnePerson(PersonID);
            if(person!=null){
                return new PersonsBusiness(person,EnMode.Update);
            }
            else{
                return null;
            }
        }
        private bool _AddPerson()
        {
            this.PersonID =PersonsDataAccess.AddPerson(PersonBusinessDTO);
            return this.PersonID!=-1;

        }
        private bool _UpdatePerson()
        {
            return PersonsDataAccess.UpdatePerson(PersonBusinessDTO);

        }
           public bool Save()
            {
                switch (Mode)
                {
                    case EnMode.AddNew:
                        if (_AddPerson())
                        {

                            Mode = EnMode.Update;
                            return true;
                        }
                        else
                        {
                            return false;
                        }

                    case EnMode.Update:

                        return _UpdatePerson();

                }

                return false;
            }
        public static List<PersonDTO>GetAllPeople()
        {
            return PersonsDataAccess.GetAllPeople();
        }
        public static bool DeletePerson(int personID)
        {
            return PersonsDataAccess.DeletePerson(personID);
        }
    }
}