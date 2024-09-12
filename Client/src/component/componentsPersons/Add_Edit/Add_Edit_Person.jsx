import React, { useContext,useState,useEffect } from 'react'
import "./Add_Edit_Person.css"
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../../context/storeContext';
import axios from 'axios';
const Add_Edit_Person = () => {
  const {id}=useParams();
  const navigate=useNavigate();
 
  const{getPersonById,person,setPerson}=useContext(StoreContext);
  useEffect(() => {
    
      
    
    const fetchPerson = async () => {
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
    if(id!==undefined){ 
   await getPersonById(id);
  }
 
  };
    fetchPerson();
  }, [id]);
  const handleChange = (e) => {
    const { name, value,files } = e.target;
    if (name === "ImagePath" &&files.length > 0) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPerson({ ...person, [name]: reader.result });
        };
        reader.readAsDataURL(files[0]);
      }
    else{
    setPerson({ ...person, [name]: value });
    }  
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      let response;
      if(id) {
        response = await axios.put(`http://localhost:3000/people/${id}`, person);
        console.log("response edit is ", response);
        alert("Edit successful");
      } else {
        response = await axios.post(`http://localhost:3000/people`, person);
        console.log("response add is ", response);
        alert("Added successfully");
       
      }
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
    } catch (error) {
      console.log("Error saving person data:", error);
      alert("There was an error saving the data. Please try again.");
    }
    }
   

  return (
    <div className="form-container" >
      <h1>{id ? 'Edit Person' : 'Add Person'}</h1>
      <form className="person-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="personId">Person ID</label>
            <input type="text" id="personId" name="PersonID" value={person.PersonID || ''} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="nationalNo">National No</label>
            <input type="text" id="nationalNo" name="NationalNo" value={person.NationalNo} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" name="FirstName" value={person.FirstName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="secondName">Second Name</label>
            <input type="text" id="secondName" name="SecondName" value={person.SecondName} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="thirdName">Third Name</label>
            <input type="text" id="thirdName" name="ThirdName" value={person.ThirdName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" name="LastName" value={person.LastName} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input type="date" id="dob" name="DateOfBirth" value={person.DateOfBirth} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select id="gender" name="Gendor" value={person.Gendor} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group full-width">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" name="Address" value={person.Address} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input type="tel" id="phone" name="Phone" value={person.Phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="Email" value={person.Email} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input type="text" id="country" name="NationalityCountryID" value={person.NationalityCountryID} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="countryImage">Person Image</label>
            <input type="file" id="countryImage" name="ImagePath"   onChange={handleChange}/>
          </div>
        </div>
        <div className="form-group">
          <button   type="submit">{id ? 'Update' : 'Add'} Person</button>
        </div>
      </form>
    </div>
  );
}

export default Add_Edit_Person