import React, { useEffect } from 'react';
import './CptPersonInformation.css';
import { useDispatch, useSelector } from 'react-redux';
import { getOnePersonAction, ResetPersonData } from '../../../Redux/Actions/peopleAction';

const Field = ({ label, value }) => (
  <div className="person-info__field">
    <div className="person-info__field-key">{label}</div>
    <div className={`person-info__field-val${!value ? ' person-info__field-val--empty' : ''}`}>
      {value || '—'}
    </div>
  </div>
);

const CptPersonInformation = ({ id }) => {
  const person = useSelector((state) => state.Persons.Person);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ResetPersonData());
    if (id) dispatch(getOnePersonAction(id));
  }, [id, dispatch]);

  const loaded = person.PersonID && id;
  const fullName = loaded
    ? [person.FirstName, person.SecondName, person.ThirdName, person.LastName]
        .filter(Boolean)
        .join(' ')
    : null;

  return (
    <div className="person-info">
      {/* ── Header ── */}
      <div className="person-info__header">
        <div className="person-info__avatar-wrap">
          <img
            src={loaded ? person.ImagePath : ''}
            alt={fullName || 'Person'}
          />
        </div>
        <div className="person-info__headline">
          <div className="person-info__label">Person Information</div>
          <div className="person-info__name">{fullName || '— — — —'}</div>
        </div>
      </div>

      {/* ── Fields ── */}
      <div className="person-info__body">
        <div className="person-info__grid">
          <Field label="Person ID"    value={loaded ? person.PersonID   : null} />
          <Field label="National No"  value={loaded ? person.NationalNo : null} />
          <Field label="First Name"   value={loaded ? person.FirstName  : null} />
          <Field label="Second Name"  value={loaded ? person.SecondName : null} />
          <Field label="Third Name"   value={loaded ? person.ThirdName  : null} />
          <Field label="Last Name"    value={loaded ? person.LastName   : null} />
          <Field label="Date of Birth" value={loaded ? person.DateOfBirth    : null} />
          <Field label="Gender"       value={loaded ? person.GendorCaption   : null} />
          <Field label="Phone"        value={loaded ? person.Phone           : null} />
          <Field label="Email"        value={loaded ? person.Email           : null} />
          <Field label="Nationality"  value={loaded ? person.CountryName     : null} />
          <Field label="Address"      value={loaded ? person.Address         : null} />
        </div>
      </div>
    </div>
  );
};

export default CptPersonInformation;