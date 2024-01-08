import { Box, Heading, Text, VStack, Badge, Button, Select, HStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../Hooks/useAuthContext';

const PrescriptionDetails = () => {
  const { user } = useAuthContext();
  const Username = user?.Username;
  const [filter, setFilter] = useState('');
  const [prescriptionData, setPrescriptionData] = useState([]);

  const fetchPrescription = async () => {
    if (user && Username) {
      try {
        const response = await axios.get(`/Patient/viewPrescription?Username=${Username}`);
        if (response.status === 200) {
          setPrescriptionData(response.data);
        } else {
          console.error('Error fetching prescription:', response.data);
        }
      } catch (error) {
        console.error('Error fetching prescription:', error);
      }
    }
  };

  useEffect(() => {
    fetchPrescription();
  }, [user, Username]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredPrescriptions = prescriptionData.filter(prescription => {
    if (!filter) return true;
    if (prescription.DateP) {
      const dateMatch = formatDate(prescription.DateP).includes(filter);
      const statusMatch = prescription.Filled ? 'Filled' : 'Not Filled' === filter;
      return dateMatch || statusMatch;
    }
    return false;
  });

  return (
    <Box p={4} marginLeft={280} bgColor="#f5f5f5" borderRadius={5}>
      <Heading as="h2" size="lg" mb={4} color="#040D12">
        Prescription Details
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
          {prescriptionData.map(prescription => (
            <option key={prescription.DateP} value={formatDate(prescription.DateP)}>
              {formatDate(prescription.DateP)}
            </option>
          ))}
          <option value="Filled">Filled</option>
          <option value="Not Filled">Not Filled</option>
        </Select>
      </HStack>
      <VStack align="stretch" spacing={4}>
        {filteredPrescriptions.length === 0 ? (
          <Text>No prescription found</Text>
        ) : (
          filteredPrescriptions.map((prescription, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="md"
              p={4}
              boxShadow="lg"
            >
              <Text fontSize="lg" fontWeight="bold">
                Date: {formatDate(prescription.DateP)}
              </Text>
              <Text>
                <strong>Doctor:</strong> {prescription.DoctorUsername}
              </Text>
              <Text>
                <strong>Status:</strong> {prescription.Filled ? 'Filled' : 'Not Filled'}
              </Text>
              <Badge colorScheme={prescription.Submitted ? 'green' : 'red'}>
                {prescription.Submitted ? 'Submitted' : 'Not Submitted'}
              </Badge>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default PrescriptionDetails;
