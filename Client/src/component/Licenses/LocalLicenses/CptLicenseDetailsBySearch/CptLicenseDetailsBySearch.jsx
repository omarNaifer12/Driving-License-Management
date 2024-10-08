import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ResetLicenseID, setLicenseID } from '../../../../Redux/Actions/LicensesAction';
import CptLicenseDtails from '../CptLicenseDtails/CptLicenseDtails';

const CptLicenseDetailsBySearch = () => {
    const dispatch=useDispatch();
    const [searchedID,setSearchedID]=useState(0);
    const handleInputChange = (e) => {
        const id = e.target.value.replace(/\D/g, ''); 
        setSearchedID(id !== '' ? parseInt(id, 10) : 0); 
      };
      const handleButtonClick = () => {
        dispatch(setLicenseID(searchedID)); 
      };
    useEffect(()=>{
dispatch(ResetLicenseID());

    },[])
  return (
    <div>
      <input 
        type="text" 
        onChange={handleInputChange} 
        placeholder="Enter License ID" 
      />
      <button onClick={handleButtonClick}>Submit</button> 
      <CptLicenseDtails />
    </div>
  )
}

export default CptLicenseDetailsBySearch