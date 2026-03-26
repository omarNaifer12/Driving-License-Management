import React, { useEffect, useState } from 'react';
import './AllDetainedLicenses.css';
import { getDataAPI } from '../../../../../utils/fetchData';

const AllDetainedLicenses = () => {
  const [licenses, setLicenses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDataAPI('DetainedLicenses/All');
        setLicenses(response.data);
      } catch (error) {
        console.error('Error fetching detained licenses:', error);
      }
    };
    fetchData();
  }, []);

  const detained  = licenses.filter((l) => !l.IsReleased).length;
  const released  = licenses.filter((l) =>  l.IsReleased).length;

  const safeDate = (raw) => {
    try { return new Date(raw).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); }
    catch { return 'N/A'; }
  };

  return (
    <div className="all-detained-container">
      {/* top bar */}
      <div className="all-detained-topbar">
        <div>
          <h1>Detained Licenses</h1>
          <p className="all-detained-topbar__sub">
            {licenses.length} total · {detained} detained · {released} released
          </p>
        </div>
      </div>

      {/* table */}
      <div className="all-detained-table-wrap">
        <table className="detained-licenses-table">
          <thead>
            <tr>
              <th>National No</th>
              <th>Full Name</th>
              <th>Detain ID</th>
              <th>License ID</th>
              <th>Detain Date</th>
              <th>Fine Fees</th>
              <th>Created By</th>
              <th>Status</th>
              <th>Release Date</th>
              <th>Released By UserId</th>
              <th>Release App ID</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((lic) => (
              <tr key={lic.DetainID}>
                <td className="muted">{lic.NationalNo}</td>
                <td><strong>{lic.FullName}</strong></td>
                <td className="muted">{lic.DetainID}</td>
                <td className="muted">{lic.LicenseID}</td>
                <td className="muted">{safeDate(lic.DetainDate)}</td>
                <td>
                  <span className="detained-fees">${lic.FineFees}</span>
                </td>
                <td className="muted">{lic.CreatedByUserID}</td>
                <td>
                  <span className={`detained-pill detained-pill--${lic.IsReleased ? 'released' : 'active'}`}>
                    {lic.IsReleased ? 'Released' : 'Detained'}
                  </span>
                </td>
                <td className="muted">
                  {lic.IsReleased ? safeDate(lic.ReleaseDate) : '—'}
                </td>
                <td className="muted">{lic.ReleasedByUserID || '—'}</td>
                <td className="muted">{lic.ReleaseApplicationID || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllDetainedLicenses;