import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../Hooks/useAuthContext';
import axios from 'axios';
import { Button, VStack, Box, IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons'; // Import the back arrow icon
import VideoRoom from '../../Components/VideoRoom';

function VideoCall() {
  const [joined, setJoined] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }
  }, [user]);

  const handleBack = () => {
    // Add logic to navigate to the desired page
    window.location.href = `/patient/doctors`;
  };

  return (
    <VStack spacing={4} align="center" ml={280}>
      <Box position="absolute" top="20" left="280"> {/* Adjust the top and left values based on your layout */}
        <IconButton
          icon={<ArrowBackIcon />}
          onClick={handleBack}
          aria-label="Back"
          variant="ghost"
        />
      </Box>

      {user && !joined && (
        <Button colorScheme="teal" size="lg" onClick={() => setJoined(true)}>
          Join Room
        </Button>
      )}

      {user && joined && (
        <>
          <Button colorScheme="red" size="lg" onClick={() => setJoined(false)}>
            To Lobby
          </Button>
          <VideoRoom />
        </>
      )}
    </VStack>
  );
}

export default VideoCall;
