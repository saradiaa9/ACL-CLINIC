import {
    Flex,
    Box,
    useColorModeValue,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Input,
    VStack,
    useToast,
    HStack,
  } from '@chakra-ui/react';
  
  import { useState, useEffect } from 'react';
  
  import { useAuthContext } from '../../Hooks/useAuthContext';
  
  import axios from 'axios';
  
  const Status = () => {
    const toast = useToast();
  
    const { user, loading } = useAuthContext();
    const username = user?.Username;
  
    const [accepted, setAccepted] = useState('');
    const [file, setFile] = useState('');
    const [docs, setDocs] = useState([]);
  
    useEffect(() => {
      if (user) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      }
  
      const getAccepted = async () => {
        axios
          .get(`Admin/getDoctor?Username=${username}`)
          .then(res => {
            setAccepted(res.data.doctor.Accepted);
          })
          .catch(err => {
            console.log(err);
          });
      };
  
      const getDocs = async () => {
        axios
          .get(`/Doctor/getDocs?Username=${username}`)
          .then(res => {
            console.log('res.data: ', res.data);
            setDocs(res.data.docs);
            console.log('docs: ', docs);
          })
          .catch(err => {
            console.log(err);
          });
      };
  
      getAccepted();
      getDocs();
    }, [user, username]);
  
    const handleFileChange = e => {
      setFile(e.target.files[0]);
    };
  
    const handleUpload = async e => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('file', file); // .get('file')
      axios
        .post(`/uploadDoc?Username=${username}&Type=`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          toast({
            title: 'Document Uploaded',
            description: 'Your document has been uploaded successfully',
            status: 'success',
            duration: 9000,
            isClosable: true,
            onCloseComplete: () => {
              window.location.reload();
            },
          });
        })
        .catch(err => {
          toast({
            title: 'Document Upload Failed',
            description: 'Your document could not be uploaded',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
          console.log(err);
        });
    };
  
    const calculateColor = accepted => {
      if (accepted === 'accepted') {
        return 'green.200';
      } else if (accepted === 'not decided') {
        return 'yellow.200';
      } else if (accepted === 'rejected') {
        return 'red.200';
      } else {
        return 'gray.200';
      }
    };
  
  
    return (
      <VStack
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
        maxW={'100vw'}
        h={'100vh'}
        maxH={'100vh'}
        flexDirection={'column'}
        spacing={10}
      >
        <Card w={'50%'} maxW={'80%'} alignItems={'center'}>
          <CardHeader textAlign={'center'} fontSize="6xl" fontWeight="bold">
            Doctor Status
          </CardHeader>
          <CardBody align={'center'}>
            <Box
              textAlign={'center'}
              fontSize="4xl"
              fontWeight="bold"
              bg={calculateColor(accepted)}
              boxShadow="xl"
              borderRadius="lg"
              p="6"
              w={'100%'}
            >
              {accepted.charAt(0).toUpperCase() + accepted.slice(1)}
            </Box>
          </CardBody>
          <CardFooter>
            {accepted !== 'rejected' && (
              <>
                {' '}
                <VStack>
                  <Input
                    type="file"
                    accept=".pdf, image/*"
                    encType="multipart/form-data"
                    onChange={handleFileChange}
                  />
                  <Button bg="#93b1a6" onClick={handleUpload} color="white">
                    Upload Document
                  </Button>
                </VStack>
              </>
            )}
          </CardFooter>
        </Card>
        {/* view documents buttons*/}
        <HStack w={'50%'} maxW={'80%'} justify={'space-evenly'}>
          {docs.map(doc => (
            <Button
              color="#93b1a6"
              size={'lg'}
              onClick={() => {
                window.open(
                  `http://localhost:4000/uploads/${doc}`,
                  '_blank',
                  'noopener,noreferrer'
                );
              }}
            >
              {doc}
            </Button>
          ))}
        </HStack>
      </VStack>
    );
  };
  
  export default Status;
  