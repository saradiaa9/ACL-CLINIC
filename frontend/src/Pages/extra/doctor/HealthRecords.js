import { Box, Heading, Text, VStack, Divider, useColorModeValue } from '@chakra-ui/react';
import { React, useState, useEffect } from 'react';
import axios from 'axios';

const DoctorHealthRecords = () => {
  const params = new URLSearchParams(window.location.search);
  const DoctorUsername = params.get('DoctorUsername'); // Adjust this parameter based on the doctor's URL structure
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('black', 'white');
  const [healthRecords, setHealthRecords] = useState([]);

  const getHealthRecords = async () => {
    try {
      const response = await axios.get(`/Doctor/getRecords?DoctorUsername=${DoctorUsername}`);
      if (Array.isArray(response.data)) {
        setHealthRecords(response.data);
      } else {
        console.error('Health records are not in the expected format:', response.data);
        // Handle the case where the data is not in the expected format
      }
    } catch (error) {
      console.error('Error fetching health records:', error);
      // Handle errors from the API call
    }
  };

  useEffect(() => {
    getHealthRecords();
  }, []);

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4} color="blue.500">
        Health Records
      </Heading>
      <VStack align="stretch" spacing={4}>
      {healthRecords.length === 0 ? (
        <Text>No health records found for this doctor</Text>
      ) : (
        healthRecords.map((record, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="md"
              p={4}
              bg={cardBgColor}
              color={textColor}
              bgColor="blue.100"
              boxShadow="lg"
            >
              <Text fontSize="lg" fontWeight="bold">
                Patient's Username: {record.PatientUsername}
              </Text>
              <Divider my={2} borderColor={textColor} />
              <Text>
                <strong>Description:</strong> {record.Description}
              </Text>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default DoctorHealthRecords;
