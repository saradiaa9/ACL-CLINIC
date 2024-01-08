import React, { useState } from 'react';
import {
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import axios from 'axios';

const Applicants = () => {
  const [admins, setAdmins] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGetAdmins = async () => {
    try {
      const response = await axios.get('/Admin/get');
      setAdmins(response.data);
      setDoctors([]);
      setPatients([]);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const handleGetDoctors = async () => {
    try {
      const response = await axios.get('/Admin/getDoctor');
      setDoctors(response.data);
      setAdmins([]);
      setPatients([]);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleGetPatients = async () => {
    try {
      const response = await axios.get('/Patient/get');
      setPatients(response.data);
      setAdmins([]);
      setDoctors([]);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };



  

  return (
    <Flex direction="column" align="center" justify="center" minHeight="0vh">
      <Stack direction="row" spacing={40} mb={10} ml="200">
        <Button
          size="lg"
          onClick={handleGetAdmins}
          bg="#93b1a6"
          _hover={{ bg: '#5c8374' }}
          color="white"
          fontSize="2xl"
        >
          Admins
        </Button>
        <Button
          size="lg"
          onClick={handleGetDoctors}
          bg="#93b1a6"
          _hover={{ bg: '#5c8374' }}
          color="white"
          fontSize="2xl"
        >
          Doctors
        </Button>
        <Button
          size="lg"
          onClick={handleGetPatients}
          bg="#93b1a6"
          _hover={{ bg: '#5c8374' }}
          color="white"
          fontSize="2xl"
        >
          Patients
        </Button>
      </Stack>

      <Stack direction={['column', 'column']} spacing={5} width="full" maxW="lg" ml="200">
        {admins.map((admin) => (
          <Button
            key={admin._id}
            fontSize="xl"
            onClick={() => handleUserClick(admin)}
          >
            {admin.Username}
          </Button>
        ))}
        {doctors.map((doctor) => (
          <Button
            key={doctor._id}
            fontSize="xl"
            onClick={() => handleUserClick(doctor)}
          >
            {doctor.Username}
          </Button>
        ))}
        {patients.map((patient) => (
          <Button
            key={patient._id}
            fontSize="xl"
            onClick={() => handleUserClick(patient)}
          >
            {patient.Username}
          </Button>
        ))}
      </Stack>
    </Flex>
  );
};

export default Applicants;
