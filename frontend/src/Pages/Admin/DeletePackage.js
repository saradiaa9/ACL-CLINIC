import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Button,
  Card,
  CardHeader,
  TableContainer,
  Text,
  useColorModeValue,
  Flex,
  Stack,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

import { useAuthContext } from '../../Hooks/useAuthContext';

const DeletePackage = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const toast = useToast(); // Add this line
  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (user) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }

    axios
      .get('/Admin/getPackage')
      .then((response) => {
        setPackages(response.data); // Assuming the API response is an array of packages
      })
      .catch((error) => {
        console.error('Error fetching packages:', error);
      });
  }, [user, loading]);

  const handleView = (selectedPackage) => {
    setSelectedPackage(selectedPackage);
  };

  const handleDelete = () => {
    if (!selectedPackage) return;

    axios
      .delete('/Admin/deletePackage', {
        data: { Name: selectedPackage.Name },
      })
      .then((response) => {
        setPackages(packages.filter((pkg) => pkg.Name !== selectedPackage.Name));
        setSelectedPackage(null);
        toast({
          title: 'Package deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error('Error deleting package:', error);
        toast({
          title: 'Failed to delete package',
          description: error.message || 'Unknown error',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Flex
      align="center"
      justify="center"
      minH="100vh"
      bg= "#f5f5f5"
    >
    
        <Stack
          direction={['column', 'row']}
          spacing={8}
          w="full"
          maxW="3xl"
          bg="f5f5f5"
          rounded="xl"
          boxShadow="lg"
          p={5}
          my={0}
          ml={40}
          backgroundColor="#f5f5f5"
        >
          <Flex direction="column" align="center" justify="center" flex="1">
            <TableContainer>
              <Table variant="simple" size="md">
                <Thead>
                  <Tr>
                    <Th as="h1" fontSize="4xl" color="#183d3d">
                      Packages
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {packages.map((pkg) => (
                    <Tr key={pkg._id}>
                      <Td fontSize="lg" fontWeight="bold">{pkg.Name}</Td>
                      <Td fontSize="lg">
                        <Button onClick={() => handleView(pkg)} size="lg" bg="#93b1a6" textColor="#FFFFFF" _hover={{bg: '#5c8374'}}>
                          View
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Flex>

          <Flex direction="column" align="center" justify="center" flex="1">
            <Stack
              spacing={4}
              w="full"
              maxW="xl"
              bg="f5f5f5"
              rounded="xl"
              boxShadow="lg"
              p={6}
              my={12}
            >
             
                {selectedPackage && (
                  <>
                    {/* <Text>Name: {selectedPackage.Name}</Text>
                    <Text>Annual Price: {selectedPackage.AnnualPrice}</Text>
                    <Text>Doctor Discount: {selectedPackage.DoctorDiscount}</Text>
                    <Text>Medicine Discount: {selectedPackage.MedicineDiscount}</Text>
                    <Text>Family Discount: {selectedPackage.FamilyDiscount}</Text> */}

                    <Text textAlign="center" color="#183d3d" fontWeight="bold" fontSize="lg">Name </Text>
                    <Text textAlign="center" color="#5c8374" fontSize="lg" fontWeight="bold"> {selectedPackage.Name}</Text>
                    <Text textAlign="center" color="#183d3d" fontWeight="bold" fontSize="lg">Annual Price </Text>
                    <Text textAlign="center" color="#5c8374" fontSize="lg" fontWeight="bold">{selectedPackage.AnnualPrice}</Text>
                    <Text textAlign="center" color="#183d3d" fontWeight="bold" fontSize="lg">Doctor Discount </Text>
                    <Text textAlign="center" color="#5c8374" fontSize="lg" fontWeight="bold">{selectedPackage.DoctorDiscount}</Text>
                    <Text textAlign="center" color="#183d3d" fontWeight="bold" fontSize="lg">Medicine Discount</Text>
                    <Text textAlign="center" color="#5c8374" fontSize="lg" fontWeight="bold">{selectedPackage.MedicineDiscount}</Text>
                    <Text textAlign="center" color="#183d3d" fontWeight="bold" fontSize="lg">Family Discount </Text>
                    <Text textAlign="center" color="#5c8374" fontSize="lg" fontWeight="bold">{selectedPackage.FamilyDiscount}</Text>

                    <Stack direction={['column', 'row']} spacing={6}>
                      <Button
                        bg={'red.400'}
                        color={'white'}
                        w="full"
                        _hover={{
                          bg: 'red.500',
                        }}
                        onClick={handleDelete}
                        size="lg"
                      >
                        Delete
                      </Button>
                    </Stack>
                  </>
                )}
            </Stack>
          </Flex>
        </Stack>
    </Flex>
  );
};

export default DeletePackage;
