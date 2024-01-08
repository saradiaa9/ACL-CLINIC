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
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import Axios from 'axios';
import { useAuthContext } from '../../Hooks/useAuthContext';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
const Doctor = () => {
  const { user, loading } = useAuthContext();
  const Username = user?.Username;
  const Doctor = useParams();
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();
  const [dataLoading, setDataLoading] = useState(true);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [patient, setPatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
    const [date, setDate] = useState(null);
    const toast = useToast();
    const [schedule, setSchedule] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(false);
    const [reDate, setReDate] = useState(null);
    const [fDate, setFDate] = useState(null);
    const [alert , setAlert] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchDoctor = async () => {
    try {
      if (!doctor) {
        const response = await Axios.get(`/Doctor/getDoctorDetails?Username=${Doctor.Username}`);
        console.log(response.data);
        setDoctor(response.data);
      }

      const fam = await Axios.get(`/Patient/getFamilyMembers?Username=${Username}`);
      setFamilyMembers(fam.data);

      const patients = await Axios.get(`/Patient/getPatientDetails?Username=${Username}`);
      setPatient(patients.data);
      
      setSelectedPatient(patients.data.Name);

      const schedule = await Axios.get(`/Patient/getAppDoctorPatient?Username=${Username}&doctorUsername=${doctor.Username}`); 

      setSchedule(schedule.data);
      console.log(schedule.data);
      
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      Axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }

    fetchDoctor();
  }, [user, Username, doctor]);



  const formatDateTime = dateString => {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = dateString => {

    return new Date(dateString).toLocaleTimeString();
    }

    const handleSchedule = async () => {
      onOpen(); // Open the confirmation dialog
    };

    const handleConfirmSchedule = async paymentMethod => {
      onClose(); // Close the confirmation dialog
  
      const handleScheduling = async ( paymentMethod) => {
        try {
          const response = Axios.post(
            `/Schedule/add?Username=${Doctor.Username}`,
            {
              patientUsername: Username, dateFrom: date,
              paymentMethod, // Pass the selected payment method
            }
          );
      
          console.log(response.data);
            
            toast({
                title: 'Appointment Scheduled',
                description: 'Appointment Scheduled Successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            console.log(paymentMethod);
          // Redirect based on payment method
          if (paymentMethod === 'Credit Card') {
            const response = await Axios.post(`/Patient/PaymentMethod?Username=${Username}`, {
              doctorId: doctor._id,
            });
            console.log(response.data);
         
           
            
            if (response.data.url) {
              window.open(response.data.url, '_blank');
            } 
          } else if (paymentMethod === 'Wallet') {
            await Axios.post(`/Patient/payWallet?Username=${Username}`, {
              doctorId: doctor._id,
            });
            window.location.reload();
          }
        } catch (error) {
          console.error('Error rescheduling appointment:', error);
            toast({
                title: 'Error',
                description: 'Error rescheduling appointment',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
      };
      
      
        await handleScheduling( paymentMethod); // Ensure paymentMethod is passed here
      
    }
  

   

    const handleReSchedule = async () => {
        try {
            const response = await Axios.post(`/Patient/rescheduleApp?Username=${doctor.Username}`,
            {
                patientUsername: Username, dateFrom: selectedAppointment.dateFrom, newDate: reDate
            });
            console.log(response.data);
            
            toast({
                title: 'Appointment Rescheduled',
                description: 'Appointment Rescheduled Successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

        } catch (error) {
            console.error('Error rescheduling appointment:', error);
            toast({
                title: 'Error',
                description: 'Error rescheduling appointment',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }

    const handleFollowup = async () => {
      try {
        const isFamily=true;
        if(selectedPatient.Username === Username){
          isFamily=false;
        }

        const newf = new Date(fDate); // Assuming fDate is a Date object

        const date = newf.toISOString(); // Extracting the date

        

          const response = await Axios.post(`/Patient/requestFollowup?Username=${Username}&doctorUsername=${doctor.Username}`,
          {
              date: date, isFamily
          });
          console.log(response.data);
          
          toast({
              title: 'Followup Requested',
              description: 'Followup Requested Successfully',
              status: 'success',
              duration: 5000,
              isClosable: true,
          });
          window.location.reload();

      } catch (error) {
          console.error('Error requesting followup:', error);
          toast({
              title: 'Error',
              description: 'Error requesting followup',
              status: 'error',
              duration: 5000,
              isClosable: true,
          });
      }
  }
  

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
        <Text
          fontSize="1.5rem"
          fontWeight="bold"
          marginBottom="1rem"
          color="#183D3D"
        >
          DOCTOR DETAILS
        </Text>

        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tr>
            <td
              style={{
                borderRight: '2px solid #C0C0C0',
                paddingLeft: '5px',
                paddingRight: '5px',
              }}
            >
              <Text marginBottom="1" color="#5C8374">
                <strong>NAME</strong>
              </Text>
              <Text marginBottom="1">{doctor?.Name}</Text>
            </td>
            <td
              style={{
                borderRight: '2px solid #C0C0C0',
                paddingLeft: '5px',
                paddingRight: '5px',
              }}
            >
              <Text marginBottom="1" color="#5C8374">
                <strong>DATE OF BIRTH</strong>
              </Text>
              <Text marginBottom="1">{formatDate(doctor?.DateOfBirth)}</Text>
            </td>
            <td
              style={{
                borderRight: '2px solid #C0C0C0',
                paddingLeft: '5px',
                paddingRight: '5px',
              }}
            >
              <Text marginBottom="1" color="#5C8374">
                <strong>EMAIL</strong>
              </Text>
              <Text marginBottom="1" mt={6}>
                {doctor?.Email}
              </Text>
            </td>
            <td
              style={{
                borderRight: '2px solid #C0C0C0',
                paddingLeft: '5px',
                paddingRight: '5px',
              }}
            >
              <Text marginBottom="1" color="#5C8374">
                <strong>HOURLY RATE</strong>
              </Text>
              <Text marginBottom="1">
                {doctor? doctor.HourlyRate : 'No Hourly Rate'}
              </Text>
            </td>
            <td
              style={{
                borderRight: '2px solid #C0C0C0',
                paddingLeft: '5px',
                paddingRight: '5px',
              }}
            >
              <Text marginBottom="1" color="#5C8374">
                <strong>AFFILIATION</strong>
              </Text>
              <Text marginBottom="1" mt={6}>
                {doctor?.Affiliation}
              </Text>
            </td>
            <td
              style={{
                borderRight: '2px solid #C0C0C0',
                paddingLeft: '5px',
                paddingRight: '5px',
              }}
            >
              <Text marginBottom="1" color="#5C8374">
                <strong>EDUCATIONAL BACKGROUND</strong>
              </Text>
              <Text marginBottom="1">{doctor?.EducationalBackground}</Text>
            </td>
            <td
              style={{
                
                paddingLeft: '5px',
                paddingRight: '5px',
              }}
            >
              <Text marginBottom="1" color="#5C8374">
                <strong>SPECIALTY</strong>
              </Text>
              <Text marginBottom="1">{doctor?.Specialty}</Text>
            </td>
            
          </tr>
        </table>
        </Box>
        <Flex direction="row" >
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
          ml={365}
        >
            <Text
          fontSize="1.5rem"
          fontWeight="bold"
          marginBottom="1rem"
          color="#183D3D"
        >
          DOCTOR TIME SLOTS
        </Text>
        <List spacing={3}>
            {doctor?.TimeSlots?.map((slot, index) => (
                <ListItem key={index}
                borderWidth="1px"
                borderRadius="lg"
                padding={4}
                _hover={{ bg: '#93B1A6' }}>
                <Text marginBottom="1" color="#5C8374">
                    {formatTime(slot)}
                </Text>
                </ListItem>
            ))}
        </List>

        
        </Box>

        
            </Flex>
            <Flex direction="row" >
            <Flex
      direction="column"
      // alignItems="center"
      padding="1rem"
      ml={-4}
      mr={5}
      mt={-4}
    >

<Box
          width="100%"
          maxWidth="400px"
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
          SCHEDULE APPOINTMENT
        </Text>
        <Select  onChange={e => setSelectedPatient(e.target.value)}>
            <option value={patient?.Name}>{patient?.Name}</option>
            {familyMembers.map((member, index) => (
                <option key={index} value={member.Name}>{member.Name}</option>
            ))}
        </Select>
        {selectedPatient && (
            <Input type="datetime-local" onChange={e => setDate(e.target.value)} mt={5} />
            ) 
        }
            
            {selectedPatient && date && (
            <Button onClick={handleSchedule} backgroundColor="#5C8374" color="white" mt={4}>
                Schedule Appointment
            </Button>
            )
            }


        
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
          
          ml={365}
        >
            <Text
          fontSize="1.5rem"
          fontWeight="bold"
          marginBottom="1rem"
          color="#183D3D"
        >
          RESCHEDULE APPOINTMENT
        </Text>
        <Select  onChange={e => setSelectedPatient(e.target.value)}>
            <option value={patient?.Name}>{patient?.Name}</option>
            {familyMembers.map((member, index) => (
                <option key={index} value={member.Name}>{member.Name}</option>
            ))}
        </Select>
        <Input type="datetime-local" onChange={e => setReDate(e.target.value)} mt={5} />
        {selectedAppointment && reDate && (
            <Button onClick={handleReSchedule} backgroundColor="#5C8374" color="white" mt={4}>
                Reschedule Appointment
            </Button>
            
            )}


        
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
          
          ml={365}
        >
            <Text
          fontSize="1.5rem"
          fontWeight="bold"
          marginBottom="1rem"
          color="#183D3D"
        >
          REQUEST FOLLOWUP
        </Text>
        <Select  onChange={e => setSelectedPatient(e.target.value)}>
            <option value={patient?.Name}>{patient?.Name}</option>
            {familyMembers.map((member, index) => (
                <option key={index} value={member.Name}>{member.Name}</option>
            ))}
        </Select>
        <Input type="datetime-local" onChange={e => setFDate(e.target.value)} mt={5} />
        {selectedAppointment && fDate && (
            <Button onClick={handleFollowup} backgroundColor="#5C8374" color="white" mt={4}>
                Request Followup
            </Button>
            
            )}


        
        </Box>

        
        </Flex>
       

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
          MY APPOINTMENTS WITH THIS DOCTOR
        </Text>
        <List spacing={3}>
            {schedule?.map((sch, index) => (
                <ListItem key={index}
                borderWidth="1px"
                borderRadius="lg"
                padding={4}
                bg={selectedAppointment?._id === sch._id ? '#93B1A6' : 'white'}
                onClick= {() => setSelectedAppointment(sch)}
                _hover={{ bg: '#93B1A6' }}
                cursor="pointer"
                >
                
                <Text marginBottom="1" color="black">
                    {formatDateTime(sch.dateFrom)}
                </Text>
                <Text marginBottom="1" color="black">
                    {sch.status}
                </Text>
                </ListItem>
            ))}
        </List>

        
        </Box>
            </Flex>
            
              <AlertDialog isOpen={isOpen} onClose={onClose}>
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader>Confirm Reservation</AlertDialogHeader>
                  <AlertDialogCloseButton />
                  <AlertDialogBody>
                    Are you sure you want to reserve this appointment?
                    <br />
                    Please choose a payment method:
                    {/* Add your payment method options here */}
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button
                      backgroundColor="#183D3D"
                      color="white"
                      onClick={() => handleConfirmSchedule('Credit Card')}
                    >
                      Credit Card
                    </Button>
                    <Button
                      backgroundColor="#183D3D"
                      color="white"
                      ml={3}
                      onClick={() => handleConfirmSchedule('Wallet')}
                    >
                      Wallet
                    </Button>
                    <Button
                      backgroundColor="#183D3D"
                      color="white"
                      ml={3}
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
            
    </Flex>
  );
};

export default Doctor;
