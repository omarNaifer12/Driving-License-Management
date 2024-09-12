import React,{useContext, useState} from 'react'

import CptPersonInformation from '../CptPersonInformation/CptPersonInformation'
import { StoreContext } from '../../../context/storeContext';
import "./CptSearchForPerson.css"

const CptSearchForPerson = () => {
  const [inputId, setInputId] = useState('');
  const { searchId, setSearchId } = useContext(StoreContext);

  const handleSearch = () => {
    setSearchId(inputId);
  };

  return (
    <div className="search-for-person-container">
      <div className="search-section">
        <h2>Search by ID</h2>
        <input
          type="text"
          placeholder="Enter ID"
          onChange={(e) => setInputId(e.target.value)}
          value={inputId}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <CptPersonInformation id={searchId} />
      <div className="additional-content"></div>
    </div>
  );
}

export default CptSearchForPerson