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
  useToast
} from '@chakra-ui/react';
import Axios from 'axios';
import { useAuthContext } from '../../Hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

const DoctorAppointments = () => {
  const { user, loading } = useAuthContext();
  const Username = user?.Username;
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const toast = useToast();

  const fetchDoctorSchedules = async () => {
    try {
      const response = await Axios.get(`/Doctor/getFollowup?Username=${Username}`);
      setSchedules(response.data.followups);
      
    } catch (error) {
      console.error('Error fetching doctor followups:', error);
    }
  };

  useEffect(() => {
    if (user) {
      Axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }

    fetchDoctorSchedules();
  }, [Username, user]);

  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
  };




const formatDateTime = dateTimeString => {
    const options = { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric',  
      hour12: true 
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };
  
  const handleGoToPatient = () => {
    if (selectedSchedule && selectedSchedule.patient) {
      const patientUsername = selectedSchedule.patient.Username;
      navigate(`/thispatient/${patientUsername}`);  // Use navigate to redirect
    }
  };

  const handleReject = async () => {
    if (selectedSchedule && selectedSchedule.patient) {
        try{
            
            const response = await Axios.post(
                `/Doctor/rejectFollowup?Username=${Username}`,{
                    patientUsername: selectedSchedule.patient.Username,
                    dateFrom: selectedSchedule.dateFrom
                }
              );
              
              toast({
                title: 'Followup Rejected',
                description: 'You have rejected the followup successfully.',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
              fetchDoctorSchedules();
              setSelectedSchedule('')
        }catch (error) {
            console.error('Error rejecting followup:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject the followup. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
        }
    }
  }

  const handleAccept = async () => {
    if (selectedSchedule && selectedSchedule.patient) {
        try{
            const response = await Axios.post(
                `/Doctor/acceptFollowup?Username=${Username}`,{
                    patientUsername: selectedSchedule.patient.Username,
                    dateFrom: selectedSchedule.dateFrom
                }
              );
              toast({
                title: 'Followup Accepted',
                description: 'You have accepted the followup successfully.',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
              fetchDoctorSchedules();
              setSelectedSchedule('')
        }catch (error) {
            console.error('Error accepting followup:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept the followup. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
        }
    }
  }

  return (
    <Flex direction="column" padding="1rem" ml={340} mt={50}>

      {/* My Details section */}
      <Box
        width="100%"
        maxWidth="600px"
        textAlign="center"
        backgroundColor="#f5f5f5"
        borderRadius="4px"
        margin="1rem"
        padding="1rem"
        ml={150}
      >
        <Text fontSize="1.5rem" fontWeight="bold" marginBottom="1rem" color="#183D3D">
          MY FOLLOWUP REQUESTS
        </Text>
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
          <Box>
            <List spacing={3}>
              { schedules && schedules.map((schedule, index) => (
                <ListItem
                  key={index}
                  borderWidth="1px"
                  borderRadius="lg"
                  padding={4}
                  backgroundColor={selectedSchedule === schedule ? '#93B1A6' : "white"}
                  onClick={() => handleScheduleClick(schedule)}
                  cursor="pointer"
                  _hover={{ bg: '#93B1A6' }}
                >
                  <Heading fontSize="md">{schedule.patient ? schedule.patient.Name : 'No Patient'} </Heading>
                  <Heading fontSize="md">{schedule.patient ? schedule.patient.MobileNumber : 'No Number'} </Heading>
                  <Text fontSize="sm" color="black" >
                    {formatDateTime(schedule.dateFrom)}
                  </Text>
                </ListItem>
              ))}
            </List>
            {selectedSchedule && <Button bg="#93B1A6" color="white" mt={5} ml={0} onClick={handleReject}>
              Reject Followup
            </Button>
            }
             {selectedSchedule && schedules && <Button bg="#183D3D" color="white" mt={5} ml={2} onClick={handleGoToPatient}>
              Go To Patient
            </Button>
            }
            {selectedSchedule && <Button bg="#93B1A6" color="white" mt={5} ml={2} onClick={handleAccept}>
              Accept Followup
            </Button>
            }
            

          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default DoctorAppointments;
