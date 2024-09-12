import React from 'react'
import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios"
export const StoreContext=createContext(null);
const StoreContextProvider=({children})=>{
  
  const [searchId, setSearchId] = useState(undefined);
    const[person,setPerson] =useState({
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
        ImagePath: '',
      })
      const [user,setUser]=useState({
        PersonID: "",
        Password: "",
        FullName: "John Doe",
        UserName: "",
        isActive: false
  
      })
const getPersonById=async(id)=>{
        try{
          const response = await axios.get(`http://localhost:3000/people/${id}`);
          setPerson(response.data);
         
          return true;
        }catch(error){
          console.log('Error fetching person:',error);
        return false;
        }
      };
      const getUserById=async(id)=>{
        try{
          const response = await axios.get(`http://localhost:3000/users/${id}`);
          console.log("responsedata ",response.data);
          setUser(response.data);
         
          return response.data;
        }catch(error){
          console.log('Error fetching user:',error);
        return false;
        }
      };
      const [users, setUsers] = useState([]);
     
      useEffect(() => {
        const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/users');
            setUsers(response.data);
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        };
        fetchUsers();
      },[]);
    const contextValue={
    getPersonById,
    person,
    setPerson,
    searchId,
    setSearchId,
    getUserById,
    user,
    setUser,
    users,
    setUsers,
    }
    return(
    <StoreContext.Provider value={contextValue}>
    {children}
    </StoreContext.Provider>
    )
}

export default StoreContextProvider