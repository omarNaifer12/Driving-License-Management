import React,{ useState } from 'react'
import "./SearchOnPersonAndAddLocalDrivingLicense.css"
import CptPersonInformation from '../../componentsPersons/CptPersonInformation/CptPersonInformation';
import { useSelector } from 'react-redux';
import Add_EditLocalDrivingLicense from './Add_EditLocalDrivingLicense';
import CptSearchForPerson from '../../componentsPersons/CptSearchForPerson/CptSearchForPerson';
const  SearchOnPersonAndAddLocalDrivingLicense = () => {
const [showPageAddLocalDrivingLicense,setShowPageAddLocalDrivingLicense]=useState(false);
  const personFromRedux=useSelector((state)=>state.Persons.Person);

    return (
        <div className="container">
        {!showPageAddLocalDrivingLicense && (
            <div className="person-info-section">
                <CptSearchForPerson />
                {personFromRedux.PersonID? (
                    <button className="next-button" onClick={() => setShowPageAddLocalDrivingLicense(true)}>
                        Next
                    </button>
                ):<></>}
            </div>
        )}
        <div className="form-section">
            {showPageAddLocalDrivingLicense && <Add_EditLocalDrivingLicense />}
        </div>
    </div>
  )
}

export default SearchOnPersonAndAddLocalDrivingLicense