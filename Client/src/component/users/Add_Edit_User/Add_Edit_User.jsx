import React,{useContext, useState} from 'react'
import { useNavigate, Outlet } from 'react-router-dom';
import CptSearchForPerson from '../../componentsPersons/CptSearchForPerson/CptSearchForPerson';
import LoginInfo from './LoginInfo';
import { StoreContext } from '../../../context/storeContext';
import "./Add_Edit_User.css"
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../../../utils/config';
import { getDataAPI } from '../../../utils/fetchData';
const Add_Edit_User = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('personal-info');
    const person=useSelector((state)=>state.Persons.Person)
    const handleTabChange = (tab) => {
      setActiveTab(tab);
    };  
    const PersonCantCreateOtherAccUser=async()=>{
      try{
        const response=await getDataAPI(`Users/checkPersonAcc/${person.PersonID}`)
        if(response.data.hasAccount){
          alert("this person is already have user account");
        }
        else{
          navigate('/add-users-login')

        }

      }
      catch(error)
      {
        console.log("error person account ",error);
        

      }

    }
    return(
      <div className="add-edit-user-container">
      <h1>Add/Edit User</h1>
      {activeTab==='personal-info' && <CptSearchForPerson />}
      {person.PersonID && (
        <button className="next-button" onClick={PersonCantCreateOtherAccUser }>
          Next
        </button>
      )}
    </div>
  );
}

export default Add_Edit_User