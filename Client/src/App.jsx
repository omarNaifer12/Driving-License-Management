import React from 'react'
import ListPersons from './component/componentsPersons/ListPerson/ListPersons'
import {   Route, Routes } from 'react-router-dom';
import Add_Edit_Person from './component/componentsPersons/Add_Edit/Add_Edit_Person';
import PersonDetails from './component/componentsPersons/PersonDetails/PersonDetails';
import AllUsers from './component/users/AllUsers/AllUsers';
import Add_Edit_User from './component/users/Add_Edit_User/Add_Edit_User';
import LoginInfo from './component/users/Add_Edit_User/LoginInfo';
import ChangePassword from './component/users/ChangePassword/ChangePassword';
import CptUserInformation from './component/users/CptUserInformation/CptUserInformation';
import Home from './component/Home/Home';
import Navbar from './component/Navbar/Navbar ';
import LoginForm from './component/LoginForm/LoginForm';
import ApplicationType from './component/ApplicationType/ApplicationType';
import TestType from './component/TestType/TestType';
const App = () => {
  return (
    <div>
      <Routes>
 <Route path='/all-people' element={<ListPersons />} />     
 <Route path='/add-Person' element={<Add_Edit_Person />} />     
 <Route path='/edit-Person/:id' element={<Add_Edit_Person />} />     
 <Route path='/Person-details/:id' element={<PersonDetails />} />     
 <Route path='/all-users' element={<AllUsers />} />     
 <Route path='/add-users' element={<Add_Edit_User />} />     
 <Route path='/add-users-login' element={<LoginInfo />} />     
 <Route path='/change-password/:id' element={<ChangePassword />} />     
 <Route path='/user-details/:id' element={<CptUserInformation />} />     
 <Route path='/Home' element={<Home />} />     
 <Route path='/navbar' element={<Navbar />} />     
 <Route path='/' element={<LoginForm />} />   
 <Route path='/Application-type' element={<ApplicationType />} />   
 <Route path='/Test-type' element={<TestType />} />   



      </Routes>
   
    </div>
  )
}

export default App