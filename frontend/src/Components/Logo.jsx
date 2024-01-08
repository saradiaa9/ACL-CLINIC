import { chakra } from '@chakra-ui/react';

export const Logo = props => (
  <chakra.img
    src="/logo.png"
    alt="ABC Stack Clinic Logo"
    height="12"
    width="auto"
    {...props}
  />
);
