import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Card,
  Flex,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuthContext } from '../../Hooks/useAuthContext';

const AddPackage = () => {
  const [packages, setPackages] = useState([]);
  const { user, loading } = useAuthContext();
  const toast = useToast();
  const [formData, setFormData] = useState({
    Name: '',
    AnnualPrice: '',
    DoctorDiscount: '',
    MedicineDiscount: '',
    FamilyDiscount: '',
  });
  useEffect(() => {
    if (user) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }

    axios
      .get('/Admin/getPackage')
      .then((response) => {
        setPackages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching packages:', error);
      });
  }, [user, loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/Admin/addPackage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Handle successful package addition
        toast({
          title: 'Package added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Reset the form data to empty values
        setFormData({
          Name: '',
          AnnualPrice: '',
          DoctorDiscount: '',
          MedicineDiscount: '',
          FamilyDiscount: '',
        });

        // Reload the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        // Handle error in adding package
        const data = await response.json();
        console.error('Failed to add package:', data.error);
        toast({
          title: 'Failed to add package',
          description: data.error || 'Unknown error',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error adding package:', error.message);
      toast({
        title: 'Error adding package',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      ml={160}
    >
      <Card width="400px" height="625px" backgroundColor="#f5f5f5">
        <Box p={4}>
          <Flex direction="column" align="center" justify="center" flex="4">
            <Heading mb={4} alignItems="center" align="center" color="#183d3d" fontSize="5xl">
              Packages
            </Heading>
            {packages.map((pkg) => (
              <Box key={pkg._id} p={4} borderWidth="0px" borderRadius="lg">
                <Text fontSize="xl" align="center" fontWeight="bold" color="#183d3d">
                  {pkg.Name}
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>
      </Card>

      <Card width="400px" p={4} ml={20} backgroundColor="#f5f5f5">
        <Box p={4}>
          <Heading mb={4} alignItems="center" align="center" color="#183d3d" fontSize="5xl">Add Package</Heading>
          <form onSubmit={handleSubmit}>
            <FormControl mb={4}>
              <FormLabel fontSize="xl" color="#183d3d" textAlign="center" fontWeight="bold">Name</FormLabel>
              <Input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontSize="xl" color="#183d3d" textAlign="center" fontWeight="bold">Annual Price</FormLabel>
              <Input
                type="number"
                name="AnnualPrice"
                value={formData.AnnualPrice}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontSize="xl" color="#183d3d" textAlign="center" fontWeight="bold">Doctor Discount</FormLabel>
              <Input
                type="number"
                name="DoctorDiscount"
                value={formData.DoctorDiscount}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontSize="xl" color="#183d3d" textAlign="center" fontWeight="bold">Medicine Discount</FormLabel>
              <Input
                type="number"
                name="MedicineDiscount"
                value={formData.MedicineDiscount}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontSize="xl" color="#183d3d" textAlign="center" fontWeight="bold">Family Discount</FormLabel>
              <Input
                type="number"
                name="FamilyDiscount"
                value={formData.FamilyDiscount}
                onChange={handleChange}
                required
              />
            </FormControl>
            <Button type="submit" backgroundColor="#93b1a6" _hover={{ bg: '#5c8374' }} color="white" alignItems="center" marginLeft="100" marginRight="0">
              Add Package
            </Button>
          </form>
        </Box>
      </Card>
    </Box>
  );
};

export default AddPackage;
