import React, { useContext,useEffect } from 'react'
import "./CptPersonInformation.css"
import { StoreContext } from '../../../context/storeContext';
const CptPersonInformation = ({id}) => {
    const{getPersonById,person,setPerson}=useContext(StoreContext);
    useEffect(()=>{
        const fetchPerson=async()=>{
          
            setPerson({
              FirstName: '',
              SecondName: '',
              ThirdName: '',
              LastName: '',
              NationalNo: '',
              DateOfBirth: '',
              Gendor: '',
              Address: '',
              Phone: '',
              Email: '',
              NationalityCountryID: '',
              ImagePath: ''
            });
          
    if(id){ 
    const respnse= await getPersonById(id);
    console.log("resonseda",respnse);
    if(!respnse){
      alert(" error id ");
    }
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
      <h2>{person.id ? `${person.FirstName} ${person.SecondName} ${person.ThirdName} ${person.LastName}` : '????'}</h2>
      <p><strong>Person ID:</strong> {person.id ? person.PersonID : '????'}</p>
      <p><strong>First Name:</strong> {person.id ? person.FirstName : '????'}</p>
      <p><strong>Second Name:</strong> {person.id ? person.SecondName : '????'}</p>
      <p><strong>Third Name:</strong> {person.id ? person.ThirdName : '????'}</p>
      <p><strong>Last Name:</strong> {person.id ? person.LastName : '????'}</p>
      <p><strong>National No:</strong> {person.id ? person.NationalNo : '????'}</p>
      <p><strong>Date of Birth:</strong> {person.id ? person.DateOfBirth : '????'}</p>
      <p><strong>Gender:</strong> {person.id ? person.Gendor : '????'}</p>
      <p><strong>Address:</strong> {person.id ? person.Address : '????'}</p>
      <p><strong>Phone:</strong> {person.id ? person.Phone : '????'}</p>
      <p><strong>Email:</strong> {person.id ? person.Email : '????'}</p>
      <p><strong>Nationality:</strong> {person.id ? person.NationalityCountryID : '????'}</p>
    </div>
  </div>
  )
}

export default CptPersonInformation