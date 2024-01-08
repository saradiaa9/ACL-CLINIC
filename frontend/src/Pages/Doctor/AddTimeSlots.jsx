import React, { useState, useEffect } from 'react';
import {
  Text,
  useToast,
  Box,
  Flex,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Heading,
  Center,
  Spinner,
  Input,
  Button,
  VStack,
} from '@chakra-ui/react';
import Axios from 'axios';
import { useAuthContext } from '../../Hooks/useAuthContext';

const AddTimeSlots = () => {
  const { user, loading } = useAuthContext();
  const Username = user?.Username;
  const [timeSlots, setTimeSlots] = useState([]);
  const [currentSlots, setCurrentSlots] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (user) {
        Axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      }
      try {
        const response = await Axios.get(
          `/Doctor/getTimeSlots?Username=${Username}`
        );
        setCurrentSlots(response.data.timeSlots);
        setDataLoading(false);
      } catch (error) {
        console.error('Error fetching time slots:', error);
      }
    };

    fetchTimeSlots();
  }, [user, Username, timeSlots]);

  const handleAddTimeSlot = () => {
    // Implement any validation logic here if needed
    // For simplicity, let's assume the user enters a valid time

    // Update the state with the new time slot
    setTimeSlots(prevSlots => [...prevSlots, '']);
  };

  const handleSaveTimeSlots = async () => {
    try {
      // Transform time slots to Date objects before sending to the backend
      const transformedTimeSlots = timeSlots.map(
        (slot) => new Date(`1970-01-01T${slot}`)
      );

      // Perform the API request to save time slots
      await Axios.post(`/Doctor/addSlots?Username=${Username}`, {
        timeSlots: transformedTimeSlots,
      });

      toast({
        title: 'Time Slots Added',
        description: 'Time slots added successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset the timeSlots state to clear the input fields
      setTimeSlots([]);

      // Update the current time slots after adding new slots
      const response = await Axios.get(
        `/Doctor/getTimeSlots?Username=${Username}`
      );
      setCurrentSlots(response.data.timeSlots);

      // Optionally, you can redirect or update the UI as needed
    } catch (error) {
      console.error('Error adding time slots:', error);
      toast({
        title: 'Error',
        description: 'Failed to add time slots. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex direction="column">
      {/* My Details section */}
      <Flex direction="row" justifyContent="center" marginTop={10} marginLeft={150}>
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
          <>
            <Box
              width="100%"
              maxWidth="400px"
              textAlign="center"
              backgroundColor="#f5f5f5"
              borderRadius="4px"
              margin="1rem"
              padding="1rem"
            >
              <Center>
                <Text
                  fontSize="1.5rem"
                  fontWeight="bold"
                  marginBottom="1rem"
                  color="#183D3D"
                >
                  MY TIME SLOTS
                </Text>
              </Center>
              <Center>
                <Table variant="striped" colorScheme="green" mt={3}>
                  <Thead>
                    <Tr>
                      <Th textAlign="center">TIME SLOT</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {currentSlots.map((slot, index) => (
                      <Tr key={index}>
                        <Td>
                          <Heading fontSize="md" textAlign="center">
                            {slot
                              ? new Date(slot).toLocaleTimeString()
                              : 'No Slots'}
                          </Heading>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Center>
            </Box>

            <Box
              width="100%"
              maxWidth="400px"
              textAlign="center"
              backgroundColor="#f5f5f5"
              borderRadius="4px"
              margin="1rem"
              padding="1rem"
            >
              <Text
                fontSize="1.5rem"
                fontWeight="bold"
                marginBottom="65px"
                color="#183D3D"
              >
                ADD TIME SLOTS
              </Text>
              {timeSlots.map((slot, index) => (
                <Input
                  key={index}
                  type="time"
                  mt={3}
                  value={slot}
                  onChange={(e) => {
                    const updatedSlots = [...timeSlots];
                    updatedSlots[index] = e.target.value;
                    setTimeSlots(updatedSlots);
                  }}
                />
              ))}
              <VStack spacing={4} mt={4}>
    <Button bg="#183D3D" onClick={handleAddTimeSlot} color="white">
      Add Time Slot
    </Button>
    {timeSlots.length > 0 && (
      <Button bg="#93B1A6" onClick={handleSaveTimeSlots} color="white">
        Save Time Slots
      </Button>
    )}
  </VStack>
            </Box>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default AddTimeSlots;
