import { useEffect, useState } from 'react';
import {
  Input,
  Button,
  Stack,
  FormControl,
  FormLabel,
  IconButton,
  InputGroup,
  InputRightElement,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useAuthContext } from '../../Hooks/useAuthContext';
import axios from 'axios';

import { PasswordField } from './PasswordField';

function ChangePasswordPage() {
  const toast = useToast();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { user, loading } = useAuthContext();
  let Username = user?.Username;
  useEffect(() => {
    if (user) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      Username = user.Username;
    }
  }, [user, Username]);

  // Function to handle password change submission
  const handleSubmit = () => {
    // Logic to handle password change submission
    // Check if oldPassword, newPassword, and confirmPassword are valid and match
    if (oldPassword && newPassword && newPassword === confirmPassword) {
      axios
        .put(`/changePassword`, {
          Username: Username,
          Password: oldPassword,
          NewPassword: newPassword,
        })
        .then(
          toast({
            title: 'Password changed successfully!',
            status: 'success',
            duration: 5000,
            isClosable: true,
            onCloseComplete: () => {
              window.location.href = '/';
            },
          })
        )
        .catch(err => {
          toast({
            title: 'An error occurred.',
            description: err,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          console.log(err);
        });
    } else {
      // Display an error message or handle invalid password change
      toast({
        title: 'Invalid password change!',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      console.error('Invalid password change!');
    }
  };

  if (loading) {
    return (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue"
        size="xl"
        position="absolute"
        top="100%"
        left="50%"
        transform="translate(-50%, -50%)"
      />
    );
  }

  return (
    <Stack
      spacing={4}
      maxWidth="400px"
      m="auto"
      mt={8}
      p={6}
      boxShadow="md"
      borderRadius="md"
    >
      <FormControl>
        <FormLabel htmlFor="oldPassword">Old Password</FormLabel>
        <InputGroup>
          <Input
            type={showOldPassword ? 'text' : 'password'}
            id="oldPassword"
            placeholder="Enter old password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
          />
          <InputRightElement>
            <IconButton
              aria-label={
                showOldPassword ? 'Hide old password' : 'Show old password'
              }
              onClick={() => setShowOldPassword(!showOldPassword)}
              icon={showOldPassword ? <ViewOffIcon /> : <ViewIcon />}
              variant="ghost"
              color="#5C8374"
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="new-password">New Password</FormLabel>
        <InputGroup>
          <Input
            type={showNewPassword ? 'text' : 'password'}
            id="new-password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <InputRightElement>
            <IconButton
              aria-label={
                showNewPassword ? 'Hide new password' : 'Show new password'
              }
              onClick={() => setShowNewPassword(!showNewPassword)}
              icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
              variant="ghost"
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirm-password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <InputRightElement>
            <IconButton
              aria-label={
                showConfirmPassword
                  ? 'Hide confirm password'
                  : 'Show confirm password'
              }
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
              variant="ghost"
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button colorScheme="blue" onClick={handleSubmit}>
        Confirm
      </Button>
    </Stack>
  );
}

export default ChangePasswordPage;
