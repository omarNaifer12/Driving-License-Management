import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TestType.css';

const TestType = () => {
  const [testTypes, setTestTypes] = useState([]);
  const [editingTest, setEditingTest] = useState(null);
  const [formData, setFormData] = useState({ id: '', TestTypeTitle: '', TestTypeDescription: '', TestTypeFees: '' });

  useEffect(() => {
    fetchTestTypes();
  }, []);

  const fetchTestTypes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/TestType');
      setTestTypes(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEditClick = (test) => {
    setEditingTest(test.id);
    setFormData(test);
  };

  const handleCloseClick = () => {
    setEditingTest(null);
    setFormData({ id: '', TestTypeTitle: '', TestTypeDescription: '', TestTypeFees: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/TestType/${formData.id}`, formData);
      fetchTestTypes();
      handleCloseClick();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <div className="test-type-container">
      <h1>Test Types</h1>
      <table className="test-type-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Fees</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {testTypes.map((test) => (
            <tr key={test.id}>
              <td>{test.id}</td>
              <td>{test.TestTypeTitle}</td>
              <td>{test.TestTypeDescription}</td>
              <td>${test.TestTypeFees}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditClick(test)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingTest && (
        <div className="modal">
          <div className="update-form">
            <form onSubmit={handleUpdate}>
              <h2>Update Test Type</h2>
              <label>
                Title:
                <input
                  type="text"
                  name="TestTypeTitle"
                  value={formData.TestTypeTitle}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </label>
              <br />
              <label>
                Description:
                <input
                  type="text"
                  name="TestTypeDescription"
                  value={formData.TestTypeDescription}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </label>
              <br />
              <label>
                Fees:
                <input
                  type="number"
                  name="TestTypeFees"
                  value={formData.TestTypeFees}
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
};

export default TestType;
