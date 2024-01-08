// WalletComponent.js

import React, { useState, useEffect } from 'react';
import { Container, Heading, Text, Button, useToast } from '@chakra-ui/react';
import axios from 'axios'; // Make sure to install axios using `npm install axios`
import { useParams } from 'react-router-dom';

const WalletComponent = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const toast = useToast();
  const { username, doctorUsername } = useParams();

  useEffect(() => {
    // Fetch wallet balance when the component mounts
    getWalletBalance();
  }, []);

  const getWalletBalance = async () => {
    try {
      const response = await axios.get(
        `/Patient/getWallet?Username=${username}`
      );
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

  const handlePayWithWallet = async () => {
    try {
      const response = await axios.post(
        `/Patient/payWallet?Username=${username}&DoctorUsername=${doctorUsername}`
      );
      toast({
        title: 'Success',
        description: `Payment successful! Session Price: ${response.data.sessionPrice}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Optionally, you can update the wallet balance after successful payment
      getWalletBalance();
    } catch (error) {
      console.error('Error paying with wallet', error);
      toast({
        title: 'Error',
        description: 'Failed to process payment with wallet',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.sm" mt={8}>
      <Heading mb={4}>Wallet</Heading>
      <Text mb={4}>Your current wallet balance: ${walletBalance}</Text>
      <Button colorScheme="teal" size="lg" onClick={handlePayWithWallet}>
        Pay Using Wallet
      </Button>
    </Container>
  );
};

export default WalletComponent;
