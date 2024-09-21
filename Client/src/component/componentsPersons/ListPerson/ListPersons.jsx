import React, { useContext, useEffect, useState } from 'react'
import "./people.css"
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../../context/storeContext';
import { useDispatch, useSelector } from 'react-redux';
import { deletePersonAction, getAllPeopleAction } from '../../../Redux/Actions/peopleAction';
import axios from 'axios';
import { deleteDataAPI } from '../../../utils/fetchData';
function ListPersons() {

const navigate=useNavigate();
const dispatch=useDispatch();
const persons=useSelector((state)=>state.Persons.People);
useEffect(()=>{
   dispatch(getAllPeopleAction());
  },[dispatch])
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
console.log("persons is ",persons);
return(
  <div className="person-list">
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
  </div>
);
}
export default ListPersons;