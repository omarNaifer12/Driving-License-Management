import React, { useState } from 'react';
import './Add_Edit_User.css';
import CptSearchForPerson from '../../componentsPersons/CptSearchForPerson/CptSearchForPerson';
import LoginInfo from './LoginInfo';
import { useSelector } from 'react-redux';
import { getDataAPI } from '../../../utils/fetchData';
import { useParams } from 'react-router-dom';

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const ArrowBackIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="#fff" fill="none"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const Add_Edit_User = () => {
  const person     = useSelector((state) => state.Persons.Person);
  const [step, setStep]         = useState(1);
  const [checking, setChecking] = useState(false);
const {UserID,PersonID}=useParams()
  const personSelected = Boolean(person.PersonID);

  const handleNext = async () => {
    
    
    if(PersonID){
      setStep(2);
      return;
    }
    setChecking(true);
    try {
      const response = await getDataAPI(`Users/checkPersonAcc/${person.PersonID}`);
      if (response.data.hasAccount) {
        alert('This person already has a user account.');
      } else {
        setStep(2);
      }
    } catch (error) {
      console.error('Error checking person account:', error);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="add-edit-user-container">

      {/* ── Page heading ── */}
      <div>
        <h1> {UserID?"EDIT":"ADD"} User</h1>
      </div>

      {/* ── Step indicator ── */}
      <div className="aeu-steps">
        <div className={`aeu-step ${step === 1 ? 'aeu-step--active' : 'aeu-step--done'}`}>
          <div className="aeu-step__circle">{step > 1 ? <CheckIcon /> : '1'}</div>
          <span className="aeu-step__label">Find Person</span>
        </div>
        <div className={`aeu-step__line${step > 1 ? ' aeu-step__line--done' : ''}`} />
        <div className={`aeu-step${step === 2 ? ' aeu-step--active' : ''}`}>
          <div className="aeu-step__circle">2</div>
          <span className="aeu-step__label">Account Info</span>
        </div>
      </div>

      {/* ══════════════ STEP 1 ══════════════ */}
      {step === 1 && (
        <>
          <CptSearchForPerson PersonID={PersonID??person.PersonID} readOnly={PersonID?true:false}/>

          {(personSelected||PersonID) && (
            <button className="next-button" onClick={handleNext} disabled={checking}>
              {checking ? 'Checking…' : 'Next'}
              {!checking && <ArrowIcon />}
            </button>
          )}
        </>
      )}

      {/* ══════════════ STEP 2 ══════════════ */}
      {step === 2 && (
        <>
          {/* back link */}
          <button className="back-button" onClick={() => setStep(1)}>
            <ArrowBackIcon /> Back to Search
          </button>

          {/* who we're creating an account for */}
          <div className="aeu-person-strip">
            <div className="aeu-person-strip__avatar">
              {person.FirstName?.[0]}{person.LastName?.[0]}
            </div>
            <div>
              <div className="aeu-person-strip__name">
                {[person.FirstName, person.SecondName, person.ThirdName, person.LastName]
                  .filter(Boolean).join(' ')}
              </div>
              <div className="aeu-person-strip__id">Person ID: {person.PersonID}</div>
            </div>
          </div>

          {/* inline credentials form — no navigation needed */}
          <LoginInfo id={UserID??undefined}/>
        </>
      )}

    </div>
  );
};

export default Add_Edit_User;