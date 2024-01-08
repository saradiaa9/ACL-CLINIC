import { Box, Heading, Text, VStack, Badge, Button, Select, HStack } from '@chakra-ui/react';
import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../Hooks/useAuthContext';
import { useParams } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { useColorModeValue } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody } from '@chakra-ui/react';

const ViewAppointment = () => {
    const { user } = useAuthContext();
    const Username = user?.Username;
}

