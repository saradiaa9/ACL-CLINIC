import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  Heading,
  useToast,
  Center,
  Text,
  Card,
  CardBody,
  Stack,
} from '@chakra-ui/react';
import axios from 'axios';
import bcrypt from 'bcryptjs';

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    Username: '',
    Password: '',
  });

  const [admins, setAdmins] = useState([]);
  const toast = useToast();

  useEffect(() => {
    // Fetch admins when the component mounts
    getAdmins();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAdmin = async () => {
    try {
      const hashedPassword = await bcrypt.hash(formData.Password, 10);
      const response = await axios.post('/Admin/add', {
        Username: formData.Username,
        Password: hashedPassword,
      });

      console.log('Server Response:', response.data);

      toast({
        title: 'Admin Added',
        description: 'Admin has been added successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Fetch the updated list of admins after adding a new one
      getAdmins();

      setFormData({
        Username: '',
        Password: '',
      });
    } catch (error) {
      console.error('Error adding admin:', error.response);
      toast({
        title: 'Error',
        description: 'Failed to add admin. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getAdmins = async () => {
    try {
      const response = await axios.get('/Admin/get');
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error.response);
      toast({
        title: 'Error',
        description: 'Failed to fetch admins. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Center minH="75vh">
      <Stack direction={['column', 'row']} spacing={8} ml={200} mt={100} maxW={1000}>
        {/* Add Admin Card */}
        <Card p={35} maxW="900px" w="100%" borderRadius="md" boxShadow="base" backgroundColor="#f5f5f5">
          <VStack spacing={10} align="stretch">
            <Heading size="3xl" color="#183D3D" align="center">Add Admin</Heading>
            <Box w="100%">
              <FormControl>
                <FormLabel fontSize="2xl" textAlign="center" color="#183d3d">Username</FormLabel>
                <Input
                  fontSize="lg"
                  type="text"
                  name="Username"
                  value={formData.Username}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="2xl" textAlign="center" color="#183d3d">Password</FormLabel>
                <Input
                  fontSize="lg"
                  type="password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                />
              </FormControl>
              <Button
                fontSize="lg"
                colorScheme="teal"
                size="lg"
                backgroundColor="#93b1a6"
                _hover={{bg: '#5c8374'}}
                color="white"
                onClick={handleAddAdmin}
                mt={8}
                ml={94}
              >
                Add Admin
              </Button>
            </Box>
          </VStack>
        </Card>

        {/* Get Admins Card */}
        <Card p={35} maxW="800px" w="100%" borderRadius="md" boxShadow="base" backgroundColor="#f5f5f5">
          <Heading size="3xl" color="#183D3D">
            All Admins
          </Heading>
          <CardBody>
            {admins.length > 0 ? (
              <VStack align="center" spacing={6}>
                {admins.map((admin) => (
                  <Box key={admin._id}>
                    <Stack direction={['column', 'row']} spacing={6}>
                  <Text fontSize="2xl" textAlign="center" justifyContent="center" fontWeight="bold">
                      {admin.Username}
                    </Text>
                    </Stack>

                  </Box>
                ))}
              </VStack>
            ) : (
              <Text fontSize="lg">No admins available.</Text>
            )}
          </CardBody>
        </Card>
      </Stack>
    </Center>
  );
};

export default AddAdmin;
