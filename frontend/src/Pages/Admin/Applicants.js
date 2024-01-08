import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Button,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  Flex,
  Stack,
  HStack,
  useToast,
  Text,
  Center,
} from '@chakra-ui/react';
import axios from 'axios';

import { useAuthContext } from '../../Hooks/useAuthContext';

const Applicants = () => {
  const toast = useToast();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [docs, setDocs] = useState([]);

  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (user) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }

    axios
      .get('/Admin/getAllNotDecidedDoctors')
      .then(response => {
        setDoctors(response.data.doctor);
      })
      .catch(error => {
        console.error('Error fetching undecided doctors:', error);
      });
  }, [user, loading]);

  const handleView = doctor => {
    setSelectedDoctor(doctor);
  };

  const handleAccept = () => {
    if (!selectedDoctor) return;

    axios
      .post('/Admin/acceptDoctor', { Username: selectedDoctor.Username })
      .then(response => {
        setDoctors(doctors.filter(doc => doc.Username !== selectedDoctor.Username));
        setSelectedDoctor(null); // Reset selectedDoctor after action
        toast({
          title: 'Success',
          description: 'Doctor accepted.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      })
      .catch(error => {
        console.error('Error accepting doctor:', error);
        toast({
          title: 'Error',
          description: 'Error accepting doctor.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleReject = () => {
    if (!selectedDoctor) return;

    axios
      .post('/Admin/rejectDoctor', { Username: selectedDoctor.Username })
      .then(response => {
        setDoctors(doctors.filter(doc => doc.Username !== selectedDoctor.Username));
        setSelectedDoctor(null); // Reset selectedDoctor after action
        toast({
          title: 'Success',
          description: 'Doctor rejected.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      })
      .catch(error => {
        console.error('Error rejecting doctor:', error);
        toast({
          title: 'Error',
          description: 'Error rejecting doctor.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <HStack align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')} ml={225}>
      <Flex minH={'100vh'} align={'start'} justify={'center'}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg="#f5f5f5"
          p={6}
          my={12}
        >
          <Card bg="#f5f5f5" >
            <Heading lineHeight={1.1} fontSize="4xl" color="#183d3d">
              Doctor Information
            </Heading>

            <CardBody>
              {selectedDoctor && (
                <Stack spacing={4}>
                  {/* Add more details about the selected doctor here */}
                  <Text fontSize="xl" align="center" color="#5c8374" fontWeight="bold">Name</Text>
                  <Text fontSize="lg" align="center">{selectedDoctor.Name}</Text>
                  <Text fontSize="xl" align="center" color="#5c8374" fontWeight="bold">Email </Text>
                  <Text fontSize="lg" align="center">{selectedDoctor.Email}</Text>
                  <Text fontSize="xl" align="center" color="#5c8374" fontWeight="bold">Username </Text>
                  <Text fontSize="lg" align="center">{selectedDoctor.Username}</Text>
                  <Text fontSize="xl" align="center" color="#5c8374" fontWeight="bold">Date of Birth</Text>
                  <Text fontSize="lg" align="center">{new Date(selectedDoctor.DateOfBirth).toLocaleDateString()}</Text>
                  <Text fontSize="xl" align="center" color="#5c8374" fontWeight="bold">Hourly Rate</Text>
                  <Text fontSize="lg" align="center">{selectedDoctor.HourlyRate}</Text>
                  <Text fontSize="xl" align="center" color="#5c8374" fontWeight="bold">Affiliation</Text>
                  <Text fontSize="lg" align="center">{selectedDoctor.Affiliation}</Text>
                  <Text fontSize="xl" align="center" color="#5c8374" fontWeight="bold">Educational Background</Text>
                  <Text fontSize="lg" align="center">{selectedDoctor.EducationalBackground}</Text>
                </Stack>
              )}
              
              {docs.map((doc, index) => (
                <Button
                  key={index}
                  bg={'teal.800'}
                  color={'white'}
                  w="full"
                  _hover={{
                    bg: 'teal.500',
                  }}
                  my={4}
                  onClick={() => {
                    // TODO: View docs
                    window.open(
                      `http://localhost:8000/uploads/${doc}`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }}
                >
                  View {doc}
                </Button>
              ))}
              <Stack direction={['column', 'row']} spacing={6}>
                <Button
                  bg="#93B1A6"
                  color={'white'}
                  w="full"
                  _hover={{
                    bg: '#5C8374',
                  }}
                  onClick={handleAccept}
                  disabled={!selectedDoctor}
                >
                  Accept
                </Button>
                <Button
                  bg={'red.400'}
                  color={'white'}
                  w="full"
                  _hover={{
                    bg: 'red.500',
                  }}
                  onClick={handleReject}
                  disabled={!selectedDoctor}
                >
                  Reject
                </Button>
              </Stack>
            </CardBody>
          </Card>
        </Stack>
      </Flex>

      <Flex ml={'1%'} minH={'100vh'} align={'start'} justify={'center'}>
        <Stack
          direction={['column', 'column', 'row']}
          spacing={4}
          w={['full', 'full', 'full', '2xl']}
          bg="#f5f5f5"
          p={6}
          my={12}
        >
          <Heading size="xl" color="#183d3d">
            Undecided Doctors List
          </Heading>

          <Table variant="simple" size={'xl'}>
            <Thead>
              <Tr>
                <Th size="2xl">Name</Th>
                <Th size="2xl">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {doctors.map(doctor => (
                <Tr key={doctor._id}>
                  <Td size="xl">{doctor.Name}</Td>
                  <Td>
                    <Button onClick={() => handleView(doctor)}  bg="#93b1a6" _hover={{bg: '#5C8374'}} textColor="white">View</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Stack>
      </Flex>
    </HStack>
  );
};

export default Applicants;
