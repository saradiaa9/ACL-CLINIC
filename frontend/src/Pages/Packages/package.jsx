import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Button,
  Divider,
  Input,
  Flex,
  List,
  ListItem,
  SimpleGrid,
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
import { useAuthContext } from '../../Hooks/useAuthContext';
import { set } from 'mongoose';

const Package = () => {
  const { user } = useAuthContext();
  const Username = user?.Username;
  const toast = useToast();
  const [yourPackages, setYourPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPackageUsername, setSelectedPackageUsername] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [patient, setPatient] = useState([]);
  const [myPackage, setMyPackage] = useState([]);
  const [myPackageStatus, setMyPackageStatus] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (user) {
      Axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }

    const fetchData = async () => {
      try {
        const response = await Axios.get('/Package/get');

        setYourPackages(response.data);

        const fam = await Axios.get(
          `/Patient/getFamilyMembers?Username=${Username}`
        );
        setFamilyMembers(fam.data);

        const patient = await Axios.get(
          `/Patient/getPatientDetails?Username=${Username}`
        );
        setPatient(patient.data);
        setSelectedPackageUsername(patient.data.Name);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, [user, Username]);

  const handlePackageClick = packages => {
    setSelectedPackage(packages);
  };

  const handlePackageUsername = username => {
    setSelectedPackageUsername(username);
    handlePass(username);
  };

  const handlePass = name => {
    if (name === patient.Name) {
      setMyPackage(patient.Package);
      setMyPackageStatus(patient.PackageStatus);
    } else {
      familyMembers.map((member, index) => {
        if (name === member.Name) {
          setMyPackage(member.Package);
          setMyPackageStatus(member.PackageStatus);
          console.log(member);
          console.log(member.Package);
        }
      });
    }
  };

  const formatDate = date => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  };


  const handleCancel = async () => {
    try {
      if (selectedPackageUsername === patient.Name) {
        await Axios.post(`/Patient/CancelPackageSubscription?Username=${Username}`);
  
        toast({
          title: 'Package Cancelled.',
          description: `You have cancelled ${myPackage.Name} package.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
  
        window.location.reload();
      } else {
        await Axios.post(`/Patient/CancelPackageSubscriptionForFamilyMember?Username=${Username}`, {
          familyMember: selectedPackageUsername,
        });
  
        toast({
          title: 'Package Cancelled.',
          description: `You have cancelled ${myPackage.Name} package.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
  
        window.location.reload();
      }
    } catch (error) {
      console.error('Error fetching data', error);
      
        toast({
          title: 'Package Cancellation Failed.',
          description: `You have failed to cancel ${myPackage.Name} package.`,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      
    }
  };
  
  



  const handleSubscribe = async () => {
    onOpen(); // Open the confirmation dialog
  };

  const handleConfirmSubscribe = async paymentMethod => {
    onClose(); // Close the confirmation dialog

    const handleSubscription = async (username, paymentMethod) => {
      try {
        const response = await Axios.post(
          `/Patient/addPackageTo${
            selectedPackageUsername === patient.Name
              ? 'Patient'
              : 'FamilyMember'
          }?Username=${username}`,
          {
            packageName: selectedPackage.Name,
            ...(selectedPackageUsername !== patient.Name && {
              familyMember: selectedPackageUsername,
            }),
            paymentMethod, // Pass the selected payment method
          }
        );
    
        console.log(response.data);
        setMyPackage(response.data.Package);
        setMyPackageStatus(response.data.PackageStatus);
        toast({
          title: 'Package Subscribed.',
          description: `You have subscribed to ${selectedPackage.Name} package using ${paymentMethod}.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
    
        // Redirect based on payment method
        if (paymentMethod === 'Credit Card') {
          const paymentResponse = await Axios.post(`/Patient/payPackageCreditCard?Username=${username}`, {
            packageId: selectedPackage,
          });
         
          console.log(paymentResponse.data.message);
          
          if (paymentResponse.data.message && paymentResponse.data.url) {
            window.open(paymentResponse.data.url, '_blank');
          } 
        } else if (paymentMethod === 'Wallet') {
          await Axios.post(`/Patient/payWalletPackage?Username=${username}`, {
            packageName: selectedPackage.Name,
          });
        }
      } catch (error) {
        console.error('Error handling subscription:', error);
    
        toast({
          title: 'Package Subscription Failed.',
          description: `You have failed to subscribe to ${selectedPackage.Name} package.`,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    };
    
    if (selectedPackageUsername === patient.Name) {
      await handleSubscription(patient.Username, paymentMethod); // Ensure paymentMethod is passed here
    } else {
      await Promise.all(
        familyMembers.map(member => {
          if (selectedPackageUsername === member.Name) {
            return handleSubscription(patient.Username, paymentMethod); // Ensure paymentMethod is passed here
          }
          return Promise.resolve();
        })
      );
    }
  }
    
  return (
    <Flex direction="row" padding="1rem" ml={340} mt={50}>
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
      <Flex direction="column" padding="1rem">
        <Box
          width="600px"
          textAlign="center"
          backgroundColor="#f5f5f5"
          borderRadius="4px"
          margin="1rem"
          padding="1rem"
          ml={-50}
          mt={0}
        >
          <Text
            fontSize="1.5rem"
            fontWeight="bold"
            marginBottom="1rem"
            color="#183D3D"
          >
            PACKAGE STATUS
          </Text>
          <Select onChange={e => handlePackageUsername(e.target.value)} mb={3}>
            <option key="patient" value={patient.Name}>
              {patient.Name}
            </option>
            {familyMembers &&
              familyMembers.map((member, index) => (
                <option key={index} value={member.Name}>
                  {member.Name}
                </option>
              ))}
          </Select>

          {selectedPackageUsername && myPackageStatus && myPackage && (
            <Box>
              { myPackageStatus.Status === 'Cancelled' ? (
                // Display message for Unsubscribed or Cancelled status
                <Text color="red">
                  Your package is {myPackageStatus.Status.toLowerCase()}.
                </Text>
              ) : myPackageStatus.Status === 'Subscribed' ? (
                // Display message for Subscribed status
                <>
                  <Text color="green" fontSize="20px">
                    You are subscribed to <strong>{myPackage.Name}</strong>
                  </Text>
                  {/* Display package details */}

                  <Text fontSize="sm" color="black">
                    <strong>End Date: </strong> <br />
                    {formatDate(myPackageStatus.EndDate)}
                  </Text>

                  <Button bg="#183D3D" onClick={handleCancel} color="white" mt={5}>
              Cancel
            </Button>

                  {/* Add more details if needed */}
                </>
              ) : myPackageStatus.Status === 'Unsubscribed' ? (
                <Text color="red">
                  Your package is {myPackageStatus.Status.toLowerCase()}.
                </Text>
              ): null}
            </Box>
          )}

          {selectedPackageUsername && selectedPackage && (
            <Button bg="#183D3D" onClick={handleSubscribe} color="white" mt={5}>
              Subscribe
            </Button>
          )}
        </Box>
      </Flex>

      <Box
        width="100%"
        maxWidth="600px"
        textAlign="center"
        backgroundColor="#f5f5f5"
        borderRadius="4px"
        margin="1rem"
        padding="1rem"
      >
        <Text
          fontSize="1.5rem"
          fontWeight="bold"
          marginBottom="1rem"
          color="#183D3D"
        >
          AVAILABLE PACKAGES
        </Text>
        <SimpleGrid columns={2} spacing={3} mt={5}>
          {yourPackages &&
            yourPackages.map((packages, index) => (
              <Box
                key={index}
                borderWidth="1px"
                borderRadius="lg"
                padding={4}
                backgroundColor={
                  myPackage && myPackage.Name === packages.Name
                    ? '#C0C0C0'
                    : selectedPackage && selectedPackage.Name === packages.Name
                    ? '#93B1A6'
                    : 'white'
                }
                onClick={() => handlePackageClick(packages)}
                cursor="pointer"
                _hover={{ bg: '#93B1A6' }}
              >
                <Heading fontSize="md" color="#5C8374">
                  {packages ? packages.Name : 'No Patient'}
                </Heading>
                <Text fontSize="sm" color="black">
                  <strong>Annual Price: </strong> <br />${packages.AnnualPrice}
                </Text>
                <Text fontSize="sm" color="black">
                  <strong>Doctor Discount: </strong> <br />
                  {packages.DoctorDiscount}%
                </Text>
                <Text fontSize="sm" color="black">
                  <strong>Medicine Discount: </strong> <br />
                  {packages.MedicineDiscount}%
                </Text>
                <Text fontSize="sm" color="black">
                  <strong>Family Discount: </strong> <br />
                  {packages.FamilyDiscount}%
                </Text>
              </Box>
            ))}
        </SimpleGrid>
      </Box>
      {selectedPackage && (
        <AlertDialog isOpen={isOpen} onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader>Confirm Subscription</AlertDialogHeader>
              <AlertDialogCloseButton />
              <AlertDialogBody>
                Are you sure you want to subscribe to {selectedPackage.Name}?
                <br />
                Please choose a payment method:
                {/* Add your payment method options here */}
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  backgroundColor="#183D3D"
                  color="white"
                  onClick={() => handleConfirmSubscribe('Credit Card')}
                >
                  Credit Card
                </Button>
                <Button
                  backgroundColor="#183D3D"
                  color="white"
                  ml={3}
                  onClick={() => handleConfirmSubscribe('Wallet')}
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
      )}
    </Flex>
  );
};

export default Package;
