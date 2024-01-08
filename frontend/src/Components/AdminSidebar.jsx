// Admin Sidebar.js
import React from 'react';
import { Box, Text, VStack, Link, Button, Icon, HStack } from '@chakra-ui/react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { FaChartLine, FaFileContract, FaClock, FaUser, FaCalendarCheck, FaSignOutAlt, FaWallet, FaUsers } from 'react-icons/fa'; // Updated icons

import { useLogout } from '../Hooks/useLogout';

import { useColorModeValue } from '@chakra-ui/react';
import { useAuthContext } from '../Hooks/useAuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useLogout();

  const isLinkSelected = (pathname) => location.pathname === pathname;

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };



  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      h="100vh"
      bg="#183D3D"
      color="white"
      p="0"
      width={255}
    >
      {/* Navigation Links */}
      <VStack align="start">
        <Button
          onClick={() =>
            (window.location.href = '/Admin/Applicants')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/Admin/Applicants') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/Admin/Applicants') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="5"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaFileContract} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Applicants
            </Text>
          </HStack>
        </Button>
        <Button
          onClick={() =>
            (window.location.href = '/Admin/AddAdmin')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/Admin/AddAdmin') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/Admin/AddAdmin') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="-2"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaClock} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Add Admin
            </Text>
          </HStack>
        </Button>
        <Button
          onClick={() =>
            (window.location.href = '/Admin/ViewUsersList')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/Admin/Remove') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/Admin/Remove') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="-2"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaCalendarCheck} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              View Users List
            </Text>
          </HStack>
        </Button>
        <Button
          onClick={() =>
            (window.location.href = '/Admin/Remove')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/Admin/Remove') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/Admin/Remove') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="-2"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaCalendarCheck} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Delete User
            </Text>
          </HStack>
        </Button>
        {/* Followup Requests Button */}
        <Button
          onClick={() =>
            (window.location.href = '/Admin/AddPackage')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/Admin/AddPackage') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/Admin/AddPackage') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="-2"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaCalendarCheck} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Add Package
            </Text>
          </HStack>
        </Button>
        {/* Patients Button */}
        <Button
          onClick={() =>
            (window.location.href = '/Admin/DeletePackage')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/Admin/DeletePackage') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/Admin/DeletePackage') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="-2"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaUsers} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Delete Package
            </Text>
          </HStack>
        </Button>
        <Button
          onClick={() =>
            (window.location.href = '/Admin/UpdatePackage') // Update the path accordingly
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/Admin/UpdatePackage') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/Admin/UpdatePackage') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="-2"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon boxSize={4} mr={5} ml={5} />
            <Text fontSize="18px" textAlign="left">
              Update Package
            </Text>
          </HStack>
        </Button>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/') ? '#18453D' : '#183D3D' }
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="-2"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaSignOutAlt} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Logout
            </Text>
          </HStack>
        </Button>
        
      </VStack>
    </Box>
  );
};

export default AdminSidebar;
