import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Stack,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { FiPackage } from 'react-icons/fi';

import { useLogout } from '../Hooks/useLogout';

import { useColorModeValue } from '@chakra-ui/react';
import { useAuthContext } from '../Hooks/useAuthContext';

const NavLink = props => {
  const { children, link } = props;
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: 'gray.200',
      }}
      href={link}
    >
      {children}
    </Box>
  );
};

function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { logout } = useLogout();
  const bg = useColorModeValue('gray.100', 'gray.900');

  const { user } = useAuthContext();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <>
      <Box bg={bg} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          
          {user && (
            <Flex alignItems={'center'}>
              {/* <Button
                variant={'solid'}
                colorScheme={'blue'}
                size={'sm'}
                mr={4}
                leftIcon={<FiPackage />}
                onClick={() =>
                  (window.location.href = `/Packages?Username=${user.Username}`)
                }
              >
                Packages
              </Button> */}
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                >
                  <Avatar
                    size={'sm'}
                    src={
                      'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                    }
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem>Link 1</MenuItem>
                  <MenuItem>Link 2</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogout}>Log out</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          )}
          {!user && (
            <HStack as={'nav'} spacing={4}>
              <NavLink link={'/'}>Log in</NavLink>
              <NavLink link={'/signup'}>Sign Up</NavLink>
            </HStack>
          )}
        </Flex>
      </Box>
    </>
  );
}

export default Navbar;
