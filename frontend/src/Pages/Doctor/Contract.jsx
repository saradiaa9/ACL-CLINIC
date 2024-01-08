import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Button,
  List,
  ListItem,
  Text,
  Spinner,
  Container,
  Flex,
} from '@chakra-ui/react';
import Axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { useAuthContext } from '../../Hooks/useAuthContext';
import mycontract from './contract.pdf'

const Contract = () => {
  const { user, loading } = useAuthContext();
  const Username = user?.Username;
  const [contract, setContract] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const toast = useToast();
  const fetchContract = async () => {
    try {
      const response = await Axios.get(`/Doctor/getContract?Username=${Username}`);
      setContract(response.data.contract);
      setDataLoading(false);
    } catch (error) {
      console.error('Error fetching contract:', error);
    } 
  };

  useEffect(() => {
    if (user) {
      Axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }

    fetchContract();
  }, [user, Username, contract]);

  const handleAcceptContract = async () => {
    try {
      await Axios.put(`/Doctor/acceptContract?Username=${Username}`);
      toast({
        title: 'Contract Accepted',
        description: 'You have accepted the contract successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Fetch the updated contract details
      const response = await Axios.get(`/Doctor/getContract?Username=${Username}`);
      setContract(response.data.contract);
    } catch (error) {
      console.error('Error accepting contract:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept the contract. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };



  return (
    <Container maxW="container.sm" mt={8}>
      <Flex direction="column" >
        <Heading mb={4} marginLeft={300} color="#183D3D">MY CONTRACT</Heading>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {contract && contract[0] ? (
              <Box>
                <div className='c'>
                <iframe src={mycontract} style={{ width: '900px', height: '500px'}}/>
                </div>

                    {!contract[0].Accepted && (
                      <Button
                      bg="#93B1A6"
                      color={"white"}
                      
                        onClick={handleAcceptContract}
                        mt={4}
                        ml={350}
                      >
                        Accept Contract
                      </Button>
                    )}
              </Box>
            ) : (
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
            )}
          </>
        )}
      </Flex>
    </Container>
  );
};

export default Contract;
