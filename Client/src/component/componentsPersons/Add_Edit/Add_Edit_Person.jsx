import React, { useState, useEffect, useMemo } from 'react';
import './Add_Edit_Person.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addPersonAction, editPersonAction, getOnePersonAction } from '../../../Redux/Actions/peopleAction';
import { getDataAPI, postDataAPI, putDataAPI } from '../../../utils/fetchData';

/* ── icons ── */
const IdIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const ContactIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.16h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.75a16 16 0 0 0 5.29 5.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const ImageIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
);
const SaveIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

/* ── toast ── */
const Toast = ({ message, type }) =>
  message ? (
    <div className={`aep-toast aep-toast--${type}`}>
      {type === 'success' ? <CheckIcon /> : <XIcon />}
      {message}
    </div>
  ) : null;

/* ── section wrapper ── */
const FormSection = ({ icon, title, children }) => (
  <div className="form-section">
    <div className="form-section__header">
      <div className="form-section__header-icon">{icon}</div>
      <span className="form-section__title">{title}</span>
    </div>
    <div className="form-section__body">{children}</div>
  </div>
);

/* ── main ── */
const Add_Edit_Person = () => {
  const { id }          = useParams();
  const navigate        = useNavigate();
  const personOfRedux   = useSelector((state) => state.Persons.Person);
  const dispatch        = useDispatch();

  const [person, setPerson] = useState({
    PersonID: 0, FirstName: '', SecondName: '', ThirdName: '', LastName: '',
    NationalNo: '', DateOfBirth:'', Gendor: 0, Address: '',
    Phone: '', Email: '', NationalityCountryID: 0,
    ImagePath: '', CountryName: '', GendorCaption: '',
  });
  const [countries, setCountries] = useState([]);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState({ message: '', type: 'success' });

  useEffect(() => {
    if (id !== undefined) dispatch(getOnePersonAction(id));
  }, [id, dispatch]);
console.log("personpersonperson details in update mode",person);

  useEffect(() => {
    if (id !== undefined && personOfRedux) setPerson(personOfRedux);
    fetchCountries();
  }, [id, personOfRedux]);

  const fetchCountries = async () => {
    try {
      const result = await getDataAPI('Countries/All');
      setCountries(result.data);
    } catch (ex) {
      console.error('Error fetching countries:', ex);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'ImagePath' && files?.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => setPerson(prev => ({ ...prev, ImagePath: reader.result }));
      reader.readAsDataURL(files[0]);
    } else if (name !== 'ImagePath') {
      setPerson(prev => ({ ...prev, [name]: value }));
    }
  };

  const countryNameMapping = useMemo(() => {
    const m = {};
    countries.forEach(c => { m[c.CountryID] = c.CountyName; });
    return m;
  }, [countries]);

  const handleCountryChange = (e) => {
    const value = e.target.value;
    setPerson(prev => ({ ...prev, NationalityCountryID: value, CountryName: countryNameMapping[value] }));
  };

  const handleGendorChange = (e) => {
    const value = e.target.value;
    setPerson(prev => ({ ...prev, Gendor: value, GendorCaption: value === '0' ? 'Male' : 'Female' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let response;
      if (id && personOfRedux) {
        response = await putDataAPI(`Persons/Update/${id}`, person);
        dispatch(editPersonAction(response.data));
        showToast('Person updated successfully', 'success');
      } else {
        response = await postDataAPI('Persons/Add', person);
        dispatch(addPersonAction(response.data));
        showToast('Person added successfully', 'success');
      }
    } catch (error) {
      console.error('Error saving person:', error);
      showToast('Failed to save. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const isEdit = Boolean(id && personOfRedux);

  return (
    <>
      <div className="form-container">
        <div>
          <h1>{isEdit ? 'Edit Person' : 'Add Person'}</h1>
          
        </div>

        <form className="person-form" onSubmit={handleSubmit}>

          {/* ── Identity ── */}
          <FormSection icon={<IdIcon />} title="Identity">
            <div className="form-row">
              <div className="form-group">
                <label>Person ID</label>
                <input type="text" name="PersonID" value={person.PersonID || ''} readOnly />
              </div>
              <div className="form-group">
                <label>National No</label>
                <input type="text" name="NationalNo" value={person.NationalNo} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" name="DateOfBirth" value={person.DateOfBirth?.split('T')[0] || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="Gendor" value={person.Gendor} onChange={handleGendorChange} required>
                  <option value="">Select gender</option>
                  <option value={0}>Male</option>
                  <option value={1}>Female</option>
                </select>
              </div>
            </div>
          </FormSection>

          {/* ── Full Name ── */}
          <FormSection icon={<UserIcon />} title="Full Name">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" name="FirstName" value={person.FirstName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Second Name</label>
                <input type="text" name="SecondName" value={person.SecondName} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Third Name</label>
                <input type="text" name="ThirdName" value={person.ThirdName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="LastName" value={person.LastName} onChange={handleChange} required />
              </div>
            </div>
          </FormSection>

          {/* ── Contact ── */}
          <FormSection icon={<ContactIcon />} title="Contact">
            <div className="form-group full-width">
              <label>Address</label>
              <input type="text" name="Address" value={person.Address} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" name="Phone" value={person.Phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="Email" value={person.Email} onChange={handleChange} required />
              </div>
            </div>
          </FormSection>

          {/* ── Nationality & Photo ── */}
          <FormSection icon={<GlobeIcon />} title="Nationality & Photo">
            <div className="form-row">
              <div className="form-group">
                <label>Country</label>
                <select name="NationalityCountryID" value={person.NationalityCountryID} onChange={handleCountryChange}>
                  <option value="" disabled>— Choose a country —</option>
                  {countries.map(c => (
                    <option value={c.CountryID} key={c.CountryID}>{c.CountyName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Person Photo</label>
                <input type="file" name="ImagePath" accept="image/*" onChange={handleChange} />
                {person.ImagePath && (
                  <div className="image-preview-wrap">
                    <img className="image-preview" src={person.ImagePath} alt="preview" />
                    <span className="image-preview-label">Preview</span>
                  </div>
                )}
              </div>
            </div>
          </FormSection>

          {/* ── Actions ── */}
          <div className="form-submit-row">
            <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={saving}>
              <SaveIcon />
              {saving ? 'Saving…' : isEdit ? 'Update Person' : 'Add Person'}
            </button>
          </div>

        </form>
      </div>

      <Toast message={toast.message} type={toast.type} />
    </>
  );
};

export default Add_Edit_Person;