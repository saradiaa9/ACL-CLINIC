// AddPatientPage.js
import React, { useState, useEffect } from 'react';
import { Box, Heading, Input, Button, Select, FormControl, FormLabel, List, ListItem, Text, Spinner } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const AddPatientPage = () => {
  const { Username } = useParams();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('');
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSubmit = async () => {
    // Make the API call to add a patient to another patient
    // Use fetch, axios, or any other library for making API requests
    console.log(relation)

    const response = await fetch(`/Patient/addPatientToPatient?Username=${Username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Email: email, Phone: phone, Relation: relation }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message); // Log success message or handle it accordingly
      // Refresh family members after adding a new patient
      fetchFamilyMembers();
    } else {
      const errorData = await response.json();
      console.error(errorData.error); // Log error message or handle it accordingly
    }
  };

  const fetchFamilyMembers = async () => {
    try {
      // Make the API call to get family members
      const response = await fetch(`/Patient/getFamilyMembers?Username=${Username}`);
      
      if (response.ok) {
        const data = await response.json();
        setFamilyMembers(data);
        console.log(data);
      } else {
        console.error('Failed to fetch family members');
      }
    } catch (error) {
      console.error('Error fetching family members', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch family members when the component mounts
    fetchFamilyMembers();
  }, []);

  return (
    <Box p={4}>
      <Heading mb={4}>Add Patient to Patient</Heading>

      {/* Your existing form for adding a patient to another patient */}
      <FormControl mb={4}>
        <FormLabel>Email of Patient:</FormLabel>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Phone of Patient:</FormLabel>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Relation:</FormLabel>
        <Select value={relation} onChange={(e) => setRelation(e.target.value)}>
          <option value="Wife">Wife</option>
          <option value="Husband">Husband</option>
          <option value="Son">Son</option>
          <option value="Daughter">Daughter</option>
        </Select>
      </FormControl>

      <Button colorScheme="teal" onClick={handleSubmit}>
        Add Patient
      </Button>

      {/* Display the family members */}
      <Heading mt={4} mb={2}>Family Members</Heading>
      {loading ? (
        <Spinner />
      ) : (
        <List>
          {familyMembers.map((member, index) => (
            <ListItem key={index}>
              <Text>{member.Name} - {member.Relation}</Text>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AddPatientPage;