import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import {  ChakraProvider, CSSReset, extendTheme } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

import { useState, useEffect } from 'react';

import { PasswordField } from './PasswordField';

import { useLogin } from '../../Hooks/useLogin';

function Login() {
  const toast = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading } = useLogin();

  const theme = extendTheme({
    components: {
      Checkbox: {
        baseStyle: {
          control: {
            _checked: {
              
              bg: '#5C8374', // Change this to your desired checked color
              borderColor: "#5C8374", // Change this to your desired checked color
            },
            _hover: {
              
              bg: '#93B1A6', // Change this to your desired checked color
              borderColor: "#93B1A6", // Change this to your desired checked color
            },
          },
        },
      },
    },
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

  const handleLogin = async e => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <Container
      maxW="lg"
      py={{
        base: '12',
        md: '24',
      }}
      px={{
        base: '0',
        sm: '8',
      }}
    >
      <Stack spacing="8">
        <Stack spacing="6">
        
          <Stack
            spacing={{
              base: '2',
              md: '3',
            }}
            textAlign="center"
          >
            <Heading
              size={{
                base: 'md',
                md: 'lg',
              }}
            >
              Log in to your account
            </Heading>
            <Text color="fg.muted">
              Don't have an account?{' '}
              <Link color="#93B1A6" href="/signup">
                Sign up
              </Link>
            </Text>
          </Stack>
        </Stack>
        <Box
          py={{
            base: '0',
            sm: '8',
          }}
          px={{
            base: '4',
            sm: '10',
          }}
          bg={{
            base: 'transparent',
            sm: 'bg.surface',
          }}
          boxShadow={{
            base: 'none',
            sm: 'md',
          }}
          borderRadius={{
            base: 'none',
            sm: 'xl',
          }}
        >
          <Stack spacing="6">
            <Stack spacing="5">
              <FormControl>
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input
                  id="username"
                  type="username"
                  onChange={e => setUsername(e.target.value)}
                />
              </FormControl>
              <PasswordField onChange={e => setPassword(e.target.value)} />
            </Stack>
            <HStack justify="space-between">
            <ChakraProvider theme={theme}>
      <CSSReset />
      <Checkbox defaultChecked>Remember me</Checkbox>
    </ChakraProvider>
              <Button variant="text" size="sm" onClick={() => {
                  window.location.href = '/forgotPassword';
                }}>
                Forgot password?
              </Button>
            </HStack>
            <Stack spacing="6">
              <Button
                bg="#183D3D"
                color="white"
                size="lg"
                fontSize="md"
                onClick={handleLogin}
                isLoading={loading}
                loadingText="Logging in"
              >
                Log in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}

export default Login;
