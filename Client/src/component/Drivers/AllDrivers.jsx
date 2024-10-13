import React, { useEffect, useState } from 'react'
import { getDataAPI } from '../../utils/fetchData';

const AllDrivers = () => {
    const [Drivers,setDrivers]=useState([]);
    useEffect(()=>{
const fetchDrivers=async()=>{
    try {
        const response=await getDataAPI("Drivers/GetAllDrivers");
        setDrivers(response.data);
    } catch (error) {
        console.log("error",error);
        
    }
}
fetchDrivers();
    },[])
  return (
    <div className="all-drivers-container">
    <h1 className="heading">All Drivers</h1>
    <div className="drivers-list">
        {Drivers.map((driver) => (
            <div key={driver.DriverID} className="driver-card">
                <h2 className="driver-name">{driver.FullName}</h2>
                <p className="driver-details">
                    <strong>National No:</strong> {driver.NationalNo}
                </p>
                <p className="driver-details">
                    <strong>Person ID:</strong> {driver.PersonID}
                </p>
                <p className="driver-details">
                    <strong>Created Date:</strong> {new Date(driver.CreatedDate).toLocaleDateString()}
                </p>
                <p className="driver-details">
                    <strong>Active Licenses:</strong> {driver.NumberOfActiveLicenses}
                </p>
            </div>
        ))}
    </div>
</div>
  )
}

export default AllDrivers