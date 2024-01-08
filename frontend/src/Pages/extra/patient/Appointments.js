import { Box, Heading, Text, VStack, Badge, Button, Select, HStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../../Hooks/useAuthContext';

const Appointments = () => {
  const { user } = useAuthContext();
  const Username = user?.Username;
  const [filter, setFilter] = useState('');
  const [appointmentData, setAppointmentData] = useState([]);
  const [doctorsDetails, setDoctorsDetails] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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

  // Fetch doctor details based on their IDs
  const fetchDoctorDetails = async (doctorId) => {
    try {
      const response = await axios.get(`/Doctor/getDoctorDetailsID?_id=${doctorId}`);
      if (response.status === 200) {
        const doctorName = response.data;
        setDoctorsDetails(prevDetails => ({
          ...prevDetails,
          [doctorId]: doctorName
        }));
      }
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
  };

  useEffect(() => {
    if (appointmentData.length > 0) {
      appointmentData.forEach(appointment => fetchDoctorDetails(appointment.doctor));
    }
  }, [appointmentData]);

  const getAppointments = async () => {
    if (user && Username) {
      try {
        const response = await axios.get(`/Patient/getSchedule?Username=${Username}`);
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

const handleCancelAppointment = (appointment) => {
  // Toggle the selected appointment
  setSelectedAppointment(selectedAppointment === appointment ? null : appointment);
  
  // If the button was clicked again, close the modal
  if (selectedAppointment === appointment) {
    onClose();
  }
};

const handleConfirmation = async (confirmed) => {
  if (selectedAppointment) {
    // Open the modal only if there is a selected appointment
    onOpen();
    if (confirmed) {
      // Make an axios request to cancel the appointment
      try {
        await axios.put('/Schedule/cancel', { id: selectedAppointment._id });
        console.log('Appointment cancelled successfully');
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        // Handle the error as needed
      }
      onClose();
      // Refresh the appointments after cancelling
      getAppointments();
    }
  }
};


  return (
    <Box p={4} marginLeft={280} bgColor="#f5f5f5" borderRadius={5} >
      <Heading as="h2" size="lg" mb={4} color="black">
        My Appointments
      </Heading>
      <HStack marginBottom={5}>
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
              onClick={() => handleCancelAppointment(appointment)}
              _hover={{ bgColor: 'gray.100', cursor: 'pointer' }} // Change the background color on hover
            >
              <Text fontSize="lg" fontWeight="bold">
                Date: {formatDateTime(appointment.dateFrom)}
              </Text>
              <Text>
                <strong>Doctor:</strong> {doctorsDetails[appointment.doctor]}
              </Text>
              <Badge colorScheme={getStatusColor(appointment.status)}>
                {appointment.status}
              </Badge>
              {selectedAppointment === appointment && (
                <HStack marginTop={3}>
                  <Button colorScheme="red" onClick={(e) => { e.stopPropagation(); handleConfirmation(); }}>
                    Cancel Appointment
                  </Button>
                </HStack>
              )}
            </Box>
          ))
        )}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Cancel Appointment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to cancel the appointment?
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={() => handleConfirmation(true)}>
                Yes
              </Button>
              <Button onClick={() => {handleConfirmation(false); onClose();}} >
                Discard
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );  
};

export default Appointments;