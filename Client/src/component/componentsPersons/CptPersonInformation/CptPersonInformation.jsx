import React, { useContext,useEffect } from 'react'
import "./CptPersonInformation.css"
import { StoreContext } from '../../../context/storeContext';
import { useDispatch, useSelector } from 'react-redux';
import { getOnePersonAction } from '../../../Redux/Actions/peopleAction';
const CptPersonInformation = ({id}) => {
    const person=useSelector((state)=>state.Persons.Person);
    const dispatch=useDispatch();
    useEffect(()=>{
        const fetchPerson=async()=>{    
          console.log("id person is",id);
            
    if(id){ 
   dispatch(getOnePersonAction(id));
    }
   
    };
    fetchPerson();
    },[id]);
  return (
    <div className="person-info">
    <h1 className="lbl-person-info">Person Information</h1>
    <br />
    <div className="person-image">
      <img
        src={person ? person.ImagePath : 'placeholder.jpg'}
        alt={`${person ? `${person.FirstName} ${person.LastName}` : '????'}`}
      />
    </div>
    <div className="person-text">
      <h2>{person.PersonID ? `${person.FirstName} ${person.SecondName} ${person.ThirdName} ${person.LastName}` : '????'}</h2>
      <p><strong>Person ID:</strong> {person.PersonID ? person.PersonID : '????'}</p>
      <p><strong>First Name:</strong> {person.PersonID ? person.FirstName : '????'}</p>
      <p><strong>Second Name:</strong> {person.PersonID ? person.SecondName : '????'}</p>
      <p><strong>Third Name:</strong> {person.PersonID ? person.ThirdName : '????'}</p>
      <p><strong>Last Name:</strong> {person.PersonID ? person.LastName : '????'}</p>
      <p><strong>National No:</strong> {person.PersonID ? person.NationalNo : '????'}</p>
      <p><strong>Date of Birth:</strong> {person.PersonID ? person.DateOfBirth : '????'}</p>
      <p><strong>Gender:</strong> {person.PersonID ? person.GendorCaption : '????'}</p>
      <p><strong>Address:</strong> {person.PersonID ? person.Address : '????'}</p>
      <p><strong>Phone:</strong> {person.PersonID ? person.Phone : '????'}</p>
      <p><strong>Email:</strong> {person.PersonID ? person.Email : '????'}</p>
      <p><strong>Nationality:</strong> {person.PersonID ? person.CountryName : '????'}</p>
    </div>
  </div>
  )
}

export default CptPersonInformation