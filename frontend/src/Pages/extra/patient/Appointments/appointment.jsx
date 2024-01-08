import React, { useState, useEffect } from 'react';
import { Box, Select, Button, VStack, Text } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const Appointment = () => {
  const { Username } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Fetch the list of doctors when the component mounts
    axios.get(`/Patient/viewDoctors?Username=${Username}`).then((res) => {
      setDoctors(res.data);
    }).catch((err) => {
      console.error('Error fetching doctors', err);
    });
  }, [Username]);

  const handleDoctorSelect = async (doctorUsername) => {
    try {
      // Fetch the selected doctor's appointments
      const res = await axios.get(`/Patient/viewDoctorAppointments?Username=${doctorUsername}`);
      setAppointments(res.data.availableSlots);
    } catch (error) {
      console.error('Error fetching doctor appointments', error);
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold">Select a Doctor:</Text>
        <Select placeholder="Select Doctor" onChange={(e) => setSelectedDoctor(e.target.value)}>
          {doctors.map((doctor) => (
            <option key={doctor.Name} value={doctor.Username}>{doctor.Name}</option>
          ))}
        </Select>

        <Button
          colorScheme="teal"
          onClick={() => handleDoctorSelect(selectedDoctor)}
          isDisabled={!selectedDoctor}
        >
          View Appointments
        </Button>

        {appointments.length > 0 && (
          <Box>
            <Text fontSize="xl" fontWeight="bold" mt={4}>Available Appointments:</Text>
            <VStack spacing={2} align="stretch">
              {appointments.map((slot) => (
                <Text key={slot}>{slot}</Text>
              ))}
            </VStack>
          </Box>
        )}

        {selectedDoctor && (
          <Link to={`/reserve-appointment/${Username}/${selectedDoctor}`}>
            <Button colorScheme="teal" mt={4}>
              Reserve with this doctor
            </Button>
          </Link>
        )}
      </VStack>
    </Box>
  );
};

export default Appointment;
