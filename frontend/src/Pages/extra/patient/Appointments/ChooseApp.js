// PayUsingWallet.js

import React from 'react';
import {
  Container,
  Heading,
  VStack,
  Button,
  Box,
  Text,
} from '@chakra-ui/react';
import { Link, useLocation, useParams } from 'react-router-dom';

const PayUsingWallet = () => {
  const { username, doctorUsername } = useParams();
  return (
    <Container maxW="container.sm" mt={8}>
      <Heading mb={4}>Choose Payment Method</Heading>
      <VStack spacing={4}>
        {/* Wallet Payment Button */}
        <Box borderWidth="1px" borderRadius="lg" p={4} width="100%">
          <Button
            colorScheme="teal"
            size="lg"
            width="100%"
            as={Link}
            to={`/wallet/${username}/${doctorUsername}`}
          >
            Pay Using Wallet
          </Button>
          <Text mt={2}>Use your wallet balance for payment</Text>
        </Box>

        {/* Credit Card Payment Button */}
        <Box borderWidth="1px" borderRadius="lg" p={4} width="100%">
          <Button
            colorScheme="blue"
            size="lg"
            width="100%"
            as={Link}
            to={`/creditcard/${username}/${doctorUsername}`}
          >
            Pay Using Credit Card
          </Button>
          <Text mt={2}>Pay securely using your credit card</Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default PayUsingWallet;
