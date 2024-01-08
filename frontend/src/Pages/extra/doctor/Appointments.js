import { Box, Heading, Text, VStack, Badge, Button, Select, HStack } from '@chakra-ui/react';
import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../../Hooks/useAuthContext';

const Appointments = () => {
  const { user } = useAuthContext();
  const Username = user?.Username;
  const [filter, setFilter] = useState('');
  const [appointmentData, setAppointmentData] = useState([]);
  const [patientDetails, setPatientDetails] = useState({});

  const formatDateTime = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  // Fetch patient details based on their IDs
  const fetchPatientDetails = async (patientId) => {
    try {
      const response = await axios.get(`/Patient/getPatientDetails?_id=${patientId}`);
      if (response.status === 200) {
        const patientName = response.data;
        setPatientDetails(prevDetails => ({
          ...prevDetails,
          [patientId]: patientName
        }));
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };

  useEffect(() => {
    if (appointmentData.length > 0) {
      appointmentData.forEach(appointment => fetchPatientDetails(appointment.patient));
    }
  }, [appointmentData]);

  const getAppointments = async () => {
    if (user && Username) {
      try {
        const response = await axios.get(`/Doctor/getSchedule?Username=${Username}`);
        if (Array.isArray(response.data.schedules)) {
          setAppointmentData(response.data.schedules);
          
        } else {
          console.error('Appointments data is not an array:', response.data.schedules);
          // Handle the case where the data is not in the expected format
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        // Handle errors from the API call
      }
    }
  };

  useEffect(() => {
    getAppointments();
  }, [user, Username]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'blue';
      case 'Completed':
        return 'green';
      case 'Cancelled':
        return 'red';
      case 'Rescheduled':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

 const filteredAppointments = appointmentData.filter(appointment => {
  if (!filter) return true;
  if (appointment.dateFrom) {
    const dateMatch = appointment.dateFrom.includes(filter);
    const statusMatch = appointment.status.toLowerCase() === filter.toLowerCase();
    return dateMatch || statusMatch;
  }
  return false;
});

  return (
    <Box p={4} marginLeft={280} >
      <Heading as="h2" size="lg" mb={4} color="blue.500">
        My Appointments
      </Heading>
      <VStack align="stretch" spacing={4}>
        {filteredAppointments.length === 0 ? (
          <Text>No appointment found</Text>
        ) : (
          filteredAppointments.map((appointment, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="md"
              p={4}
              boxShadow="lg"
            >
              <Text fontSize="lg" fontWeight="bold">
                Date: {formatDateTime(appointment.dateFrom)}
              </Text>
              <Text>
              <strong>Patient:</strong>{' '}
              {patientDetails[appointment.patient]}
              </Text>
              <Badge colorScheme={getStatusColor(appointment.status)}>
                {appointment.status}
              </Badge>
            </Box>
          ))
        )}
        <HStack>
          <Button colorScheme="teal" onClick={() => setFilter('')}>
            Clear Filter
          </Button>
          <Select
            onChange={handleFilterChange}
            value={filter || ''}
            placeholder="Filter by date or status"
          >
            <option value="">All</option>
            {appointmentData.map(appointment => (
              <option key={appointment.dateFrom} value={appointment.dateFrom}>
                {formatDate(appointment.dateFrom)}
              </option>
            ))}
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Rescheduled">Rescheduled</option>
          </Select>
        </HStack>
      </VStack>
    </Box>
  );  
};

export default Appointments;
