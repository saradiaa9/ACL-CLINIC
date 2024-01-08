// ... (imports)
import {
  Button,
  Box,
  Flex,
  Text,
  useToast,
  Spinner,
  Input,
} from '@chakra-ui/react';
import { React, useState, useEffect } from 'react';
import { useAuthContext } from '../../Hooks/useAuthContext';
import Axios from 'axios';

const Dashboard = () => {
  const { user, loading } = useAuthContext();
  const [walletBalance, setWalletBalance] = useState(0);
  const Username = user?.Username;
  const [doctor, setDoctor] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [email, setEmail] = useState(doctor?.Email || ''); // State for email
  const [hourlyRate, setHourlyRate] = useState(doctor?.HourlyRate || ''); // State for hourly rate
  const [affiliation, setAffiliation] = useState(doctor?.Affiliation || ''); // State for affiliation
  const toast = useToast();
  const [edit, setEdit] = useState(false); // State for edit mode

  const fetchDoctor = async () => {
    try {
      // Check if doctor details have already been fetched
      
      if (!doctor && user && user.Username) {
        const response = await Axios.get(
          `/Doctor/getDoctorDetails?Username=${Username}`
        );
        console.log(response.data);
        setDoctor(response.data);
      }
    } catch (error) {
      console.error('Error fetching doctor:', error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      Axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }

    fetchDoctor();
  }, [user, Username, doctor]); // Include 'doctor' in the dependency array

  const handleEmailChange = e => setEmail(e.target.value);
  const handleHourlyRateChange = e => setHourlyRate(e.target.value);
  const handleAffiliationChange = e => setAffiliation(e.target.value);

  const handleSubmit = async () => {
    try {
      // Validation: Check if at least one field is filled
      if (!email && !hourlyRate && !affiliation) {
        toast({
          title: 'Enter Data',
          description: 'Please enter at least one field.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const response = await Axios.put(`/Doctor/update?Username=${Username}`, {
        Email: email,
        HourlyRate: hourlyRate,
        Affiliation: affiliation,
      });
      console.log(response.data);
      toast({
        title: 'Success!',
        description: 'Successfully updated your details.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      fetchDoctor();
      window.location.reload();
    } catch (error) {
      console.error('Error updating doctor:', error);
      toast({
        title: 'An error occurred.',
        description: 'Unable to update your details.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading || dataLoading) {
    return (
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
    );
  }

  // Function to format date to display only the date portion
  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
        <Text color="#183D3D">Wallet: ${doctor?.Wallet}</Text>
      </Box>
      {/* My Details section */}
      <Flex direction="row" marginLeft={200} marginTop={0}  justifyContent={'center'}>
        {' '}
        {/* Use Flex for horizontal arrangement */}
        {/* First box */}
        <Box
          width="100%"
          maxWidth="400px"
          textAlign="center"
          backgroundColor="#f5f5f5"
          borderRadius="4px"
          margin="1rem"
          padding="1rem"
          left={30}
          
        >
          <Text fontSize="1.5rem" fontWeight="bold" marginBottom="1rem" color="#183D3D">
            MY DETAILS
          </Text>
          <Text marginBottom="1" color="#5C8374">
            <strong>USERNAME</strong> 
          </Text>
          <Text marginBottom="1" >{doctor?.Username}</Text>
          <Text marginBottom="1" color="#5C8374">
            <strong>NAME</strong> 
          </Text>
          <Text marginBottom="1" >{doctor?.Name}</Text>
          <Text marginBottom="1" color="#5C8374">
            <strong>DATE OF BIRTH</strong> 
          </Text>
          <Text marginBottom="1" >{formatDate(doctor?.DateOfBirth)}</Text>
          <Text marginBottom="1" color="#5C8374">
            <strong>EDUCATIONAL BACKGROUND</strong>
          </Text>
          <Text marginBottom="1" >{doctor?.EducationalBackground}</Text>
          <Text marginBottom="1" color="#5C8374">
            <strong>HOURLY RATE</strong>
          </Text>
          <Text marginBottom="1" >{doctor?.HourlyRate}</Text>
          <Text marginBottom="1" color="#5C8374">
            <strong>SPECIALTY</strong>
          </Text>
          <Text marginBottom="1" >{doctor?.Specialty}</Text>
          <Text marginBottom="1" color="#5C8374">
            <strong>EMAIL</strong>
          </Text>
          <Text marginBottom="1" >{doctor?.Email}</Text>
          <Text marginBottom="1" color="#5C8374">
            <strong>AFFILIATION</strong>
          </Text>
          <Text marginBottom="1" >{doctor?.Affiliation}</Text>
          <Button bg="#93B1A6" onClick={() => setEdit(!edit)} color={'white'} mt={5}>
            Edit Details
          </Button>
        </Box>
        {edit && <Box
          width="100%"
          maxWidth="400px"
          textAlign="center"
          backgroundColor="#f5f5f5"
          borderRadius="4px"
          margin="1rem"
          padding="1rem"
          left={30}
          height="100%"
        >
          <Text fontSize="1.5rem" fontWeight="bold" marginBottom="1rem" color="#183D3D">
            EDIT MY DETAILS
          </Text>
          <Text marginBottom="2rem" color="#5C8374">
            <strong>EMAIL</strong> <br />
          </Text>
          {/* Input fields for editing email, hourly rate, and affiliation */}
          <Input
            marginBottom="2rem"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <Text marginBottom="2rem" color="#5C8374">
            <strong>HOURLY RATE</strong> <br />
          </Text>
          <Input
            marginBottom="2rem"
            placeholder="Hourly Rate"
            value={hourlyRate}
            onChange={handleHourlyRateChange}
          />
          <Text marginBottom="2rem" color="#5C8374">
            <strong>AFFILIATION</strong> <br />
          </Text>
          <Input
            marginBottom="2rem"
            placeholder="Affiliation"
            value={affiliation}
            onChange={handleAffiliationChange}
          />
          {/* Submit button */}
          <Button bg="#93B1A6" onClick={handleSubmit} color={'white'}>
            Submit
          </Button>
        </Box>
        }
      </Flex>
    </Flex>
  );
};

export default Dashboard;
