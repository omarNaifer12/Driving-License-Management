import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ResetLicenseID, setLicenseID } from '../../../../Redux/Actions/LicensesAction';
import CptLicenseDtails from '../CptLicenseDtails/CptLicenseDtails';
import { useParams } from 'react-router-dom';

const CptLicenseDetailsBySearch=({LicenseID})=>{
    const dispatch=useDispatch();
    const [searchedID,setSearchedID]=useState(0);
    const [isReadOnly,setIsReadOnly]=useState(false);
    const handleInputChange = (e) => {
        const id = e.target.value.replace(/\D/g,''); 
        setSearchedID(id !==''?parseInt(id, 10):0); 
      };
      const handleButtonClick = () => {
        dispatch(setLicenseID(searchedID));
      };
    useEffect(()=>{
      if(LicenseID){
        dispatch(setLicenseID(parseInt(LicenseID, 10)));
        setSearchedID(LicenseID);
        setIsReadOnly(true);

      }
      else{
dispatch(ResetLicenseID());
setIsReadOnly(false);      
}    
},[LicenseID])
  return (
    <div>
      <input 
        type="text"
        value={searchedID?searchedID:''}
        onChange={handleInputChange}
        placeholder="Enter License ID" 
        readOnly={isReadOnly}
      />
      <button readOnly={isReadOnly} onClick={handleButtonClick}>Submit</button> 
      <CptLicenseDtails />
    </div>
  )
}

export default CptLicenseDetailsBySearch