import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useToast,
  Card,
  Select,
} from '@chakra-ui/react';
import axios from 'axios';


const Remove = () => {
  const [username, setUsername] = useState('');
  const [selectedAction, setSelectedAction] = useState('deleteAdmin');
  const [result, setResult] = useState(null);
  const toast = useToast();

  const handleAction = async () => {
    try {
      // Validate if the username field is empty
      if (!username) {
        throw new Error('Username is required.');
      }

      let endpoint;
      let actionLabel;

      if (selectedAction === 'deleteAdmin') {
        endpoint = '/Admin/delete';
        actionLabel = 'Admin';
      } else if (selectedAction === 'deleteDoctor') {
        endpoint = '/Admin/deleteDoctor';
        actionLabel = 'Doctor';
      } else if (selectedAction === 'deletePatient') {
        endpoint = '/Admin/deletePatient';
        actionLabel = 'Patient';
      }

      await axios.delete(endpoint, { data: { Username: username } });
      setResult(`Successfully deleted ${actionLabel}.`);
      toast({
        title: 'Success',
        description: `Successfully deleted ${actionLabel}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset the username field after successful deletion
      setUsername('');
    } catch (error) {
      console.error('Error:', error.message);
      setResult(`Error: ${error.message}`);
      toast({
        title: 'Error',
        description: `Error: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    setResult(null);
  }, [username, selectedAction]);

  return (
    <Card p={4} mb={0} mt={160} ml={500} maxW={800}>
      <Box>
        <Heading as="h1" mb={4} textAlign="center" size="3xl" color="#183d3d">
          User Control
        </Heading>
        <Stack>
          <FormControl>
            <FormLabel fontSize="2xl" color="#183d3d" textAlign="center">
              Username
            </FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="2xl" color="#183d3d" textAlign="center">
              Select User Type
            </FormLabel>
            <Select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
            >
              <option value="deleteAdmin">Admin</option>
              <option value="deleteDoctor">Doctor</option>
              <option value="deletePatient">Patient</option>
            </Select>
          </FormControl>
          <Button bg="red.400" _hover='bg: red.500' onClick={handleAction} color="white" fontSize="2xl">
            Delete
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default Remove;
