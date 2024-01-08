import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Checkbox,
  VStack,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AppointmentForm = () => {
  const navigate = useNavigate();
  const { Username, doctorUsername } = useParams();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isFamily, setIsFamily] = useState(false);

  const handleSubmit = async () => {
    try {
      // Format date and time
      const formattedDate = new Date(date).toISOString().split('T')[0];
      const formattedTime = new Date(`1970-01-01T${time}`).toTimeString().split(' ')[0];

      // Combine formatted date and time
      const combinedDateTime = `${formattedDate} ${formattedTime}`;

      // Make a POST request to your backend endpoint
      const response = await axios.post(
        `/Patient/selectAppointment?Username=${Username}&doctorUsername=${doctorUsername}`,
        {
          date: formattedDate,
          time: formattedTime,
          isFamily: isFamily,
        }
      );

      // Handle the response as needed
      console.log(response.data);

      // Redirect to the specified path after a successful post
      navigate(`/Patient/ChooseApp/${Username}/${doctorUsername}`);
    } catch (error) {
      console.error('Error creating appointment', error);
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold">
          Schedule an Appointment
        </Text>

        <FormControl>
          <FormLabel>Date</FormLabel>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Time</FormLabel>
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Family Appointment</FormLabel>
          <Checkbox isChecked={isFamily} onChange={() => setIsFamily(!isFamily)}>
            Is Family Appointment
          </Checkbox>
        </FormControl>

        <Button colorScheme="teal" onClick={handleSubmit}>
          Create Appointment
        </Button>
      </VStack>
    </Box>
  );
};

export default AppointmentForm;
