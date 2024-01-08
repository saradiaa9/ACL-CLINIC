import { useState } from 'react';
import {
  Heading,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';

function PatientForm({ formData, setFormData }) {
  const handleFormDataChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };
  

  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
        Patient Details
      </Heading>

      <Flex>
      
        <FormControl mr="5%">
          <FormLabel htmlFor="gender" fontWeight={'normal'}>
            Gender
          </FormLabel>
          <Select
            id="gender"
            placeholder="Select gender"
            value={formData.gender}
            onChange={handleFormDataChange}
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Select>
        </FormControl>
        <FormControl mr="5%">
          <FormLabel htmlFor="nationalID" fontWeight={'normal'}>
            National ID
          </FormLabel>
          <Input
  id="nationalID" // Use the same case as expected by the backend
  placeholder="National ID"
  value={formData.nationalID} // Use the same case as expected by the backend
  onChange={handleFormDataChange}
  required
/>


        </FormControl>
        <FormControl>
          <FormLabel htmlFor="mobileNumber" fontWeight={'normal'}>
            Mobile Number
          </FormLabel>
          <InputGroup size="sm">
            <InputLeftAddon
              bg="gray.50"
              _dark={{
                bg: 'gray.800',
              }}
              color="gray.500"
              rounded="md"
            >
              +20
            </InputLeftAddon>
            <Input
              id="mobileNumber"
              type="tel"
              placeholder="Mobile Number"
              focusBorderColor="brand.400"
              rounded="md"
              value={formData.mobileNumber}
              onChange={handleFormDataChange}
            />
          </InputGroup>
        </FormControl>
      </Flex>

      <Heading
        w="100%"
        textAlign={'center'}
        fontWeight="normal"
        mt="5%"
        mb="2%"
        size="md"
      >
        Emergency Contact
      </Heading>

      <Flex>
        <FormControl mr="5%">
          <FormLabel htmlFor="emergencyUsername" fontWeight={'normal'}>
            Patient Username 
          </FormLabel>
          <Input
            id="emergencyUsername"
            placeholder="Username"
            value={formData.emergencyUsername}
            onChange={handleFormDataChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="emergencyName" fontWeight={'normal'}>
            Name
          </FormLabel>
          <Input
            id="emergencyName"
            placeholder="Name"
            value={formData.emergencyName}
            onChange={handleFormDataChange}
            required
          />
        </FormControl>
      </Flex>

      <Flex>
        <FormControl mt="2%" mr="5%">
          <FormLabel htmlFor="emergencyMobileNumber" fontWeight={'normal'}>
            Mobile Number
          </FormLabel>
          <InputGroup size="sm">
            <InputLeftAddon
              bg="gray.50"
              _dark={{
                bg: 'gray.800',
              }}
              color="gray.500"
              rounded="md"
            >
              +20
            </InputLeftAddon>
            <Input
              id="emergencyMobileNumber"
              type="tel"
              placeholder="Mobile Number"
              focusBorderColor="brand.400"
              rounded="md"
              value={formData.emergencyMobileNumber}
              onChange={handleFormDataChange}
            />
          </InputGroup>
        </FormControl>

        <FormControl mt="2%">
          <FormLabel htmlFor="emergencyRelationToPatient" fontWeight={'normal'}>
            Relationship
          </FormLabel>
          <Select
            id="emergencyRelationToPatient"
            placeholder="Select relationship"
            value={formData.emergencyRelationToPatient}
            onChange={handleFormDataChange}
            required
          >
            <option value="father">Father</option>
            <option value="mother">Mother</option>
            <option value="brother">Brother</option>
            <option value="sister">Sister</option>
            <option value="friend">Friend</option>
          </Select>
        </FormControl>
      </Flex>
    </>
  );
}

export default PatientForm;
