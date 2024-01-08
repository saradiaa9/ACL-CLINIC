// DoctorSidebar.js
import React from 'react';
import { Box, Text, VStack, Link, Button, Icon, HStack } from '@chakra-ui/react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { FaChartLine, FaFileContract, FaClock, FaUser, FaCalendarCheck, FaSignOutAlt, FaWallet, FaUsers, FaCheckSquare, FaFacebookMessenger } from 'react-icons/fa'; // Updated icons

import { useLogout } from '../Hooks/useLogout';

import { useColorModeValue } from '@chakra-ui/react';
import { useAuthContext } from '../Hooks/useAuthContext';

const DoctorSidebar = () => {
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
            (window.location.href = '/Doctor/Status')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/Doctor/Status') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/Doctor/Status') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          mt="5"
          pr="0"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaUser} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Status
            </Text>
          </HStack>
        </Button>
        <Button
          onClick={() =>
            (window.location.href = '/dashboard')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/dashboard') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/dashboard') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          mt="5"
          pr="0"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaUser} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Dashboard
            </Text>
          </HStack>
        </Button>
        <Button
          onClick={() =>
            (window.location.href = '/contract')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/contract') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/contract') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="-2"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaFileContract} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Contract
            </Text>
          </HStack>
        </Button>
        <Button
          onClick={() =>
            (window.location.href = '/slots')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/slots') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/slots') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="-2"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaClock} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Time Slots
            </Text>
          </HStack>
        </Button>
        <Button
          onClick={() =>
            (window.location.href = '/appointments')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/appointments') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/appointments') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="-2"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaCalendarCheck} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Appointments
            </Text>
          </HStack>
        </Button>
        {/* Followup Requests Button */}
        <Button
          onClick={() =>
            (window.location.href = '/followups')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/followups') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/followups') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="-2"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaCalendarCheck} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Followup Requests
            </Text>
          </HStack>
        </Button>
        {/* Patients Button */}
        <Button
          onClick={() =>
            (window.location.href = '/mypatients')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/mypatients') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/mypatients') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="-2"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaUsers} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Patients
            </Text>
          </HStack>
        </Button>
        {/* Notification Button */}
        <Button
          onClick={() =>
            (window.location.href = '/doctor/notifications')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/doctor/notifications') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/doctor/notifications') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="-2"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaCheckSquare} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Notification Center
            </Text>
          </HStack>
        </Button>
        {/* Chat Button */}
        <Button
          onClick={() =>
            (window.location.href = '/doctor/chat')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/doctor/chat') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/doctor/chat') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="-2"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaFacebookMessenger} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Chat
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

export default DoctorSidebar;
