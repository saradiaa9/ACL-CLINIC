import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../Hooks/useAuthContext';
import { Box, Heading, Text, List, ListItem, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,Flex,Badge, HStack} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';


const Prescription = () => {
  const { user } = useAuthContext();
  const Username = user?.Username;
  const  toast = useToast();
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [viewPrescriptionDetails, setViewPrescriptionDetails] = useState({});
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [sessionPrice, setSessionPrice] = useState(0); // New state for session price


  useEffect(() => {
    if (user) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }

    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(`/Patient/viewPrescriptions?Username=${Username}`);
        setPrescriptions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      }
    };

    fetchPrescriptions();
  }, [user, Username]);

  const viewPrescription = async (prescriptionId) => {
    try {
      const response = await axios.post(`/Patient/viewPrescriptionDetails?Username=${Username}`, {
        prescriptionId,
      });
      setViewPrescriptionDetails(response.data);
      setSelectedPrescription(prescriptionId);
    } catch (error) {
      console.error('Error fetching prescription details:', error);
    }
  };
  
  const handlePayButtonClick = () => {
    setIsPaymentModalOpen(true);
  };
  
  const handlePaymentMethodSelect = async (method) => {
    try {
      if (method === 'Wallet') {
        const response = await axios.post(`/Patient/payForPrescription?Username=${Username}`, {
          prescriptionId: selectedPrescription,
        });
        
        console.log(response.data.message); // Output success message
        // Show success toast upon successful payment
        toast({
          title: 'Payment successful',
          description: response.data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setIsPaymentModalOpen(false); // Close the modal after successful payment
      } else if (method === 'Credit') {
        const response = await axios.post(`/Patient/PrescriptionPayment?Username=${Username}`, {
          prescriptionId: selectedPrescription,
        });
        
        console.log(response.data.message);
        
        if (response.data.message && response.data.url) {
          window.open(response.data.url, '_blank');
          
           
        } else {
          // Handle the response logic, but don't send a new response from here
          console.error('Payment response:', response.data);
          // Display an error toast or handle the error scenario as needed
          toast({
            title: 'Error',
            description: 'Failed to process payment',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
        
      }
    } catch (error) {
      console.error('Error handling payment:', error);
      // Handle other errors, network issues, etc.
    }
  };
  
  const downloadPrescription = async () => {
    try {
      const response = await axios.get(`/prescription/download/${selectedPrescription}`, {
        responseType: 'blob', // Set the response type to blob
      });

      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Create a link element and trigger a click to download the file
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'prescription.pdf';
      link.click();
    } catch (error) {
      console.error('Error downloading prescription:', error);
    }
  };
  
  return (
    <Box p={4} marginLeft={280} bgColor="#183D3D" borderRadius={8}>
    <Heading as="h1" size="lg" mb={4} color="#F8F8F8">
      Prescription Details
    </Heading>
    <Box bgColor="white" borderRadius={8} p={4}>
        <List listStyleType="none" p={0}>
          {prescriptions.map((prescription, index) => (
            <ListItem
              key={prescription._id}
              mb={index === 0 ? 2 : 1}
              borderRadius={index === 0 ? "sm" : "md"}
              p={index === 0 ? 2 : 4}
              boxShadow={index === 0 ? "sm" : "md"}
              _hover={{ cursor: 'pointer', background: '#f0f0f0' }}
              onClick={() => viewPrescription(prescription._id)}
            >
              <Text fontSize="lg" fontWeight="bold">
                Date: {prescription.DateP}
              </Text>
              <List listStyleType="none" p={0}>
                {prescription.Medicine && prescription.Medicine.map((med) => (
                  <ListItem
                    key={med.Name}
                    mb={2}
                    boxShadow="sm"
                    borderRadius="md"
                    p={2}
                    _hover={{ cursor: 'pointer', background: '#f0f0f0' }}
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Text fontSize="lg">
                        <Text as="span" fontWeight="bold">Doctor:</Text> {prescription.DoctorUsername}
                      </Text>
                      <Text>
                        <Text as="span" fontWeight="bold">Medicine:</Text> {med.Name}
                        
                      </Text>
                      <Text as = "span" fontWeight={"bold"}>Dosage: </Text>{med.Dosage}
                   

                    </Box>
                    {selectedPrescription === prescription._id && (
                      <Box>
                        <Text>
                            
                          <Text as="span" fontWeight="bold">Paid:</Text> {prescription.Paid ? 'Yes' : 'No'}
                        </Text>
                        
                        <Badge colorScheme={prescription.Filled ? 'green' : 'red'}>
                        Status:  {prescription.Filled ? 'Filled' : 'Not Filled'}
                        </Badge>
                        <Text></Text>
                        <Badge colorScheme={prescription.Submitted ? 'green' : 'red'}>
                          {prescription.Submitted ? 'Submitted' : 'Not Submitted'}
                        </Badge>
                      </Box>
                    )}
                  </ListItem>
                ))}
                <Text>Price: {prescription.Price}</Text>
              </List>
              {selectedPrescription === prescription._id && (
                <HStack direction="column">
                  <Button onClick={handlePayButtonClick} mt={2} variant="outline" colorScheme="blue">
                    Pay
                  </Button>
                  <Button onClick={downloadPrescription} mt={2} variant="outline" colorScheme="blue">
                    Download Prescription
                  </Button>
                </HStack>
              )}
            </ListItem>
          ))}
        </List>
      </Box>

      <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Payment Confirmation</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      Are you sure you want to pay for this prescription?
      <br />
      Choose a payment method:

      <Flex justify="flex-start">
        <Button onClick={() => handlePaymentMethodSelect('Wallet')} mt={4} mr={2} colorScheme="teal">
          Wallet
        </Button>
        <Button onClick={() => handlePaymentMethodSelect('Credit')} mt={4} mr={2} colorScheme="orange">
          Credit
        </Button>
      </Flex>
      <Flex justify="flex-end" mt={3}>
        <Button variant="outline" colorScheme="red" onClick={() => setIsPaymentModalOpen(false)}>
          Cancel
        </Button>
      </Flex>
    </ModalBody>
  </ModalContent>
</Modal>

    </Box>
    
  );
};
export default Prescription;