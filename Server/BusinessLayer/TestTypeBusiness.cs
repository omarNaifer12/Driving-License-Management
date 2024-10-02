using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.DataAccessLayer;

namespace Server.BusinessLayer
{
    public class TestTypeBusiness
    {
          public int  TestTypeID { set; get; }
        public string TestTypeTitle { set; get; }
        public string TestTypeDescription { set; get; } 
        public float TestTypeFees { set; get; }
   
        public TestTypeBusiness(TestTypeDTO testype)

        {
            this.TestTypeID = testype.TestTypeID;
            this.TestTypeTitle = testype.TestTypeTitle;
            this.TestTypeDescription = testype.TestTypeDescription;

            this.TestTypeFees = testype.TestTypeFees;
           
        }
        public TestTypeDTO TestTypeBusinessDTO{
            get{
                return  new TestTypeDTO(this.TestTypeID,this.TestTypeTitle,this.TestTypeDescription,
                this.TestTypeFees);
            }

        }
        public static List<TestTypeDTO> GetAllTestType()
        {
            return TestTypeDataAccess.GetAllTestTypes();
        }
        public static TestTypeBusiness? GetTestTypeByID(int TestTypeID)
        {
            TestTypeDTO? testType=TestTypeDataAccess.GetTestTypeInfoByID(TestTypeID);
            if(testType!=null){
                return new TestTypeBusiness(testType);
            }
            return null;

        }
    }
}