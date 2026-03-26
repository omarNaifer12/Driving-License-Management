import React,{useState,useEffect} from 'react'
import "./ApplicationType.css"
import axios from "axios"
import { BASE_URL } from '../../utils/config'
const ApplicationType = () => {
    const [applicationTypes, setApplicationTypes] = useState([]);
  const [editingApplication, setEditingApplication] = useState(null);
  const [formData, setFormData] = useState({ ApplicationTypeID: '', ApplicationTypeTitle: '', ApplicationFees: '' });

  useEffect(() => {
    fetchApplicationTypes();
  }, []);

  const fetchApplicationTypes = async () => {
    try {
      console.log("before fetch app type");
      
      const response = await axios.get(BASE_URL+'/api/ApplicationType/All');
console.log("response of application type list",response.data);

      setApplicationTypes(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEditClick = (application) => {
    setEditingApplication(application.ApplicationTypeID);
    setFormData(application);
  };

  const handleCloseClick = () => {
    setEditingApplication(null);
    setFormData({ ApplicationTypeID: '', ApplicationTypeTitle: '', ApplicationFees: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/ApplicationType/${formData.ApplicationTypeID}`, formData);
      fetchApplicationTypes();
      handleCloseClick();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Application Types</h1>
      <table className="app-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Fees</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applicationTypes.map((application) => (
            <tr key={application.ApplicationTypeID}>
              <td>{application.ApplicationTypeID}</td>
              <td>{application.ApplicationTypeTitle}</td>
              <td>${application.ApplicationFees}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditClick(application)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingApplication && (
        <div className="modal">
          <div className="update-form">
            <form onSubmit={handleUpdate}>
              <h2>Update Application Type</h2>
              <label>
                Title:
                <input
                  type="text"
                  name="ApplicationTypeTitle"
                  value={formData.ApplicationTypeTitle}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </label>
              <br />
              <label>
                Fees:
                <input
                  type="number"
                  name="ApplicationFees"
                  value={formData.ApplicationFees}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </label>
              <br />
              <button type="submit" className="update-btn">Update</button>
              <span className="close-btn" onClick={handleCloseClick}>❌</span>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationType