import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SuccessPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const patientUsername = searchParams.get('patientUsername');
  const doctorUsername = searchParams.get('doctorUsername');

  useEffect(() => {
    if (patientUsername && doctorUsername) {
      // Make a request to add the patient to the doctor
      axios.post('/Doctor/addPatientToDoctor', {
        doctorUsername,
        patientUsername,
      })
      .then(response => {
        console.log('Patient added to doctor:', response.data);
      })
      .catch(error => {
        console.error('Failed to add patient to doctor:', error);
      });
    }
  }, [patientUsername, doctorUsername]);

  return (
    <div>
      <h1>Success Page</h1>
      <p>Success</p>
    </div>
  );
};

export default SuccessPage;