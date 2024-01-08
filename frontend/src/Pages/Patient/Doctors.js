import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Input,
    Button,
    List,
    ListItem,
    Text,
    Spinner,
    Flex,
    Select,
    SimpleGrid,
} from '@chakra-ui/react';
import { useAuthContext } from '../../Hooks/useAuthContext';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';


const DoctorsPage = () => {
    const { user, loading } = useAuthContext();
    const Username = user?.Username;
    const [doctors, setDoctors] = useState([]);
    const [patient, setPatient] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [filterDatetime, setFilterDatetime] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDoctorDetails, setSelectedDoctorDetails] = useState(null);
    const navigate = useNavigate();
    
    const fetchDoctors = async () => {
    try {
      console.log(Username);
      const response = await Axios.get(`/Patient/viewDoctors?Username=${Username}`);

      if (response.status === 200) {
        const data = response.data;
        setDoctors(data);
      } else {
        console.error('Failed to fetch doctors');
      }
    } catch (error) {
      console.error('Error fetching doctors', error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (patient) {
      fetchDoctors();
    }
  }, [patient]);

  useEffect(() => {
    if (user) {
      Axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }
  }, [user]);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        if (user && Username) {
          const response = await Axios.get(`/Patient/getPatientDetails?Username=${Username}`);
          console.log(response.data);
          setPatient(response.data);
        }
      } catch (error) {
        console.error('Error fetching patient details', error);
      }
    };

    fetchPatientDetails();
  }, [user, Username]);

    const fetchDoctorDetails = async (doctorUsername) => {
        try {
            const response = await Axios.get(`/Patient/viewDoctorDetails?doctorUsername=${doctorUsername}`);

            if (response.status === 200) {
                const data = response.data;
                setSelectedDoctorDetails(data);
            } else {
                console.error('Failed to fetch doctor details');
            }
        } catch (error) {
            console.error('Error fetching doctor details', error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await Axios.get(`/Patient/searchDoctor?Username=${Username}&Name=${name}&Specialty=${specialty}`);

            if (response.status === 200) {
                const data = response.data;
                setDoctors(data);
            } else {
                console.error('Failed to fetch search results');
            }
        } catch (error) {
            console.error('Error fetching search results', error);
        }
    };

    const handleFilter = async () => {
        try {
            const response = await Axios.get(`/Patient/filterDoctors?Username=${Username}&date=${filterDatetime}&Specialty=${specialty}`);

            if (response.status === 200) {
                const data = response.data;
                setDoctors(data);
            } else {
                console.error('Failed to fetch filtered results');
            }
        } catch (error) {
            console.error('Error fetching filtered results', error);
        }
    };

    const handleDoctorClick = (doctor) => {
        setSelectedDoctor(doctor);
        fetchDoctorDetails(doctor.Username);
    };

    const formatTime = (dateString) => {
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        return new Date(dateString).toLocaleTimeString(undefined, options);
      };

    const handleGo = () => {
      navigate(`/patient/doctor/${selectedDoctor.Username}`);
    };
      
    


    const handleVideoCall = () => {
      window.location.href = `videocall`;
    };

    return (
        <Flex
      direction="column"
      // alignItems="center"
      padding="1rem"
    >
        <Box
        bg="#93B1A6"
        p={2}
        borderRadius="md"
        position="absolute"
        top={3}
        right={55}
        mr={5}
      >
        <Text color="#183D3D">Wallet: ${patient?.Wallet}</Text>
      </Box>

      <Box
          width="100%"
          maxWidth="835px"
          textAlign="center"
          backgroundColor="#f5f5f5"
          borderRadius="4px"
          margin="1rem"
          padding="1rem"
          left={30}
          height="100%"
          ml={365}
        >
            <Flex direction="row">
            <Input
            mb={2}
            placeholder="Doctor Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            mt={2}
            width="400px"
            ml={-2}
          />
          
          <Input
            mb={2}
            placeholder="Doctor Specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            mt={2}
            width="400px"
            ml={2}
          />
          </Flex>
          
          <Button bg="#93B1A6" color={'white'} onClick={handleSearch} mt={4}>
            Search
          </Button>

          <Flex direction="row" mt={2}>
          <Select
              mb={2}
              placeholder="Select Specialty"
              value={specialty}
              onChange={e => setSpecialty(e.target.value)}
              mt={2}
              width="400px"
            ml={-2}
            >
                { doctors && doctors.map((doctor, index) => (
                    <option value={doctor.Specialty}>{doctor.Specialty}</option>
                ))}

            </Select>
          
          <Input
            mb={2}
            placeholder="Date and Time"
            value={filterDatetime}
            onChange={(e) => setFilterDatetime(e.target.value)}
            mt={2}
            width="400px"
            ml={2}
            type='datetime-local'
          />
          </Flex>

          <Button bg="#93B1A6" color={'white'} onClick={handleFilter} mt={4}>
            Filter
          </Button>

            </Box>


            {selectedDoctor && selectedDoctorDetails && (
                <Flex direction="row" marginLeft={350} marginTop={10}>
            <Box
          width="100%"
          maxWidth="400px"
          textAlign="center"
          backgroundColor="#f5f5f5"
          borderRadius="4px"
          margin="1rem"
          padding="1rem"
          left={30}
          height="100%"
          
          mb={0}
        >
            <Text
            fontSize="1.5rem"
            fontWeight="bold"
            marginBottom="1rem"
            color="#183D3D"
          >
            DOCTOR DETAILS
          </Text>
          <Heading fontSize="md" color="#5C8374" mb={1} ml={5}>
                {selectedDoctorDetails?.Name}
              </Heading>
              <Text marginBottom="1" ml={5}>{selectedDoctorDetails?.Email}</Text>
              <Text marginBottom="1" ml={5}>{selectedDoctorDetails?.HourlyRate}</Text>
              <Text marginBottom="1" ml={5}>{selectedDoctorDetails?.Affiliation}</Text>
              <Text marginBottom="1" ml={5}>{selectedDoctorDetails?.EducationalBackground}</Text>
              <Text marginBottom="1" ml={5}>{selectedDoctorDetails?.Specialty}</Text>
              
          

            </Box>


            <Box
          width="100%"
          maxWidth="400px"
          textAlign="center"
          backgroundColor="#f5f5f5"
          borderRadius="4px"
          margin="1rem"
          padding="1rem"
          left={30}
          height="100%"
          
          mb={0}
        >
            <Text
            fontSize="1.5rem"
            fontWeight="bold"
            marginBottom="1rem"
            color="#183D3D"
          >
            TIME SLOTS
          </Text>
              { selectedDoctorDetails?.TimeSlots && selectedDoctorDetails?.TimeSlots.map((slot, index) => (
                <Text marginBottom="1" ml={5}>{formatTime(slot)}</Text>
              ))}
          

            </Box>
            </Flex>
            )}

      <Flex direction="row" marginLeft={350} marginTop={10}>

      <Box
          width="100%"
          maxWidth="835px"
          textAlign="center"
          backgroundColor="#f5f5f5"
          borderRadius="4px"
          margin="1rem"
          padding="1rem"
          left={30}
        >
            <Text
            fontSize="1.5rem"
            fontWeight="bold"
            marginBottom="1rem"
            color="#183D3D"
          >
            AVAILABLE DOCTORS
          </Text>
          {selectedDoctor && (
          <><Button bg="#93B1A6" color={'white'} onClick={handleGo} mt={4} mr={4}>
                Go to Doctor
          </Button><Button bg="#93B1A6" color={'white'} onClick={handleGo} mt={4} mr={4}>
                  Start a chat
          </Button><Button bg="#93B1A6" color={'white'} onClick={handleVideoCall} mt={4} mr={4}>
                  Start a video call
          </Button></>
          )}
          <SimpleGrid columns={2} spacing={3} mt={5}>
          { doctors && doctors.map((doctor, index) => (
            <List key={index}>
            <ListItem
              key={index}
              borderWidth="1px"
              borderRadius="lg"
              padding={4}
              backgroundColor={ selectedDoctor === doctor ? '#93B1A6' : 'white'}
              textAlign={'center'}
              alignItems={'center'}
              _hover={{ bg: '#93B1A6'}}
              cursor={'pointer'}
              onClick={() => handleDoctorClick(doctor)}
              
            >
              <Heading fontSize="md" color="#5C8374" mb={1} ml={5}>
                {doctor?.Name}
              </Heading>
              <Text marginBottom="1" ml={5}>{doctor?.Specialty}</Text>
              <Text marginBottom="1" ml={5}>${doctor?.SessionPrice}</Text>


            </ListItem>
            </List>
          ))}
        </SimpleGrid>
            </Box>
      </Flex>
    </Flex>
    );
}


export default DoctorsPage;
