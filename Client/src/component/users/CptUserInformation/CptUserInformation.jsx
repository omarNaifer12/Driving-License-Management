import React, { useContext,useEffect } from 'react'
import "./CptUserInformation.css"
import { StoreContext } from '../../../context/storeContext'
import CptPersonInformation from '../../componentsPersons/CptPersonInformation/CptPersonInformation';
import { useParams } from 'react-router-dom';
const CptUserInformation = ({userID}) => {
   const {id}=useParams();

    const{user,setUser,getUserById}=useContext(StoreContext);
    useEffect(()=>{
        const fetchUser=async()=>{
          
            setUser({
                PersonID: "",
                Password: "",
                FullName: "John Doe",
                UserName: "",
                isActive: false
            });
         const ID=userID?userID:id; 
    if(ID){ 
    const respnse= await getUserById(ID);
    console.log("resonseda",respnse);
    if(!respnse){
      alert(" error user id ");
    }
    }
   
    };
    fetchUser();
    },[userID,id]);
  return (
    <div className="user-info-container">
      <CptPersonInformation id={user.PersonID} />
      <div className="user-details">
        <div className="user-detail">
          <strong>User ID:</strong> {user.id ? user.id : '????'}
        </div>
        <div className="user-detail">
          <strong>Username:</strong> {user.id ? user.UserName : '????'}
        </div>
        <div className="user-detail">
          <strong>Active Status:</strong> {user.id?user.isActive ? 'true' : 'false':'????'}
        </div>
      </div>
    </div>
  )
}

export default CptUserInformation