import React, { useContext, useEffect, useState } from 'react'
import "./people.css"
import { useNavigate, useParams } from 'react-router-dom';
import { StoreContext } from '../../../context/storeContext';
import { useDispatch, useSelector } from 'react-redux';
import { deletePersonAction, getAllPeopleAction } from '../../../Redux/Actions/peopleAction';
import axios from 'axios';
import { deleteDataAPI, getDataAPI } from '../../../utils/fetchData';
function ListPersons() {

const navigate=useNavigate();
const dispatch=useDispatch();
const [formatedButtons,setFormatedButtons]=useState([]);
const [highestPageNumber,setHighestPageNumber]=useState(0);
const [persons,setPersons]=useState([]);
const {newPage}=useParams();
const currentPage = newPage?parseInt(newPage, 10):1;
useEffect(()=>{
  const loadData=async()=>{
    if(highestPageNumber){
    ManipulateButtonsOfPagination();
   await getPagintedPeople(currentPage);
  }
  }
  loadData();
  },[currentPage,highestPageNumber]);
  useEffect(()=>{
    getHighestPageNumber();
  },[])
  const getHighestPageNumber=async()=>{
    try {
      const response=await getDataAPI('Persons/count');
      console.log("data get highest num",response.data);
      
    
      setHighestPageNumber(response.data);
    } catch (error) {
      console.log("erorr",error);
      
    }
  }
const deletePerson=async(PersonID)=>{
  console.log("person id for delete ",PersonID);
  
  try{
    await deleteDataAPI(`Persons/Delete/${PersonID}`);
    dispatch(deletePersonAction(PersonID));
  }
  catch(error){
      console.log("error delete person",error);
  }
}
const getPagintedPeople=async(pageNumber)=>{
try{
const response=await getDataAPI(`Persons/Paginated?pageNumber=${pageNumber}`);
setPersons(response.data);

}
catch(error){
  console.log("error");
  
}
}
const ManipulateButtonsOfPagination=()=>{
let buttons=[]
  if(highestPageNumber<=7){
for(let i=1;i<=highestPageNumber;i++){
  buttons.push(i);
}
}
else{
  if(currentPage<=5){
    buttons=[1,2,3,4,5,6,'...',highestPageNumber];
  }
  else if(currentPage>=highestPageNumber-4){
    buttons=[1,'...',highestPageNumber-5,highestPageNumber-4,highestPageNumber-3,highestPageNumber-2,highestPageNumber-1,highestPageNumber];
  }
  else{
    buttons=[1,'...',currentPage-1,currentPage,currentPage+1,currentPage+2,'...',highestPageNumber];
  }
}
setFormatedButtons(buttons);
}
const handlePageChange = (newPage) => {
  navigate(`/people/page/${newPage}`); 
};
return(
  <div className="person-list">
    
    <button onClick={()=>navigate("/AllLocalDrivingLicense")}> go AllLocalDrivingLicense </button>


    <button onClick={()=>navigate("/loginForm")}> go login </button>
    <h1>Manage People</h1>
    <button onClick={()=>navigate('/all-users')}>users</button>
    <button className="add-button" onClick={() => navigate("/add-Person")}>Add Person</button>
    <table className="person-table">
      <thead>
        <tr>
          <th>Person ID</th>
          <th>First Name</th>
          <th>Second Name</th>
          <th>Third Name</th>
          <th>Last Name</th>
          <th>National No</th>
          <th>Date of Birth</th>
          <th>Gender</th>
          <th>Address</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Nationality</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {persons.map((person, index) => (
          
          
          <tr key={index}>
            <td>{person.PersonID}</td>
            <td>{person.FirstName}</td>
            <td>{person.SecondName}</td>
            <td>{person.ThirdName}</td>
            <td>{person.LastName}</td>
            <td>{person.NationalNo}</td>
            <td>{person.DateOfBirth}</td>
            <td>{person.GendorCaption}</td>
            <td>{person.Address}</td>
            <td>{person.Phone}</td>
            <td>{person.Email}</td>
            <td>{person.CountryName}</td>
            <td><img src={person.ImagePath} alt={`${person.FirstName} ${person.LastName}`} className="person-image" /></td>
            <td>
              <p>{console.log("id",person.PersonID)}</p>
              <button className="edit-button" onClick={() => navigate(`/edit-Person/${person.PersonID}`)}>Edit</button>
              <button className="delete-button" onClick={()=>deletePerson(person.PersonID)}>Delete</button>
              <button className="delete-button"  onClick={()=>navigate(`/Person-details/${person.PersonID}`)}>Show Details</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div>
      {
       formatedButtons.map((button,index)=>{
        return (
          <div key={index}>
          {button==='...'? (<span key={index}>...</span>):
          (<button onClick={()=>handlePageChange(button)}>{button}</button>)
          }
          </div>
        )
        })
      
      }
    </div>
  </div>
);
}
export default ListPersons;