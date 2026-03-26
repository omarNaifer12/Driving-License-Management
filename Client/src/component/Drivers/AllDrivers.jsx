import React, { useEffect, useState } from 'react';
import './AllDrivers.css';
import { getDataAPI } from '../../utils/fetchData';

const initials = (name = '') =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

const DriverCard = ({ driver }) => (
  <div className="driver-card">
    <div className="driver-card__header">
      <div className="driver-card__avatar">{initials(driver.FullName)}</div>
      <div className="driver-card__name">{driver.FullName}</div>
    </div>
    <div className="driver-card__body">
      <div className="driver-card__row">
        <span className="driver-card__key">National No</span>
        <span className="driver-card__val">{driver.NationalNo}</span>
      </div>
      <div className="driver-card__row">
        <span className="driver-card__key">Person ID</span>
        <span className="driver-card__val">{driver.PersonID}</span>
      </div>
      <div className="driver-card__row">
        <span className="driver-card__key">Created</span>
        <span className="driver-card__val">
          {new Date(driver.CreatedDate).toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric',
          })}
        </span>
      </div>
      <div className="driver-card__row">
        <span className="driver-card__key">Active Licenses</span>
        <span className="driver-card__badge">{driver.NumberOfActiveLicenses}</span>
      </div>
    </div>
  </div>
);

const AllDrivers = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await getDataAPI('Drivers/GetAllDrivers');
        setDrivers(response.data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };
    fetchDrivers();
  }, []);

  return (
    <div className="all-drivers-container">
      <h1 className="heading">All Drivers</h1>
      <p className="heading-sub">{drivers.length} driver{drivers.length !== 1 ? 's' : ''} registered</p>
      <div className="drivers-list">
        {drivers.map((driver) => (
          <DriverCard key={driver.DriverID} driver={driver} />
        ))}
      </div>
    </div>
  );
};

export default AllDrivers;