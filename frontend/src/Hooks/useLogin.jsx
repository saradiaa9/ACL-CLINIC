import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import axios from 'axios';

export const useLogin = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (username, password) => {
    setLoading(true);
    setError('');

    if (username === '' || password === '') {
      console.log('entered if statement');
      setError('Please fill out all fields');
      console.log(error);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/login', {
        Username: username,
        Password: password,
      });

      localStorage.setItem('user', JSON.stringify(response.data));
      dispatch({ type: 'LOGIN', payload: response.data });

      if (response.data.UserType === 'patient') {
        // TODO: redirect to patient dashboard
        window.location.href = `/patient/dashboard`;
      }
      if (response.data.UserType === 'doctor') {
        window.location.href = '/dashboard';
      }
      if (response.data.UserType === 'admin') {
        window.location.href = `/admin?Username=${response.data.Username}`;
      }
    } catch (e) {
      setError(e.response.data.error);
    }
    setLoading(false);
  };

  return { login, error, loading };
};
