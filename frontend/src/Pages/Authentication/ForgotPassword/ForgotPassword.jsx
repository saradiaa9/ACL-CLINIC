import { useToast } from '@chakra-ui/react';

import { useState } from 'react';
import axios from 'axios';

import RequestOTP from './RequestOTP';
import VerifyOTP from './VerifyOTP';
import ResetPassword from './ResetPassword';

function ForgotPassword() {
  const toast = useToast();
  const [step, setStep] = useState(1);

  const [username, setUsername] = useState('');

  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');

  const [password, setPassword] = useState('');

  const handleRequestOTP = async () => {
    await axios
      .get(`/generateOTP?Username=${username}`)
      .then(res => {
        if (res.status === 201) {
          toast({
            title: 'OTP sent successfully.',
            description: 'Check your email for the OTP.',
            status: 'success',
            duration: 5000,
            isClosable: true,
            onCloseComplete: () => {
              fetchEmail();
              setStep(2);
            },
          });
        }
      })
      .catch(err => {
        toast({
          title: 'An error occurred.',
          description: err.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const fetchEmail = async () => {
    await axios
      .get(`/getEmail?Username=${username}`)
      .then(res => {
        if (res.status === 201) {
          setEmail(res.data.Email);
          console.log(email);
        }
      })
      .catch(err => {
        toast({
          title: 'An error occurred.',
          description: err.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleVerifyOTP = async () => {
    await axios
      .get(`/verifyOTP?Username=${username}&OTP=${otp}`)
      .then(res => {
        if (res.status === 200) {
          toast({
            title: 'OTP verified successfully.',
            description: 'Please reset your password.',
            status: 'success',
            duration: 5000,
            isClosable: true,
            onCloseComplete: () => {
              setStep(3);
            },
          });
        }
      })
      .catch(err => {
        toast({
          title: 'An error occurred.',
          description: err.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleResetPassword = async () => {
    await axios
      .put(`/resetPassword?Username=${username}`, {
        Password: password,
      })
      .then(res => {
        if (res.status === 200) {
          toast({
            title: 'Password reset successfully.',
            description: 'Please login with your new password.',
            status: 'success',
            duration: 5000,
            isClosable: true,
            onCloseComplete: () => {
              window.location.href = '/';
            },
          });
        }
      })
      .catch(err => {
        toast({
          title: 'An error occurred.',
          description: err.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const pageDisplay = () => {
    if (step === 1) {
      return (
        <RequestOTP
          username={username}
          setUsername={setUsername}
          handleRequestOTP={handleRequestOTP}
        />
      );
    } else if (step === 2) {
      return (
        <VerifyOTP
          username={username}
          otp={otp}
          setOTP={setOTP}
          email={email}
          handleVerifyOTP={handleVerifyOTP}
          handleRequestOTP={handleRequestOTP}
        />
      );
    } else if (step === 3) {
      return (
        <ResetPassword
          password={password}
          setPassword={setPassword}
          handleResetPassword={handleResetPassword}
        />
      );
    }
  };

  return <>{pageDisplay()}</>;
}

export default ForgotPassword;
