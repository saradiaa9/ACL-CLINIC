// App.js
import { React, useState, useEffect }from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Axios from 'axios';
import { useAuthContext } from './Hooks/useAuthContext';
// Doctor Pages
import Contract from './Pages/Doctor/Contract';
import AddTimeSlots from './Pages/Doctor/AddTimeSlots';
import VideoRoom from './Components/VideoRoom';
import EmailForm from './Components/EmailForm';
import DoctorAppointments from './Pages/Doctor/DoctorAppointments';
import DoctorDashboard from './Pages/Doctor/DoctorDashboard';
import Patient from './Pages/Doctor/Patient';
import Patients from './Pages/Doctor/Patients';
import Followup from './Pages/Doctor/Followups';
import DoctorNotifications from './Pages/extra/doctor/DoctorNotifications';
// Patient Pages
import AddFamily from './Pages/Patient/AddFamily';
import DoctorsPage from './Pages/Patient/Doctors';
import PatientDashboard from './Pages/Patient/PatientDashboard';
import Notifications from './Pages/Patient/Notifications';
import HealthRecords from './Pages/Patient/HealthRecords'; 

import PatientPrescription from './Pages/Patient/Prescription.jsx';
import Package from './Pages/Packages/package';
import Doctor from './Pages/Patient/Doctor';
import VideoCall from './Pages/Patient/VideoCall';
// User Pages
import Login from './Pages/Authentication/Login';
import SignUp from './Pages/Authentication/Signup/Signup.jsx';
import DoctorChat from './Components/DoctorChat';




import PatientAppointments from './Pages/Patient/Appointments.js';
import PatientHealthRecords from './Pages/Patient/HealthRecords.js';
import Appointment from './Pages/Patient/Appointments.js';
//Prescription
import Prescription from './Pages/Patient/Prescription.jsx';


//Package
import PackageList from  './Pages/Packages/viewPackages';
import FamilyMemberPage from "./Pages/Packages/PayFamily.jsx"; 
import PayPatient from './Pages/Packages/PayPatient';


// Components
import Navbar from './Components/Navbar';
import AdminSidebar from './Components/AdminSidebar';
import DoctorSidebar from './Components/DoctorSidebar';


import ChangePass from './Pages/Authentication/ChangePass';
import Status from './Pages/Doctor/Status.jsx';
import Remove from './Pages/Admin/Remove';
import ViewUsersList from './Pages/Admin/ViewUsersList';
import AddAdmin from './Pages/Admin/AddAdmin';
import ForgotPassword from './Pages/Authentication/ForgotPassword/ForgotPassword';
import AddPackage from './Pages/Admin/AddPackage';
import DeletePackage from './Pages/Admin/DeletePackage';
import UpdatePackage from './Pages/Admin/UpdatePackage';
import DoctorDocuments from './Pages/Doctor/DoctorDocuments';
import PatientChat from './Components/PatientChat';

import PatientSidebar from './Components/PatientSidebar';

// Pages
import Applicants from './Pages/Admin/Applicants';




function App() {
  const [joined, setJoined] = useState(false);
  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (user) {
      Axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }

    
  }, [user]);
  return (
  
    <div className="App">
      <BrowserRouter>
        <Navbar />
        {user && user.UserType === 'admin' && <AdminSidebar />}
        <div className="pages">
          <Routes>
            <Route path="/User/upload/:username" element={<DoctorDocuments />} />
            <Route path="/signup" element={< SignUp />} />
            
            <Route path="/Admin/Applicants" element={<Applicants />} />
            <Route path="/changePassword" element={<ChangePass />} />
            <Route path="/Admin/AddAdmin" element={<AddAdmin />} />
            <Route path="/Admin/Remove" element={<Remove />} />
            <Route path="/Admin/ViewUsersList" element={<ViewUsersList />} />
            <Route path="/Doctor/Status" element={<Status />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/Admin/AddPackage" element={<AddPackage />} />
            <Route path="/Admin/DeletePackage" element={<DeletePackage />} />
            <Route path="/Admin/UpdatePackage" element={<UpdatePackage />} />
          </Routes>
        </div>
        
        {user && user.UserType=="doctor" && <DoctorSidebar />} {/* Only render Sidebar if user is not null */}
        
        {user?.UserType==="patient" && <PatientSidebar />} {/* Renders patient sidebar */}
        {user?.UserType==="doctor" && <DoctorSidebar />} {/* Renders doctor sidebar */}
        {user && !joined && (
          <button onClick={() => setJoined(true)}>
            Join Room
          </button>
        )}

        {user && joined && (
          <>
            <button onClick={() => setJoined(false)}>
              To Lobby
            </button>
            <VideoRoom />
          </>
        )}

        {/* doctor paths */}
        <Routes>
          <Route path="/dashboard" element={<DoctorDashboard />} />
          <Route path="/contract" element={<Contract />} />
          <Route path="/slots" element={<AddTimeSlots />} />
          <Route path="/followups" element={<Followup />} />
          <Route path="/appointments" element={<DoctorAppointments />} />
          <Route path='/mypatients' element={<Patients />} />
          <Route path='/thispatient/:Username' element={<Patient />} />

          <Route path="/Package" element={<Package />} />
          <Route path="/Package/get" element={<PackageList/>} />
          <Route path="/Appointment/:Username" element={<Appointment />} />
          
           <Route path="/familyMemberPage" element={<FamilyMemberPage />} />
          <Route path="/payPatient" element={<PayPatient />} />

          
          
          
          <Route path="/doctor/chat" element={<DoctorChat />} />
          <Route path='/doctor/notifications' element={<DoctorNotifications />} />
        </Routes>

        {/* patient paths */}
        <Routes>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/addFamily" element={<AddFamily />} />
          <Route path="/patient/doctors" element={<DoctorsPage />} />
          <Route path="/patient/doctor/:Username" element={<Doctor />} />
          <Route path="/patient/records" element={<HealthRecords />} />
          <Route path="/patient/appointments" element={<PatientAppointments />} />
          <Route path="/patient/prescription" element={<PatientPrescription />} />
          <Route path="/patient/notifications" element={<Notifications />} />
          <Route path="/patient/health/:Username" element={<PatientHealthRecords />} />
          <Route
            path="/patient/appointments"
            element={<PatientAppointments />}
          />
          <Route path="/patient/prescription" element={<Prescription />} />
          <Route path="/patient/:Username" element={<Patient />} />
          
          <Route path="/doctor/appointments/:Username" element={<DoctorAppointments />} />
          {/* <Route path="/doctor/:Username" element={<Doctor />} /> */}
          <Route path="/patient/emailform" element={<EmailForm />} />
          <Route path="/patient/package" element={<Package />} />
          <Route path="/patient/videocall" element={<VideoCall />} />
          <Route path="/patient/chat" element={<PatientChat />} />
        </Routes>

        <Routes>
          <Route path="/" element={<Login />} />
          
          
        </Routes>

        <div className="pages">
          <Routes>
            
            
            <Route path="/" element={<Login />} />

            
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}


export default App;
