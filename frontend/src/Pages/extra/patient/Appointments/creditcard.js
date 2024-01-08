// WalletComponent.js

import React, { useState, useEffect } from 'react';
import {
  Container,
  Heading,
  Text,
  Button,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios'; // Make sure to install axios using npm install axios
import { useParams } from 'react-router-dom';

const CardComponent = () => {
 
  const [sessionPrice, setSessionPrice] = useState(0); // New state for session price
  const toast = useToast();
  const { username, doctorUsername } = useParams();


  

  const handlePayWithCard = async () => {
    try {
      const response = await axios.post(`/Patient/PaymentMethod?username=${username}&doctorUsername=${doctorUsername}`);
      const paidSessionPrice = response.data.sessionPrice;
      setSessionPrice(paidSessionPrice); // Update session price state
      if (response.data && response.data.url) {
        // If the response contains a URL, you can redirect the user to the Stripe Checkout page
        window.location.href = response.data.url;
      } else {
      toast({
        title: 'Success',
        description: `Payment successful! Session Price`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Optionally, you can update the wallet balance after successful payment
    }
    } catch (error) {
      console.error('Error paying with card', error);
      toast({
        title: 'Error',
        description: 'Failed to process payment with card',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.sm" mt={8}>
      <Heading mb={4}>CreditCard</Heading>
      
      {sessionPrice > 0 && (
        <Text mb={4}>Session Price: ${sessionPrice}</Text>
      )}
      <Button colorScheme="teal" size="lg" onClick={handlePayWithCard}>
        Pay Using Card
      </Button>
    </Container>
  );
};

export default CardComponent;