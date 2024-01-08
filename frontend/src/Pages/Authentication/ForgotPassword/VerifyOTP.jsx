import { Center, Heading } from '@chakra-ui/react';
import {
  Button,
  FormControl,
  Flex,
  Stack,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { PinInput, PinInputField } from '@chakra-ui/react';

function VerifyOTP({ otp, setOTP, email, handleVerifyOTP, handleRequestOTP }) {
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'sm'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={10}
      >
        <Center>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            Verify your Username
          </Heading>
        </Center>
        <Center
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.400')}
        >
          We have sent code to your email
        </Center>
        <Center
          fontSize={{ base: 'sm', sm: 'md' }}
          fontWeight="bold"
          color={useColorModeValue('gray.800', 'gray.400')}
        >
          {email}
        </Center>
        <FormControl>
          <Center>
            <HStack>
              <PinInput
                value={otp}
                onChange={setOTP}
                type="alphanumeric"
                otp={otp}
                autoFocus={true}
                size="lg"
                variant="filled"
                _focus={{ borderColor: 'blue.500' }}
                _hover={{ borderColor: 'blue.500' }}
                _active={{ borderColor: 'blue.500' }}
                bg={useColorModeValue('white', 'gray.700')}
              >
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </Center>
        </FormControl>
        <Stack spacing={6}>
          <Button
            bg={'#93B1A6'}
            color={'white'}
            _hover={{
              bg: '#93B1A6',
            }}
            onClick={() => handleVerifyOTP()}
          >
            Verify
          </Button>

          <Button
            variant="link"
            color={'white'}
            bg={'#183D3D'}
            onClick={() => handleRequestOTP()}
          >
            Resend OTP
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}

export default VerifyOTP;
