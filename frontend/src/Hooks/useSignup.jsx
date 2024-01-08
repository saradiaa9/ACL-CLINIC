import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

export const useSignup = () => {
  const toast = useToast();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async ({ formData }) => {
    setLoading(true);
    setError('');

    console.log(formData);
    if (
      formData.username === '' ||
      formData.name === '' ||
      formData.dateOfBirth === '' ||
      formData.email === '' ||
      formData.password === ''
    ) {
      setError('Please fill User Registration form');
      setLoading(false);
      return;
    }

    if (
      formData.userType === 'patient' &&
      (formData.gender === '' ||
        formData.mobileNumber === '' ||
        formData.emergencyName === '' ||
        formData.emergencyMobileNumber === '' ||
        formData.emergencyRelationToPatient === '')
    ) {
      setError('Please fill Patient Details form');
      setLoading(false);
      return;
    }

    if (
      formData.userType === 'doctor' &&
      (formData.hourlyRate === '' ||
        formData.affiliation === '' ||
        formData.educationalBackground === '' ||
        formData.specialization === '')
    ) {
      setError('Please fill Doctor Details form');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/signup', {
        //basic info
        Username: formData.username,
        Name: formData.name,
        Email: formData.email,
        Password: formData.password,
        UserType: formData.userType,
        

        //patient info
        DateOfBirth: formData.dateOfBirth,
        Gender: formData.gender,
        MobileNumber: formData.mobileNumber,
        NationalID:formData.nationalID,
        EmergencyContact: {
          Username: formData.emergencyUsername,
          Name: formData.emergencyName,
          MobileNumber: formData.emergencyMobileNumber,
          RelationToPatient: formData.emergencyRelationToPatient,
        },

        //doctor info
        HourlyRate: formData.hourlyRate,
        Affiliation: formData.affiliation,
        EducationalBackground: formData.educationalBackground,
        Specialty: formData.specialization,
      });

      dispatch({ type: 'LOGIN', payload: response });
      localStorage.setItem('user', JSON.stringify(response));

      toast({
        title: 'Account created.',
        description: 'Your account has been created successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        onCloseComplete: () => {
          switch (formData.userType) {
            case 'patient':
              // TODO: redirect to patient dashboard
              window.location.href = `/`;
              break;
            case 'doctor':
              window.location.href = '/';
              break;
            default:
              window.location.href = '/';
          }
        },
      });
    } catch (e) {
      setError(e.response.data.error);
    }
    setLoading(false);
  };
  return { signup, error, loading };
};
