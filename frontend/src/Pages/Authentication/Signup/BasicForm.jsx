import {
  Heading,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Radio,
  FormHelperText,
  RadioGroup,
  Stack,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { FaUserInjured, FaUserMd } from 'react-icons/fa';

import { PasswordField } from '../PasswordField';

function BasicForm({ formData, setFormData }) {
  const handleFormDataChange = event => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleTypeSelection = type => {
    setFormData({
      ...formData,
      userType: type,
    });
  };

  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
        User Registration
      </Heading>
      <Flex>
        <FormControl mr="5%">
          <FormLabel htmlFor="username" fontWeight={'normal'}>
            Username
          </FormLabel>
          <Input
            id="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleFormDataChange}
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="name" fontWeight={'normal'}>
            Name
          </FormLabel>
          <Input
            id="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleFormDataChange}
            required
          />
        </FormControl>
      </Flex>

      <FormControl mt="2%">
        <FormLabel htmlFor="dateOfBirth" fontWeight={'normal'}>
          Date of Birth
        </FormLabel>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleFormDataChange}
          required
        />
      </FormControl>

      <FormControl mt="2%">
        <FormLabel htmlFor="email" fontWeight={'normal'}>
          Email address
        </FormLabel>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleFormDataChange}
          required
        />
        <FormHelperText>We&apos;ll never share your email.</FormHelperText>
      </FormControl>

      <FormControl>
        <PasswordField
          value={formData.password}
          onChange={handleFormDataChange}
        />
      </FormControl>

      <FormControl mt="2%">
        <FormLabel htmlFor="type" fontWeight={'normal'}>
          Type
        </FormLabel>
        <Flex>
          <Flex alignItems="center">
            <Text mr="5%">Patient</Text>
            <IconButton
              isRound
              aria-label="Patient"
              icon={<FaUserInjured />}
              size="md"
              mr="2%"
              color={formData.userType === 'patient' ? '#E0E0E0' : '#93B1A6'}
              bg={formData.userType === 'patient' ? '#93B1A6' : '#E0E0E0'}
              id="patient"
              onClick={() => handleTypeSelection('patient')}
            />
          </Flex>

          <Flex ml="5%" alignItems="center">
            <Text mr="5%">Doctor</Text>
            <IconButton
              isRound
              aria-label="Doctor"
              icon={<FaUserMd />}
              size="md"
              mr="2%"
              color={formData.userType === 'doctor' ? '#E0E0E0' : '#93B1A6'}
              bg={formData.userType === 'doctor' ? '#93B1A6' : '#E0E0E0'}
              id="doctor"
              onClick={() => handleTypeSelection('doctor')}
            />
          </Flex>
        </Flex>
      </FormControl>
    </>
  );
}

export default BasicForm;
