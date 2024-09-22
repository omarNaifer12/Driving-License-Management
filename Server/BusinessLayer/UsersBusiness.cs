using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.DataAccessLayer;

namespace Server.BusinessLayer
{
    public class UsersBusiness
    {
        public enum enMode { AddNew = 0, Update = 1 };
        public enMode Mode = enMode.AddNew;
        public int UserID { set; get; }
        public int PersonID { set; get; }
        public string UserName { set; get; }
        public string Password { set; get; }
        public bool IsActive { set; get; }

        public UsersBusiness(UserDTO user,enMode mode=enMode.AddNew)
        {
            this.UserID   =   user.UserID; 
            this.PersonID = user.PersonID;
            this.UserName = user.UserName;
            this.Password = user.Password;
            this.IsActive = user.IsActive;
            this.Mode = mode;
        }
        public UserDTO UserBusinessDTO
        {
        get{
            return new UserDTO( this.UserID,this.PersonID, this.UserName,this.Password,this.IsActive,"");
        }
        }
        private bool _AddUser()
        {
            this.UserID =UsersDataAccess.AddUser(UserBusinessDTO);
            return this.UserID!=-1;

        }
        private bool _UpdateUser()
        {
            return UsersDataAccess.UpdateUser(this.UserID,UserBusinessDTO);
        }
        public static bool DeleteUserOfPerson(int personID)
        {
            return UsersDataAccess.DeleteUserOfPerson(personID);
        }
        public bool Save()
        {
            switch(this.Mode)
            {
                case enMode.AddNew:
                if(_AddUser()){
                    return true;
                }
                else{
                    return false;
                }
                case  enMode.Update:
                return _UpdateUser();

            }
            return false;
        }
        public static List<UserDTO>GetAllUsers()
        {
            return UsersDataAccess.GetAllUsers();
        }
        public static bool DeleteUserByID(int userID)
        {
            return UsersDataAccess.DeleteUserByID(userID);
        }
        public static UsersBusiness? FindUserByID(int UserID)
        {
            UserDTO? user=UsersDataAccess.GetUserByID(UserID);
            if(user!=null){
                return new UsersBusiness(user,enMode.Update);
            }
            return null;
        }
        public static UsersBusiness? FindUserByUserNameAndPassword(string userName, string password)
        {
            UserDTO? user =UsersDataAccess.GetUserByUserNameAndPassword(userName,password);
            if(user!=null){
            return new UsersBusiness(user,enMode.Update);
            }
            return null;
        }
        public static bool IsPersonHaveUserAcc(int personID)
        {
            return UsersDataAccess.IsPersonHaveUserAcc(personID);
        }
        public static bool ChangePassword(int userID,string password)
        {
            return UsersDataAccess.ChangePassword(userID,password);
        }
    }
}