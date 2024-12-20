import React from 'react'
import ListPersons from './component/componentsPersons/ListPerson/ListPersons'
import { Route,Routes } from 'react-router-dom';
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
import AllLocalDrivingApplication from './component/LocalDrivingApplication/AllLocalDrivingApplication';
import SearchOnPersonAndAddLocalDrivingLicense from './component/LocalDrivingApplication/Add_EditLocalDrivingLicense/SearchOnPersonAndAddLocalDrivingLicense';
import Add_EditLocalDrivingLicense from './component/LocalDrivingApplication/Add_EditLocalDrivingLicense/Add_EditLocalDrivingLicense';
import CptLocalDrivingApplicationDetails from './component/LocalDrivingApplication/CptLocalDrivingApplicationDetails/CptLocalDrivingApplicationDetails';
import TestAppointmentsForTestType from './component/Tests/TestAppointments/TestAppointmentsForTestType/TestAppointmentsForTestType';
import Add_EditTestAppointments from './component/Tests/TestAppointments/Add_EditTestAppointments/Add_EditTestAppointments';
import Pass_Fail_TestApointment from './component/Tests/TestAppointments/Pass_Fail_TestApointment/Pass_Fail_TestApointment';
import IssueLocalDrivingLicenseFirstTime from './component/Licenses/LocalLicenses/IssueLocalDrivingLicenseFirstTime/IssueLocalDrivingLicenseFirstTime';
import CptLicenseDtails from './component/Licenses/LocalLicenses/CptLicenseDtails/CptLicenseDtails';
import InternationalLicenseDetails from './component/Licenses/InternationalLicenses/InternationalLicenseDetails/InternationalLicenseDetails';
import AddInternationalLicense from './component/Licenses/InternationalLicenses/AddInternationalLicense/AddInternationalLicense';
import RenewLocalLicense from './component/Licenses/LocalLicenses/RenewLocalLicense/RenewLocalLicense';
import ReplacemenetDamagedOrLostLicense from './component/Licenses/ReplacemenetDamagedOrLostLicense/ReplacemenetDamagedOrLostLicense';
import ReleaseLicense from './component/Licenses/LocalLicenses/DetainedLicense/ReleaseLicense/ReleaseLicense';
import DetainLicense from './component/Licenses/LocalLicenses/DetainedLicense/DetainLicense/DetainLicense';
import AllDrivers from './component/Drivers/AllDrivers';
import AllDetainedLicenses from './component/Licenses/LocalLicenses/DetainedLicense/AllDetainedLicenses/AllDetainedLicenses';
import PersonLicensesHistory from './component/Licenses/PersonLicensesHistory/PersonLicensesHistory';
const App=() => {
  return (
    <div>
 <Routes>
 <Route path='/people/page/:newPage' element={<ListPersons />} />     
 <Route path='/add-Person' element={<Add_Edit_Person />} />     
 <Route path='/edit-Person/:id' element={<Add_Edit_Person />} />     
 <Route path='/Person-details/:id' element={<PersonDetails />} />     
 <Route path='/all-users' element={<AllUsers />} />     
 <Route path='/add-users' element={<Add_Edit_User />} />     
 <Route path='/add-users-login' element={<LoginInfo />} />     
 <Route path='/change-password/:id' element={<ChangePassword />} />     
 <Route path='/user-details/:id' element={<CptUserInformation />} />     
 <Route path='/' element={<Home />} />     
 <Route path='/navbar' element={<Navbar />} />     
 <Route path='/loginForm' element={<LoginForm />} />   
 <Route path='/Application-type' element={<ApplicationType />} />   
 <Route path='/Test-type' element={<TestType />}/>
 <Route path='/edit-users/:id' element={<LoginInfo />} />    
 <Route path='/AllLocalDrivingLicense' element={<AllLocalDrivingApplication />} />    
 <Route path='/AddLocalDrivingLicense' element={<SearchOnPersonAndAddLocalDrivingLicense/>} />    
 <Route path='/UpdateLocalDrivingLicense/:id' element={<Add_EditLocalDrivingLicense/>} />
 <Route path='/LocalDrivingLicenseDetails' element={<CptLocalDrivingApplicationDetails/>} />
 
 <Route path='/TestAppointmentsForTestType/:localDrivingLicenseID/:CountPassedTest' element={<TestAppointmentsForTestType/>} />
 <Route path='/Add-Test-Appointments' element={<Add_EditTestAppointments/>} />
 
 <Route path='/pass-fail-TestAppointment/:TestAppointmentID' element={<Pass_Fail_TestApointment/>} />
 <Route path='/Issue-Local-Driving-License-FirstTime/:id' element={<IssueLocalDrivingLicenseFirstTime/>} />
 <Route path='/license-details' element={<CptLicenseDtails/>}/>
 <Route path='/International-license-details/:InaternationalLicenseID' element={<InternationalLicenseDetails/>} />
 <Route path='/issue-International-license' element={<AddInternationalLicense/>}/>
 <Route path='/Renew-License' element={<RenewLocalLicense />}/>
 <Route path='/replacement-lost-damaged-License' element={<ReplacemenetDamagedOrLostLicense />}/>
 <Route path='/release-License' element={<ReleaseLicense />}/>
 <Route path='/detain-License' element={<DetainLicense />}/>
 <Route path='/drivers' element={<AllDrivers />}/>
 <Route path='/All-Detained-License' element={<AllDetainedLicenses />}/>
 <Route path='/Person-Licenses-History/:PersonID' element={<PersonLicensesHistory />}/>
  </Routes>
    </div>
    )
}

export default App