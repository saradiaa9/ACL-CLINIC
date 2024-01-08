// PackageList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Heading,
  List,
  ListItem,
  Container,
  Text,
  VStack,
  Input,
  Button,
  Select,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const FamilyMembers = ({ Username }) => {
  const [packages, setPackages] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFamilyMembers();
    fetchPackages();
  }, [Username]);

  const fetchFamilyMembers = async () => {
    try {
      const response = await axios.get(`/Patient/getFamilyMembers?Username=${Username}`);
      setFamilyMembers(response.data);
    } catch (error) {
      console.error('Error fetching family members:', error.message);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await axios.get('/Package/get'); // Update the URL to match your backend endpoint
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error.message);
    }
  };

  const handleAddPackageToFamilyMember = async () => {
    try {
      const response = await axios.post(`/Patient/addPackageToFamilyMember?Username=${Username}`, {
        packageName: selectedPackage,
        familyMember: selectedFamilyMember,
      });

      console.log(response.data); // Handle success response
    } catch (error) {
      console.error('Error adding package:', error);
      setError('Failed to add package');
    }
  };

  return (
    <VStack align="start" spacing={2} width="100%">
      <Heading as="h2" size="md" mb={4}>
        Family Members:
      </Heading>
      <List spacing={3} width="100%">
        {familyMembers.map((member) => (
          <ListItem key={member.Name} width="100%">
            <Text>{`${member.Name} - ${member.Relation}`}</Text>
          </ListItem>
        ))}
      </List>

      <Box
        padding="4"
        boxShadow="lg"
        bg="white"
        borderRadius="md"
        mt="8"
        width="100%"
      >
        <VStack align="start" spacing={4} width="100%">
          {/* Dropdown to select family member */}
          <Select
            placeholder="Select Family Member"
            value={selectedFamilyMember}
            onChange={(e) => setSelectedFamilyMember(e.target.value)}
          >
            {familyMembers.map((member) => (
              <option key={member.Name} value={member.Name}>
                {member.Name}
              </option>
            ))}
          </Select>

          {/* Dropdown to dynamically fetch and select package names */}
          <Select
            placeholder="Select Package"
            value={selectedPackage}
            onChange={(e) => setSelectedPackage(e.target.value)}
          >
            {packages.map((packageItem) => (
              <option key={packageItem._id} value={packageItem.Name}>
                {packageItem.Name}
              </option>
            ))}
          </Select>

          <Button colorScheme="teal" onClick={handleAddPackageToFamilyMember}>
            Add Package to Family Member
          </Button>
          {error && <Text color="red">{error}</Text>}
        </VStack>
      </Box>
    </VStack>
  );
};

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const { Username } = useParams();
  const [packageName, setPackageName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message

  useEffect(() => {
    fetchPackages();
  }, [Username]);

  const fetchPackages = async () => {
    try {
      const response = await axios.get('/Package/get'); // Update the URL to match your backend endpoint
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error.message);
    }
  };

  const handleAddPackage = async () => {
    try {
      const response = await axios.post(`/Patient/addPackageToPatient?Username=${Username}`, {
        packageName: packageName,
      });

      setMessage(response.data.message);
      setError('');
      setSuccessMessage('Package added successfully');
      fetchPackages(); // Refresh the package list after adding a package
    } catch (error) {
      console.error('Error adding package:', error);
      setMessage('');
      setError('Failed to add package');
      setSuccessMessage(''); // Reset success message in case of an error
    }
  };

  return (
    <Container maxW="container.md" centerContent>
      <List spacing={3} width="100%">
        {packages.map((packageItem) => (
          <ListItem key={packageItem._id} width="100%">
            <Box
              padding="4"
              boxShadow="lg"
              bg="white"
              borderRadius="md"
              width="100%"
            >
              <VStack align="start" spacing={2} width="100%">
                <Text fontWeight="bold">Package Name: {packageItem.Name}</Text>
                <Text>Price: {packageItem.AnnualPrice}</Text>
                <Text>Doctor Discount: {packageItem.DoctorDiscount}</Text>
                <Text>Medicine Discount: {packageItem.MedicineDiscount}</Text>
                <Text>Family Discount: {packageItem.FamilyDiscount}</Text>
              </VStack>
            </Box>
          </ListItem>
        ))}
      </List>

      <FamilyMembers Username={Username} />

      <Box
        padding="4"
        boxShadow="lg"
        bg="white"
        borderRadius="md"
        mt="8"
        width="100%"
      >
        <VStack align="start" spacing={4} width="100%">
          <Input
            placeholder="Package Name"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
          />
          <Button colorScheme="teal" onClick={handleAddPackage}>
            Add Package
          </Button>
          {message && <Text color="green">{message}</Text>}
          {error && <Text color="red">{error}</Text>}
          {successMessage && <Text color="green">{successMessage}</Text>}
        </VStack>
      </Box>
    </Container>
  );
};

export default PackageList;
