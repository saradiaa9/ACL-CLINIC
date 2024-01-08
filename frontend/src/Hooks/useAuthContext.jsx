import { AuthContext } from '../Context/AuthContext';
import { useContext } from 'react';

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error(
      'useAuthContext must be used within an AuthContextProvider'
    );
  }

  return authContext;
};
