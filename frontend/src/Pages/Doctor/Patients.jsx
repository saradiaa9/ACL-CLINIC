import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Input,
  Button,
  List,
  ListItem,
  Text,
  Spinner,
  Flex,
  Select,
} from '@chakra-ui/react';
import Axios from 'axios';
import { useAuthContext } from '../../Hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

const Patients = () => {
  const { user, loading } = useAuthContext();
  const Username = user?.Username;
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [isSelected, setIsSelected] = useState(false);

  const fetchDoctorPatients = async () => {
    try {
      const response = await Axios.get(
        `/Doctor/getMyPatients?Username=${user.Username}`
      );
      
      setPatients(response.data.patients);
      
    } catch (error) {
      console.error('Error fetching doctor patients:', error);
    }
  };

  useEffect(() => {
    if (user) {
      Axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }

    fetchDoctorPatients();
  }, [Username, user]);

  const handlePatientClick = patient => {
    setSelectedPatient(patient);
    console.log(patient);
  };

  const handleSearchChange = value => {
    setSearchValue(value);
  };

  const handleSearch = async () => {
    try {
      // Perform the rescheduling process

      const response = await Axios.get(
        `/Doctor/getPatientByName?Username=${Username}&Name=${searchValue}`
      );
      // Use the state callback function to ensure it's based on the latest state
      console.log(response.data.patient);
      setPatients(response.data.patient);
      setIsSelected(false);
    } catch (error) {
      setPatients([]);
      console.error('No patient found:', error);
    }
  };

  const handleGoToPatient = () => {
    if (selectedPatient) {
      console.log(selectedPatient);
      const patientUsername = selectedPatient.Username;
      navigate(`/thispatient/${patientUsername}`); // Use navigate to redirect
    }
  };

  const handleVideoCall = () => {
    window.location.href = `patient/videocall`;
  };

  const handleFilter = async () => {
    try {
      // Perform the rescheduling process
      setSearchValue('');
      const response = await Axios.get(
        `/Doctor/getUpcomingPatients?Username=${Username}`
      );

      // Use the state callback function to ensure it's based on the latest state
      setPatients(response.data.patients);
      console.log(response.data.patients);
      setIsSelected(true);
    } catch (error) {
      console.error('Error filtering patients:', error);
    }
  };

  return (
    <Flex direction="column" padding="1rem" ml={340} mt={50}>
      <Box
        width="100%"
        maxWidth="900px"
        textAlign="center"
        backgroundColor="#f5f5f5"
        borderRadius="4px"
        margin="1rem"
        padding="1rem"
        display="flex"
        alignItems="center"
      >
        {/* Search input for date or patient name */}
        <Input
          type="text"
          placeholder="Search by patient name"
          onChange={e => handleSearchChange(e.target.value)}
          mb={3}
          value={searchValue}
          mt={3}
        />

        {/* Button for triggering search */}
        <Button bg="#183D3D" onClick={handleSearch} color="white" ml={2}>
          Search
        </Button>

        {/* Button for filtering by "Upcoming" */}
        <Button
          onClick={() => handleFilter('Upcoming')}
          color="white"
          ml={2}
          bg={isSelected ? '#93B1A6' : '#183D3D'}
        >
          Upcoming
        </Button>
      </Box>

      {/* My Details section */}
      <Box
        width="100%"
        maxWidth="600px"
        textAlign="center"
        backgroundColor="#f5f5f5"
        borderRadius="4px"
        margin="1rem"
        padding="1rem"
        ml={150}
      >
        <Text
          fontSize="1.5rem"
          fontWeight="bold"
          marginBottom="1rem"
          color="#183D3D"
        >
          MY PATIENTS
        </Text>

        {selectedPatient && (
              <><Button
                bg="#183D3D"
                color="white"
                mb={5}
                ml={6}
                mr={4}
                onClick={handleGoToPatient}
              >
                Go To Patient
              </Button><Button
                bg="#183D3D"
                color="white"
                mb={5}
                ml={6}
                onClick={handleGoToPatient}
              >
                Start A Chat
              </Button><Button
                bg="#183D3D"
                color="white"
                mb={5}
                ml={6}
                onClick={handleVideoCall}
              >
                Start A Video Call
              </Button></>
            )}
        {loading ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="grey.200"
            color="#5C8374"
            size="xl"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            mt={300}
            ml={20}
          />
        ) : (
          <Box>
            <List spacing={3}>
              {Array.isArray(patients) && patients.length > 1 ? (
                patients.map((patient, index) => (
                  <ListItem
                    key={index}
                    borderWidth="1px"
                    borderRadius="lg"
                    padding={4}
                    backgroundColor={
                      selectedPatient === patient ? '#93B1A6' : 'white'
                    }
                    onClick={() => handlePatientClick(patient)}
                    cursor="pointer"
                    _hover={{ bg: '#93B1A6' }}
                  >
                    <Heading fontSize="md">
                      {patient ? patient.Name : 'No Patient'}{' '}
                    </Heading>
                    <Text fontSize="sm" color="black">
                      {patient ? patient.Email : 'No Email'}
                    </Text>
                    <Text fontSize="sm" color="black">
                    {patient ? "+20 "+ patient.MobileNumber : 'No Number'}
                  </Text>
                  </ListItem>
                ))
              ) : isSelected ? (
                // Else if condition
                <ListItem
                  borderWidth="1px"
                  borderRadius="lg"
                  padding={4}
                  backgroundColor={
                    selectedPatient === patients[0] ? '#93B1A6' : 'white'
                  }
                  onClick={() => handlePatientClick(patients[0])}
                  cursor="pointer"
                  _hover={{ bg: '#93B1A6' }}
                >
                  <Heading fontSize="md">
                    {patients[0] ? patients[0].Name : 'No Patient'}{' '}
                  </Heading>
                  <Text fontSize="sm" color="black">
                    {patients[0] ? patients[0].Email : 'No Email'}
                  </Text>
                  <Text fontSize="sm" color="black">
                    {patients[0] ? "+20 "+ patients[0].MobileNumber : 'No Number'}
                  </Text>
                </ListItem>
              ) : (
                // Else block
                patients?.map((patient, index) => (
                  <ListItem
                    borderWidth="1px"
                    borderRadius="lg"
                    padding={4}
                    backgroundColor={selectedPatient === patient ? '#93B1A6' : 'white'}
                    onClick={() => handlePatientClick(patient)}
                    cursor="pointer"
                    _hover={{ bg: '#93B1A6' }}
                    key={index} // Add a unique key prop for each ListItem
                  >
                    <Heading fontSize="md">
                      {patient ? patient.Name : 'No Patient'}
                    </Heading>
                    <Text fontSize="sm" color="black">
                      {patient ? patient.Email : 'No Email'}
                    </Text>
                    <Text fontSize="sm" color="black">
                      {patient ? `+20 ${patient.MobileNumber}` : 'No Number'}
                    </Text>
                  </ListItem>
                ))
                
              )}
            </List>
            
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default Patients;
