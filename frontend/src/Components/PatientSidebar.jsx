// PatientSidebar.js
import React from 'react';
import { Box, Text, VStack, Link, Button, Icon, HStack } from '@chakra-ui/react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { FaChartLine, FaUsers, FaUserMd, FaUser, FaFileMedical, FaBriefcaseMedical, FaSignOutAlt, FaCheck, FaWallet, FaCheckSquare, FaFacebookMessenger } from 'react-icons/fa'; // Updated icons
import { GiCardboardBox } from 'react-icons/gi';
import { useLogout } from '../Hooks/useLogout';

import { useColorModeValue } from '@chakra-ui/react';
import { useAuthContext } from '../Hooks/useAuthContext';

const PatientSidebar = () => {
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
            (window.location.href = '/patient/dashboard')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/patient/dashboard') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/patient/dashboard') ? '#DDE2FF' : '#A4A6B3'}
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
            (window.location.href = '/patient/addFamily')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/patient/addFamily') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/patient/addFamily') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="-2"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaUsers} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Family Members
            </Text>
          </HStack>
        </Button>
        <Button
          onClick={() =>
            (window.location.href = '/patient/doctors')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/patient/doctors') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/patient/doctors') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="-2"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaUserMd} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Doctors
            </Text>
          </HStack>
        </Button>
        <Button
          onClick={() =>
            (window.location.href = '/patient/prescription')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/patient/prescription') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/patient/prescription') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="-2"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaBriefcaseMedical} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Prescription
            </Text>
          </HStack>
        </Button>
        {/* Followup Requests Button */}
        <Button
          onClick={() =>
            (window.location.href = '/patient/records')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/patient/records') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/patient/records') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="-2"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaFileMedical} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Health Records
            </Text>
          </HStack>
        </Button>
        {/* Appointment Button */}
        <Button
          onClick={() =>
            (window.location.href = '/patient/appointments')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/patient/appointments') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/patient/appointments') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="-2"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={FaCheck} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Appointment
            </Text>
          </HStack>
        </Button>
        <Button
          onClick={() =>
            (window.location.href = '/Package')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/Package') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/Package') ? '#DDE2FF' : '#A4A6B3'}
          borderRadius={0}
          pl="0"
          pr="0"
          mt="-2"
        >
          <HStack justifyContent="flex-start" w="100%">
            <Icon as={GiCardboardBox} boxSize={4} mr={5} ml={5}/>
            <Text fontSize="18px" textAlign="left">
              Packages
            </Text>
          </HStack>
        </Button>
        {/* Notification Button */}
        <Button
          onClick={() =>
            (window.location.href = '/patient/notifications')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/patient/notifications') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/patient/notifications') ? '#DDE2FF' : '#A4A6B3'}
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
            (window.location.href = '/patient/chat')
          }
          w="100%"
          h="60px"
          variant="ghost"
          _hover={{ bgColor: '#18453D' }}
          _active={{ bgColor: '#18453D' }}
          bg={isLinkSelected('/patient/chat') ? '#18453D' : '#183D3D'}
          _focus={{ boxShadow: 'none' }}
          color={isLinkSelected('/patient/chat') ? '#DDE2FF' : '#A4A6B3'}
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

export default PatientSidebar;
