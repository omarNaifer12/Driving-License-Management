import React, { useContext,useState,useEffect, useMemo } from 'react'
import "./Add_Edit_Person.css"
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../../context/storeContext';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addPersonAction, editPersonAction, getOnePersonAction } from '../../../Redux/Actions/peopleAction';
import { BASE_URL } from '../../../utils/config';
import { getDataAPI, postDataAPI, putDataAPI } from '../../../utils/fetchData';
const Add_Edit_Person = () => {
  const {id}=useParams();
  const navigate=useNavigate();
  const personOfRedux=useSelector((state)=>state.Persons.Person);
  const dispatch=useDispatch();
  const [person,setPerson]=useState({
    PersonID:0,
    FirstName: '',
    SecondName: '',
    ThirdName: '',
    LastName: '',
    NationalNo: '',
    DateOfBirth: '',
    Gendor: 0,
    Address: '',
    Phone: '',
    Email: '',
    NationalityCountryID: 0,
    ImagePath: '',
    CountryName:'',
    GendorCaption:'',
  });
  const [countries,setCountries]=useState([]);

  useEffect(() => {
    const fetchPerson = async () => {
    if(id!==undefined){ 
    dispatch(getOnePersonAction(id));
  }
  };
  
    fetchPerson();
  },[id,dispatch]);
  useEffect(()=>{
    if(id!==undefined&&personOfRedux){
     
      console.log("person of redux is ",personOfRedux);
      
      setPerson(personOfRedux);
    }
    fetchCountries();
  },[id,personOfRedux])
  const fetchCountries=async()=>{
    try{
      const result=await getDataAPI("Countries/All");
      setCountries(result.data);
      console.log("data countries is ",result.data);
    
    }
    catch(ex){
      console.log("error get country catch ",ex);
      
    }

  }
  const handleChange = (e) => {
  const { name,value,files } = e.target;
    if  (name === "ImagePath" &&files.length > 0) {
        const reader = new FileReader();
        reader.onloadend = () => {
        setPerson({ ...person, [name]: reader.result });
        };
        reader.readAsDataURL(files[0]);
      }
    else if(name !== "ImagePath"){
    setPerson({ ...person, [name]: value });
    }
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("add personredux",personOfRedux,id);
    
    try{
      let response;
      console.log("data person  ",person);
     if(id&&personOfRedux) {
         response = await putDataAPI(`Persons/Update/${id}`,person)
        console.log("response edit is ", response);
        alert("Edit successful");
        dispatch(editPersonAction(response.data));
      } else {
       
        console.log('reach add person');
        
        response = await postDataAPI("Persons/Add",person);
        console.log("response add is ", response);

        alert("Added successfully");
        dispatch(addPersonAction(response.data));
      }
    } catch (error) {
      console.log("Error saving person data:", error);
      alert("There was an error saving the data. Please try again.");
    }
    }
    const countryNameMapping=useMemo(()=>{
      let mapping={};
      countries.forEach((country)=>{
        mapping[country.CountryID]=country.CountyName;
      })
      return mapping;

    },[countries])
    const handleCountryChange=(e)=>{
      const value=e.target.value;
      setPerson((prevPerson)=>({
        ...prevPerson,
        NationalityCountryID:value,
        CountryName:countryNameMapping[value]
      }))
    }
    const handleGendorChange=(e)=>{
      const value = e.target.value;
      const genderCaption = value === 0 ? "Male" : "Female"; 
      setPerson((prevPerson)=> ({
    ...prevPerson,
    Gendor: value, 
    GendorCaption: genderCaption,
  }));
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
          <select id="gender" name="Gendor" value={person.Gendor} onChange={handleGendorChange} required>
            <option value="">Select Gender</option>
            <option value={0}>Male</option>
            <option value={1}>Female</option>
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
          <select  name="NationalityCountryID" value={person.NationalityCountryID} onChange={handleCountryChange}>
          <option value="" disabled>
          -- Choose a country --
          </option>
          {
          
            
            countries.map((country)=>{
             return <option value={country.CountryID} key={country.CountryID}>{country.CountyName}</option>
              
             
            })
          }

          </select>
          
          
          </div>
          <div className="form-group">
            <label htmlFor="countryImage">Person Image</label>
            <input type="file" id="countryImage" name="ImagePath" onChange={handleChange}/>
          </div>
        </div>
        <div className="form-group">
          <button type="submit">{id&&personOfRedux ? 'Update' : 'Add'} Person</button>
        </div>
      </form>
    </div>
  );
}

export default Add_Edit_Person