import { useState, useEffect } from 'react';
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  Select,
  Radio,
  SimpleGrid,
  InputLeftAddon,
  InputGroup,
  Textarea,
  FormHelperText,
  InputRightElement,
  RadioGroup,
  Stack,
  Text,
  Link,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

import BasicForm from './BasicForm';
import PatientForm from './PatientForm';
import DoctorForm from './DoctorForm';

import { useSignup } from '../../../Hooks/useSignup';

export default function Signup() {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(50);

  const { signup, error, loading } = useSignup();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    userType: '',
    dateOfBirth: '',
    gender: '',
    mobileNumber: '',
    emergencyUsername: '',
    emergencyName: '',
    emergencyMobileNumber: '',
    emergencyRelationToPatient: '',
    hourlyRate: '',
    affiliation: '',
    educationalBackground: '',
    specialization: '',
    nationalID: '',
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'An error occurred.',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const handleSubmission = async e => {
    e.preventDefault();
    await signup({ formData });
  };

  const PageDisplay = () => {
    switch (step) {
      case 1:
        return <BasicForm formData={formData} setFormData={setFormData} />;
      case 2:
        return formData.userType === 'patient' ? (
          <PatientForm formData={formData} setFormData={setFormData} />
        ) : (
          <DoctorForm formData={formData} setFormData={setFormData} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form"
      >
        <Progress
          hasStripe
          value={progress}
          mb="5%"
          mx="5%"
          isAnimated
          colorScheme="teal"
        ></Progress>
        <Text textAlign="center" color="fg.muted">
          Already have an account?{' '}
          <Link color="#93B1A6" href="/login">
            Log in
          </Link>
        </Text>

        {PageDisplay()}

        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setStep(step - 1);
                  setProgress(progress - 50);
                }}
                isDisabled={step === 1}
                bg="#93B1A6"
                variant="solid"
                w="7rem"
                mr="5%"
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  setStep(step + 1);
                  if (step === 2) {
                    setProgress(100);
                  } else {
                    setProgress(progress + 50);
                  }
                }}
                w="7rem"
                isDisabled={step === 2 || formData.userType === ''}
                colorScheme="teal"
                variant="outline"
              >
                Next
              </Button>
            </Flex>
            {step === 2 ? (
              <Button
                w="7rem"
                colorScheme="red"
                variant="solid"
                onClick={handleSubmission}
                isLoading={loading}
                loadingText="Submitting"
              >
                Submit
              </Button>
            ) : null}
          </Flex>
        </ButtonGroup>
      </Box>
    </>
  );
}
