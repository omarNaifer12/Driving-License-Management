import React, { useEffect, useState } from 'react';
import './people.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deletePersonAction } from '../../../Redux/Actions/peopleAction';
import { deleteDataAPI, getDataAPI } from '../../../utils/fetchData';

/* ── icons ── */
const PlusIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
);
const InfoIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

/* ── sub-components ── */
const ConfirmModal = ({ name, onConfirm, onCancel }) => (
  <div className="confirm-overlay" onClick={onCancel}>
    <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
      <div className="confirm-modal__header">
        <div className="confirm-modal__icon"><AlertIcon /></div>
        <span className="confirm-modal__title">Delete Person</span>
      </div>
      <div className="confirm-modal__body">
        <p>Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.</p>
        <div className="confirm-modal__actions">
          <button className="confirm-modal__cancel" onClick={onCancel}>Cancel</button>
          <button className="confirm-modal__confirm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  </div>
);

const Toast = ({ message, type }) =>
  message ? (
    <div className={`lp-toast lp-toast--${type}`}>
      {type === 'success' ? <CheckIcon /> : <XIcon />}
      {message}
    </div>
  ) : null;

/* ── main ── */
function ListPersons() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const [persons, setPersons]           = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null); // { PersonID, name }
  const [toast, setToast]               = useState({ message: '', type: 'success' });

  useEffect(() => { getAllPeople(); }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  const getAllPeople = async () => {
    try {
      const response = await getDataAPI('Persons/All');
      setPersons(response.data);
    } catch (error) {
      console.error('Error fetching persons:', error);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteDataAPI(`Persons/Delete/${pendingDelete.PersonID}`);
      dispatch(deletePersonAction(pendingDelete.PersonID));
      setPersons((prev) => prev.filter((p) => p.PersonID !== pendingDelete.PersonID));
      showToast('Person deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting person:', error);
      showToast('Failed to delete person', 'error');
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <>
      <div className="person-list">
        {/* top bar */}
        <div className="person-list__topbar">
          <div>
            <h1>Manage People</h1>
            <p className="person-list__sub">{persons.length} person{persons.length !== 1 ? 's' : ''} registered</p>
          </div>
          <button className="person-add-button" onClick={() => navigate('/add-Person')}>
            <PlusIcon /> Add Person
          </button>
        </div>

        {/* table */}
        <div className="person-table-wrap">
          <table className="person-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Second Name</th>
                <th>Third Name</th>
                <th>Last Name</th>
                <th>National No</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Nationality</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {persons.map((person, index) => (
                <tr key={person.PersonID ?? index}>
                  <td className="muted">{person.PersonID}</td>

                  <td>{person.FirstName}</td>
                  <td className="muted">{person.SecondName}</td>
                  <td className="muted">{person.ThirdName}</td>
                  <td><strong>{person.LastName}</strong></td>
                  <td className="muted">{person.NationalNo}</td>
                  <td className="muted">{person.DateOfBirth}</td>
                  <td>{person.GendorCaption}</td>
                  <td className="muted">{person.Address}</td>
                  <td>{person.Phone}</td>
                  <td>{person.Email}</td>
                  <td>{person.CountryName}</td>
                  <td>
                    <div className="person-actions">
                      <button className="btn-action edit-button"
                        onClick={() => navigate(`/edit-Person/${person.PersonID}`)}>
                        <EditIcon /> Edit
                      </button>
                      <button className="btn-action delete-button"
                        onClick={() => setPendingDelete({ PersonID: person.PersonID, name: `${person.FirstName} ${person.LastName}` })}>
                        <TrashIcon /> Delete
                      </button>
                      <button className="btn-action details-button"
                        onClick={() => navigate(`/Person-details/${person.PersonID}`)}>
                        <InfoIcon /> Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pendingDelete && (
        <ConfirmModal
          name={pendingDelete.name}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      <Toast message={toast.message} type={toast.type} />
    </>
  );
}

export default ListPersons;