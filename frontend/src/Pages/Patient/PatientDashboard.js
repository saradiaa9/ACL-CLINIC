 // ... (imports)
import {
  Button,
  Box,
  Flex,
  Text,
  useToast,
  Spinner,
  Input,
  VStack,
} from '@chakra-ui/react';
import { React, useState, useEffect } from 'react';
import { useAuthContext } from '../../Hooks/useAuthContext';
import Axios from 'axios';

const Dashboard = () => {
  const { user, loading } = useAuthContext();
  const Username = user?.Username;
  const [patient, setPatient] = useState(null);
  const [packages, setPackages] = useState(null); // Array of packages
  const [dataLoading, setDataLoading] = useState(true);
  const [file, setFile] = useState('');
  const toast = useToast();

  const fetchPatient = async () => {
    try {
      if (user && Username) {
        // Check if doctor details have already been fetched
        if (!patient) {
          const response = await Axios.get(
            `/Patient/getPatientDetails?Username=${Username}`
          );
          console.log(response.data);
          setPatient(response.data);
          setPackages(response.data.Package);
        }
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      Axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }

    fetchPatient();
  }, [user, Username, patient]); // Include 'doctor' in the dependency array

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

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file); // .get('file')
    Axios
      .post(`/uploadDoc?UsernameOrMedicineName=${Username}&Type=`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        toast({
          title: 'Document Uploaded',
          description: 'Your document has been uploaded successfully',
          status: 'success',
          duration: 9000,
          isClosable: true,
          onCloseComplete: () => {
            window.location.reload();
          },
        });
      })
      .catch(err => {
        toast({
          title: 'Document Uploaded',
          description: 'Your document has been uploaded successfully',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        console.log(err);
      });
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
      {/* My Details section */}
      <Flex direction="row" marginLeft={350} marginTop={10}>
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
          <Text
            fontSize="1.5rem"
            fontWeight="bold"
            marginBottom="1rem"
            color="#183D3D"
          >
            MY DETAILS
          </Text>
          <Text marginBottom="1" color="#5C8374">
            <strong>USERNAME</strong>
          </Text>
          <Text marginBottom="1">{patient?.Username}</Text>
          <Text marginBottom="1" color="#5C8374">
            <strong>NAME</strong>
          </Text>
          <Text marginBottom="1">{patient?.Name}</Text>
          <Text marginBottom="1" color="#5C8374">
            <strong>DATE OF BIRTH</strong>
          </Text>
          <Text marginBottom="1">{formatDate(patient?.DateOfBirth)}</Text>

          <Text marginBottom="1" color="#5C8374">
            <strong>EMAIL</strong>
          </Text>
          <Text marginBottom="1">{patient?.Email}</Text>
          <Text marginBottom="1" color="#5C8374">
            <strong>NATIONAL ID</strong>
          </Text>
          <Text marginBottom="1">{patient?.NationalID}</Text>
          <Text marginBottom="1" color="#5C8374">
            <strong>GENDER</strong>
          </Text>
          <Text marginBottom="1">{patient?.Gender}</Text>
          <Text marginBottom="1" color="#5C8374">
            <strong>MOBILE NUMBER</strong>
          </Text>
          <Text marginBottom="1">
            {' '}
            {patient ? '+20 ' + patient.MobileNumber : 'No Number'}
          </Text>
          <VStack>
            <Input
                    type="file"
                    accept=".pdf, image/*"
                    encType="multipart/form-data"
                    onChange={handleFileChange}
                  />
            <Button
              colorScheme="teal"
              variant="solid"
              marginTop="1rem"
              onClick={handleUpload}
            >
              Upload Document
            </Button>
          </VStack>
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
        >
          <Text
            fontSize="1.5rem"
            fontWeight="bold"
            marginBottom="1rem"
            color="#183D3D"
          >
            MY PACKAGE
          </Text>
          {packages && (
            <div>
              <Text marginBottom="1" color="#5C8374">
                <strong>NAME</strong>
              </Text>
              <Text marginBottom="1">{packages.Name || 'N/A'}</Text>
              <Text marginBottom="1" color="#5C8374">
                <strong>ANNUAL PRICE</strong>
              </Text>
              <Text marginBottom="1">
                {'$' + packages.AnnualPrice || 'N/A'}
              </Text>
              <Text marginBottom="1" color="#5C8374">
                <strong>DOCTOR DISCOUNT</strong>
              </Text>
              <Text marginBottom="1">
                {packages.DoctorDiscount + '%' || 'N/A'}
              </Text>
              <Text marginBottom="1" color="#5C8374">
                <strong>MEDICINE DISCOUNT</strong>
              </Text>
              <Text marginBottom="1">
                {packages.MedicineDiscount + '%' || 'N/A'}
              </Text>
              <Text marginBottom="1" color="#5C8374">
                <strong>FAMILY DISCOUNT</strong>
              </Text>
              <Text marginBottom="1">
                {packages.FamilyDiscount + '%' || 'N/A'}
              </Text>
              <Text marginBottom="1" color="#5C8374">
                <strong>START DATE</strong>
              </Text>
              <Text marginBottom="1">
                {patient.PackageStatus.StartDate
                  ? formatDate(patient.PackageStatus.StartDate)
                  : 'N/A'}
              </Text>
              <Text marginBottom="1" color="#5C8374">
                <strong>END DATE</strong>
              </Text>
              <Text marginBottom="1">
                {patient.PackageStatus.StartDate
                  ? formatDate(patient.PackageStatus.EndDate)
                  : 'N/A'}
              </Text>
            </div>
          )}
          {!packages && (
            <div>
              <Text marginBottom="1">No package subscribed</Text>
            </div>
          )}
        </Box>
      </Flex>
      <Box
        width="100%"
        maxWidth="830px"
        textAlign="center"
        backgroundColor="#f5f5f5"
        borderRadius="4px"
        margin="1rem"
        padding="1rem"
        left={30}
        ml={365}
      >
        <Text
          fontSize="1.5rem"
          fontWeight="bold"
          marginBottom="1rem"
          color="#183D3D"
        >
          MY EMERGENCY CONTACT
        </Text>
        {patient?.EmergencyContact ? (
          <>
            <Text marginBottom="1" color="#5C8374">
              <strong>NAME</strong>
            </Text>
            <Text marginBottom="1">
              {patient.EmergencyContact.Name || 'No Name'}
            </Text>
            <Text marginBottom="1" color="#5C8374">
              <strong>MOBILE NUMBER</strong>
            </Text>
            <Text marginBottom="1">
              {patient.EmergencyContact.MobileNumber
                ? `+20 ${patient.EmergencyContact.MobileNumber}`
                : 'No Number'}
            </Text>
          </>
        ) : (
          <Text marginBottom="1">No emergency contact information</Text>
        )}
      </Box>
    </Flex>
  );
};

export default Dashboard;
