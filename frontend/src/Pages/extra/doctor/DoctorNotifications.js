import { Box, Heading, Text, VStack, Badge, Button, HStack, Input } from '@chakra-ui/react';
import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../../Hooks/useAuthContext';

const DoctorNotifications = () => {
  const { user } = useAuthContext();
  const Username = user?.Username;
  const [filter, setFilter] = useState('');
  const [notificationData, setNotificationData] = useState([]);

  const getNotifications = async () => {
    if (user && Username) {
      try {
        const response = await axios.get(`/Notification/get?doctorUsername=${Username}`);
        if (Array.isArray(response.data.notifications)) {
          setNotificationData(response.data.notifications);
          
        } else {
          console.error('Notifications data is not an array:', response.data.notifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
  };

  useEffect(() => {
    getNotifications();
  }, [user, Username]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  const formatTimestamp = (timestamp) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, options);
  };

  const filteredNotifications = notificationData.filter((notification) => {
    if (!filter) return true;
    if (notification.timestamp) {
      const dateMatch = formatTimestamp(notification.timestamp).toLowerCase().includes(filter);
    
      // Check if notification.message exists before calling .includes()
      const messageMatch = notification.Message && notification.Message.toLowerCase().includes(filter);
    
      return dateMatch || messageMatch;
    }
    return false;
  });
  

  return (
    <Box p={4} marginLeft={280} bgColor="#f5f5f5" borderRadius={5}>
      <Heading as="h2" size="lg" mb={4} color="black">
        My Notifications
      </Heading>
      <VStack align="stretch" spacing={4}>
      <HStack>
          <Button colorScheme="teal" onClick={() => setFilter('')}>
            Clear Filter
          </Button>
          <Input
            placeholder="Filter by date or message"
            onChange={handleFilterChange}
            value={filter || ''}
          />
        </HStack>
        {filteredNotifications.length === 0 ? (
          <Text>No notifications found</Text>
        ) : (
          filteredNotifications.map((notification, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="md"
              p={4}
              boxShadow="lg"
            >
              <Text fontSize="lg" fontWeight="bold">
                Date: {formatTimestamp(notification.timestamp)}
              </Text>
              <Text>
                <strong>Message:</strong> {notification.Message}
              </Text>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default DoctorNotifications;