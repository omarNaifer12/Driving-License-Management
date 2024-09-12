import React,{useState,useEffect} from 'react'
import "./ApplicationType.css"
import axios from "axios"
const ApplicationType = () => {
    const [applicationTypes, setApplicationTypes] = useState([]);
  const [editingApplication, setEditingApplication] = useState(null);
  const [formData, setFormData] = useState({ id: '', ApplicationTypeTitle: '', ApplicationFees: '' });

  useEffect(() => {
    fetchApplicationTypes();
  }, []);

  const fetchApplicationTypes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/ApplicationType');
      setApplicationTypes(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEditClick = (application) => {
    setEditingApplication(application.id);
    setFormData(application);
  };

  const handleCloseClick = () => {
    setEditingApplication(null);
    setFormData({ id: '', ApplicationTypeTitle: '', ApplicationFees: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/ApplicationType/${formData.id}`, formData);
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
            <tr key={application.id}>
              <td>{application.id}</td>
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