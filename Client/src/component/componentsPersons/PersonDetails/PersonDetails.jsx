import React, {  } from 'react'
import "./PersonDetails.css"

import { useParams, useNavigate } from 'react-router-dom';
import CptPersonInformation from '../CptPersonInformation/CptPersonInformation'
const PersonDetails = () => {
    const {id}=useParams();
   

  
    return (
        <div className="person-details">
        <h1 className="person-details-label">Person Details</h1>
       <CptPersonInformation id={id}/>
      </div>
    );
}

export default PersonDetails