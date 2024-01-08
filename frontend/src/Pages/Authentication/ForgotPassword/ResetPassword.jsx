import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';

import { PasswordField } from '../PasswordField';

function ResetPasswordForm({ password, setPassword, handleResetPassword }) {
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
          Enter new password
        </Heading>
        <FormControl id="password" isRequired>
          <PasswordField onChange={e => setPassword(e.target.value)} />
        </FormControl>
        <Stack spacing={6}>
          <Button
            bg={'#5C8374'}
            color={'white'}
            _hover={{
              bg: '#93B1A6',
            }}
            onClick={() => handleResetPassword()}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}

export default ResetPasswordForm;
