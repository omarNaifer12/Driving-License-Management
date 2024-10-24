import React, { useEffect, useState } from 'react'
import "./AllDetainedLicenses.css"
import { getDataAPI } from '../../../../../utils/fetchData';
const AllDetainedLicenses = () => {
  const [detainLicenses, setDetainLicenses] = useState([]);

  useEffect(() => {
    const fetchDetainLicenses = async () => {
      try {
        const response = await getDataAPI("DetainedLicenses/All");
        setDetainLicenses(response.data);
      } catch (error) {
        console.error("Error fetching detained licenses", error);
      }
    };

    fetchDetainLicenses();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Detained Licenses</h1>
      <table className="detained-licenses-table">
        <thead>
          <tr>
            <th>National No</th>
            <th>Full Name</th>
            <th>Detain ID</th>
            <th>License ID</th>
            <th>Detain Date</th>
            <th>Fine Fees</th>
            <th>Created By User ID</th>
            <th>Is Released</th>
            <th>Release Date</th>
            <th>Released By User ID</th>
            <th>Release Application ID</th>
          </tr>
        </thead>
        <tbody>
          {detainLicenses.map((license) => (
            <tr key={license.DetainID}>
              <td>{license.NationalNo}</td>
              <td>{license.FullName}</td>
              <td>{license.DetainID}</td>
              <td>{license.LicenseID}</td>
              <td>{new Date(license.DetainDate).toLocaleDateString()}</td>
              <td>{license.FineFees}$</td>
              <td>{license.CreatedByUserID}</td>
              <td>{license.IsReleased ? 'Yes' : 'No'}</td>
              <td>{license.IsReleased ? new Date(license.ReleaseDate).toLocaleDateString() : 'N/A'}</td>
              <td>{license.ReleasedByUserID}</td>
              <td>{license.ReleaseApplicationID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default AllDetainedLicenses