import {
    Box,
    Heading,
    VStack,
    Text,
    Input,
    Select,
    Divider,
    Button,
    Flex,
  } from '@chakra-ui/react';
  import axios from 'axios';
  import { useState, useEffect } from 'react';
  
  import { useAuthContext } from '../Hooks/useAuthContext';
  
  function PatientChat() {
    const { user } = useAuthContext();
    const Username = user?.Username;
  
    const [selectedPatient, setSelectedPatient] = useState({});
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [PatientList, setPatientList] = useState([]);
  
    useEffect(() => {
        if (user) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        }
      
        axios
          .get(`/Patient/get`)
          .then(response => {
            setPatientList(response.data); // Update this line
            console.log(response.data);
          })
          .catch(err => {
            console.log(err);
          });
      }, [user]);
  
    const loadMessages = PatientUsername => {
      axios
        .get(
          `/Chat/getChat?DoctorUsername=${Username}&PatientUsername=${PatientUsername}`
        )
        .then(response => {
          setMessages(response.data.chat);
        })
        .catch(err => {
          console.log(err);
        });
    };
  
    const sendMessage = () => {
      axios
        .post(`/Chat/sendDoctorChat?DoctorUsername=${Username}&PatientUsername=${selectedPatient.Username}&Message=${newMessage}`
        )
        .then(response => {
          setMessages(response.data.chat);
          setNewMessage('');
        })
        .catch(err => {
          console.log(err);
        });
    };
  
    const navbarMargin = '150px';
    const sidebarWidth = '200px';
  
    return (
      <Box align="center" justify="center" ml={sidebarWidth} mt={navbarMargin}>
        <Box maxW="800px">
          <Heading as="h1" size="lg" mb={4}>
            Chat with Patients
          </Heading>
          <VStack align="flex-start" spacing={4} width="100%">
            <Box width="100%">
              <Select
                placeholder="Select a Patient"
                value={selectedPatient ? selectedPatient.Name : ''}
                onChange={e => {
                  const selectedUsername = e.target.value;
                  const Patient = PatientList.find(
                    Patient => Patient.Username === selectedUsername
                  );
                  setSelectedPatient(Patient);
                  loadMessages(Patient.Username);
                  console.log(Patient.Username);
                }}
              >
                {PatientList &&
                  PatientList.map(Patient => (
                    <option key={Patient.Username} value={Patient.Username}>
                      {Patient.Name}
                    </option>
                  ))}
              </Select>
            </Box>
  
            {selectedPatient && (
              <Box
                width="100%"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                bg="white"
                boxShadow="0px 4px 4px rgba(0, 0, 0, 0.1)"
              >
                <Box bg="teal.50" p={3}>
                  <Text fontWeight="bold" fontSize="lg">
                    {selectedPatient.Name}
                  </Text>
                </Box>
                <Box maxHeight="600px" overflowY="auto">
                  {messages.map((message, index) => (
                    <Box
                      key={index}
                      p={2}
                      borderBottom="1px"
                      borderBottomColor="gray.400"
                      bg={message.Sender === Username ? 'gray.200' : 'blue.100'}
                      mt={2}
                    >
                      <Text
                        fontWeight={
                          message.Sender === Username ? 'bold' : 'normal'
                        }
                      >
                        {message.Sender}: {message.Message}
                      </Text>
                    </Box>
                  ))}
                </Box>
                <Divider />
              </Box>
            )}
            {/* Separate Box for message input and send button */}
            {selectedPatient && (
              //   //<Box
              //     position="fixed"
              //     bottom="0"
              //     left="0"
              //     width="100%"
              //     bg="white"
              //     borderTop="1px"
              //     borderTopColor="gray.200"
              //     p={3}
              // >
              <Box
                display="flex"
                alignItems="center"
                position="fixed"
                bottom="1"
                width="40%"
                borderTop="1px"
                borderTopColor="gray.200"
              >
                <Input
                  flex="1"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                />
                <Button
                  colorScheme="blue"
                  onClick={sendMessage}
                  disabled={!newMessage}
                  ml={2}
                >
                  Send
                </Button>
              </Box>
              // </Box>
            )}
          </VStack>
        </Box>
      </Box>
    );
  }
  
  export default PatientChat;
  