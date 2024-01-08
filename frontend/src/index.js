import * as ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { StrictMode } from 'react';

import App from './App';

import { AuthContextProvider } from './Context/AuthContext';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
  <ChakraProvider>
    <StrictMode>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </StrictMode>
  </ChakraProvider>
);
