import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  VStack,
  HStack,
  Center,
  useToast,
} from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';

function Documents() {
  const toast = useToast();

  const { username } = useParams();
  const [file, setFile] = useState();
  const [documents, setDocuments] = useState([]);

  const upload = async e => {
    e.preventDefault(); // Prevent form submission
    console.log(username);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`/Doctor/upload?username=${username}`, formData);
      // Refetch documents after successful upload
      fetchDocuments();
      toast({
        title: 'Document uploaded successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error uploading document',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const removeDocument = async filename => {
    try {
      if (!filename) {
        console.error('Filename is undefined or null.');
        return;
      }

      await axios.post(
        `/Doctor/removeDocuments?username=${username}&filename=${filename}`
      );
      // Refetch documents after successful removal
      fetchDocuments();
    } catch (error) {
      console.error(`Error removing document (${filename}):`, error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        `/Doctor/getDocuments?username=${username}`
      );
      setDocuments(response.data.documents);
      console.log(response.data.documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    // Fetch documents when the component mounts
    fetchDocuments();
  }, []);

  return (
    <VStack spacing={8} align="stretch">
      <Center>
        <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
          {/* File Upload Section */}
          <form onSubmit={upload}>
            <HStack spacing={4} mb={4}>
              <Input type="file" onChange={e => setFile(e.target.files[0])} />
              <Button type="submit" colorScheme="teal">
                Upload
              </Button>
            </HStack>
          </form>

          {/* Display Documents Section */}
          <Text></Text>

          {documents.length > 0 ? (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Filename</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {documents.map(document => (
                  <Tr key={document.filename}>
                    <Td>{document.filename}</Td>
                    <Td>
                      {/* Add a Remove button with an X shape */}
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => removeDocument(document.filename)}
                        leftIcon={<FaTimes />}
                      >
                        Remove
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Text>Please Upload your Medical ID, License, and Degree</Text>
          )}
        </Box>
      </Center>
    </VStack>
  );
}

export default Documents;
