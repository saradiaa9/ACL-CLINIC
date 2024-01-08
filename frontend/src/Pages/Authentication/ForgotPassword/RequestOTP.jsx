import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

function RequestOTP({ username, setUsername, handleRequestOTP }) {
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
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Forgot your password?
        </Heading>
        <Text
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.400')}
        >
          You&apos;ll get an email with a reset link
          <br />
          Enter your username to get the OTP
        </Text>
        <FormControl id="username">
          <Input
            placeholder="abc123"
            _placeholder={{ color: 'gray.500' }}
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </FormControl>
        <Stack spacing={6}>
          <Button
            bg={'#5C8374'}
            color={'white'}
            _hover={{
              bg: '#93B1A6',
            }}
            onClick={() => handleRequestOTP()}
          >
            Request Reset
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}

export default RequestOTP;
