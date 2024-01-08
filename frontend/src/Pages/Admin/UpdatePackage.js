import React, { useEffect, useState } from 'react';
import {
  Text,
  Button,
  Flex,
  Stack,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Card,
  CardHeader,
  TableContainer,
  Input,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';

import { useAuthContext } from '../../Hooks/useAuthContext';

const UpdatePackage = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const toast = useToast();
  const [updateFields, setUpdateFields] = useState({
    NewName: '',
    AnnualPrice: '',
    DoctorDiscount: '',
    MedicineDiscount: '',
    FamilyDiscount: '',
  });

  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (user) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }

    axios
      .get('/Admin/getPackage')
      .then(response => {
        setPackages(response.data);
      })
      .catch(error => {
        console.error('Error fetching packages:', error);
      });
  }, [user, loading]);

  const handleView = selectedPackage => {
    setSelectedPackage(selectedPackage);
  };

  const handleUpdateFieldsChange = (field, value) => {
    setUpdateFields(prevFields => ({
      ...prevFields,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!selectedPackage) return;
  
    try {
      const response = await axios.put('/Admin/updatePackage', {
        OldName: selectedPackage.Name,
        ...updateFields,
      });
  
      if (response.status === 200) {
        // Handle successful package update
        toast({
          title: 'Package updated successfully please reload page',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
  
        // Reset the updateFields state to clear the input fields
        setUpdateFields({
          NewName: '',
          AnnualPrice: '',
          DoctorDiscount: '',
          MedicineDiscount: '',
          FamilyDiscount: '',
        });
      } else {
        // Handle error in updating package
        console.error('Failed to update package:', response.data.error);
        toast({
          title: 'Failed to update package',
          description: response.data.error || 'Unknown error',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating package:', error.message);
      toast({
        title: 'Error updating package',
        description: error.message || 'Unknown error',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  

  return (
    <Flex
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
      marginBottom={0}
    >
      <Stack
        direction={['column', 'row']}
        spacing={6}
        w={'full'}
        maxW={'1500px'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={0}
        my={0}
        mt={0}
        ml={250}
        backgroundColor="#f5f5f5"
      >
        
        <Flex direction="column" align="center" justify="center" w={['full', '50%']}>
          <Heading as="h2" size="2xl" textColor="#183d3d" fontWeight="bold">
            All Packages
          </Heading>
          <TableContainer>
            <Table variant="simple" size={'md'}>
              <Thead>
                <Tr>
                  <Th as="h2" fontSize="2xl" textAlign="left">
                    Name
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {packages.map(pkg => (
                  <Tr key={pkg._id}>
                    <Td fontSize="lg">{pkg.Name}</Td>
                    <Td fontSize="md">
                      <Button onClick={() => handleView(pkg)} size="md" bg="#93b1a6" _hover={{bg: '#5C8374'}} textColor="white">
                        View
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>

    
          <Stack spacing={4} w={'full'} maxW={'8xl'} backgroundColor="#f5f5f5" rounded={'xl'} boxShadow={'lg'} p={6} my={12}>
            
          <Heading as="h2" size="2xl" textColor="#183d3d" fontWeight="bold">
            Selected Packages
          </Heading>
              {selectedPackage && (
                <>
                <Flex align="center">
                <Text fontSize="lg" color="#183d3d" mr={2} fontWeight="bold" >Name:</Text>
                <Text fontSize="md" color="#5C8374" fontWeight="bold">{selectedPackage.Name}</Text>
              </Flex>
              <Flex align="center">
              <Text fontSize="lg" color="#183d3d" mr={2} fontWeight="bold">Annual Price:</Text>
              <Text color="#5C8374" fontWeight="bold">{selectedPackage.AnnualPrice}</Text>
              </Flex>
              <Flex align="center">
              <Text fontSize="lg" color="#183d3d" mr={2} fontWeight="bold">Doctor Discount:</Text>
              <Text color="#5C8374" fontWeight="bold">{selectedPackage.DoctorDiscount}</Text>
              </Flex>
              <Flex align="center">
              <Text fontSize="lg" color="#183d3d" mr={2} fontWeight="bold">Medicine Discount:</Text>
              <Text color="#5C8374" fontWeight="bold">{selectedPackage.MedicineDiscount}</Text>
              </Flex>
              <Flex align="center">
              <Text fontSize="lg" color="#183d3d" mr={2} fontWeight="bold">Family Discount:</Text>
              <Text color="#5C8374" fontWeight="bold">{selectedPackage.FamilyDiscount}</Text>
              </Flex>

                  <Stack direction={['column', 'column']} spacing={6}>
                    <Input
                      placeholder="New Name"
                      value={updateFields.NewName}
                      onChange={e => handleUpdateFieldsChange('NewName', e.target.value)}
                    />
                    <Input
                      placeholder="Annual Price"
                      value={updateFields.AnnualPrice}
                      onChange={e => handleUpdateFieldsChange('AnnualPrice', e.target.value)}
                    />
                    <Input
                      placeholder="Doctor Discount"
                      value={updateFields.DoctorDiscount}
                      onChange={e => handleUpdateFieldsChange('DoctorDiscount', e.target.value)}
                    />
                    <Input
                      placeholder="Medicine Discount"
                      value={updateFields.MedicineDiscount}
                      onChange={e => handleUpdateFieldsChange('MedicineDiscount', e.target.value)}
                    />
                    <Input
                      placeholder="Family Discount"
                      value={updateFields.FamilyDiscount}
                      onChange={e => handleUpdateFieldsChange('FamilyDiscount', e.target.value)}
                    />

                    <Button
                      bg={'#93B1A6'}
                      color={'white'}
                      w="full"
                      _hover={{
                        bg: '#5C8374',
                      }}
                      onClick={handleUpdate}
                    >
                      Update
                    </Button>
                  </Stack>
                </>
              )}

          </Stack>
      </Stack>
    </Flex>
  );
};

export default UpdatePackage;
