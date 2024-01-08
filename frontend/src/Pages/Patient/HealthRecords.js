import { Box, Heading, Text, VStack, Divider, useColorModeValue } from '@chakra-ui/react';
import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../Hooks/useAuthContext';

const HealthRecords = () => {
  const { user } = useAuthContext();
  const Username = user?.Username;
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('black', 'white');
  const [healthRecords, setHealthRecords] = useState([]);

  const getHealthRecords = async () => {
    try {
      // Check if user and Username are defined before making the API request
      if (user && Username) {
        const response = await axios.get(`/Patient/getRecords?Username=${Username}`);
        if (Array.isArray(response.data)) {
          setHealthRecords(response.data);
        } else {
          console.error('Health records is not an array:', response.data);
          // Handle the case where the data is not in the expected format
        }
      }
    } catch (error) {
      console.error('Error fetching health records:', error);
      // Handle errors from the API call
    }
  };

  useEffect(() => {
    getHealthRecords();
  }, [user, Username]); // Add user and Username to the dependency array

  return (
    <Box p={4} marginLeft={280} bgColor="#f5f5f5" borderRadius={5} >
      <Heading as="h2" size="lg" mb={4} color="black">
        Health Records
      </Heading>
      <VStack align="stretch" spacing={4}>
      {healthRecords.length === 0 ? (
        <Text>No health records found for this patient</Text>
      ) : (
        healthRecords.map((record, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="md"
              p={4}
              bg={cardBgColor}
              color={textColor}
              bgColor="#93B1A6"
              boxShadow="lg"
            >
              <Text fontSize="lg" fontWeight="bold">
                Doctor's Username: {record.DoctorUsername}
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

export default HealthRecords;
