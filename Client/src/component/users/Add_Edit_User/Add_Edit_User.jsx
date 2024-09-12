import React,{useContext, useState} from 'react'
import { useNavigate, Outlet } from 'react-router-dom';
import CptSearchForPerson from '../../componentsPersons/CptSearchForPerson/CptSearchForPerson';
import LoginInfo from './LoginInfo';
import { StoreContext } from '../../../context/storeContext';
import "./Add_Edit_User.css"
const Add_Edit_User = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('personal-info');
    const {person}=useContext(StoreContext);
    const handleTabChange = (tab) => {
      setActiveTab(tab);
     
    };  

    
    
    return(
      <div className="add-edit-user-container">
      <h1>Add/Edit User</h1>
      {activeTab === 'personal-info' && <CptSearchForPerson />}
      {person.id && (
        <button className="next-button" onClick={() => navigate('/add-users-login')}>
          Next
        </button>
      )}
    </div>
  );
}

export default Add_Edit_User