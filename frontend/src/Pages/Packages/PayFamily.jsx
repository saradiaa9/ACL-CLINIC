import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Heading, Text, Button, Flex } from "@chakra-ui/react";
import axios from "axios";

const FamilyMemberPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Extract the query parameters
  const Username = searchParams.get("Username");
  const familyMember = searchParams.get("familyMember");
  const packageName = searchParams.get("packageName");

  const payForFamilyMemberPackage = async (paymentType) => {
    try {
      if (paymentType === "wallet") {
        const response = await axios.post('/Patient/payForFamilyMemberPackage', {
          Username,
          familyMember,
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
      <Heading as="h2" fontSize="2xl" mb={4}>
        Family Member Page
      </Heading>
      <Text>
        Username: {Username}
      </Text>
      <Text>
        Family Member: {familyMember}
      </Text>
      <Text>
        Package Name: {packageName}
      </Text>
      {/* Display other information */}

      {/* Payment options */}
      <Flex mt={4}>
        <Button
          colorScheme="blue"
          mr={4}
          onClick={() => payForFamilyMemberPackage("wallet")}
        >
          Pay Using Wallet
        </Button>
        <Button
          colorScheme="green"
          onClick={() => payForFamilyMemberPackage("credit")}
        >
          Pay Using Credit
        </Button>
      </Flex>
    </Box>
  );
};

export default FamilyMemberPage;
