import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Heading, Text, Button, Flex } from "@chakra-ui/react";
import axios from "axios";

const PayPatient = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Extract the query parameters
  const Username = searchParams.get('Username');
  const packageName = searchParams.get('packageName');

  const handleWalletPayment = async (paymentType) => {
    try {
        if (paymentType === "wallet") {
          const response = await axios.post('/Patient/payForPackage', {
            Username,
            packageName,
          });
         
          console.log(response.data); // Handle the response data as needed
        } else if (paymentType === "credit") {
          // Handle credit payment logic if needed
        }
      } catch (error) {
        console.error('Error processing payment', error);
      }
  };

  return (
    <Box p={6}>
      <Heading as="h1" fontSize="2xl" mb={4}>
        Payment Page
      </Heading>
      <Text>
        Username: {Username}
      </Text>
      <Text>
        Package Name: {packageName}
      </Text>
      {/* Other payment related components */}

      {/* Payment options */}
      <Flex mt={4}>
        <Button colorScheme="blue" mr={4}   onClick={() => handleWalletPayment("wallet")}>
          Pay with Wallet
        </Button>
        <Button colorScheme="green"  onClick={() => ("credit")}>
          Pay with Credit Card
        </Button>
      </Flex>
    </Box>
  );
};

export default PayPatient;
