import { Button, Box, Flex, Text, useToast } from "@chakra-ui/react";
import { Link } from 'react-router-dom';
import { React, useState, useEffect } from 'react';
import axios from 'axios';

const Doctor = () => {
    const [walletBalance, setWalletBalance] = useState(0);
    const params = new URLSearchParams(window.location.search);
    const Username = params.get('Username');
    const toast = useToast();
  
    useEffect(() => {
      // Fetch wallet balance when the component mounts
      getWalletBalance();
    }, []);
  
    const getWalletBalance = async () => {
      try {
        const response = await axios.get(`/Doctor/getWallet?Username=${Username}`);
        setWalletBalance(response.data);
      } catch (error) {
        console.error('Error fetching wallet balance', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch wallet balance',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

  return (
    <Flex direction="column" p={8}>
      {/* Wallet amount box */}
      <Box bg="green.200" p={2} borderRadius="md" position="absolute" top={4} right={4}>
        <Text color="green.800">Wallet: ${walletBalance}</Text>
      </Box>
      <Link to="/doctor/health">
        <Button colorScheme="linkedin" w="100%" mt={10}>
            Health Records
        </Button>
      </Link>
      <Text fontSize="sm" mb={6}>
        Patient's health records.
      </Text>
      <Link to="/doctor/appointments">
        <Button colorScheme="linkedin" w="100%">
            Appointments
        </Button>
      </Link>
      <Text fontSize="sm" mb={6}>
        View your scheduled appointments.
      </Text>
    </Flex>
  );
};

export default Doctor;
