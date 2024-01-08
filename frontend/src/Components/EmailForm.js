import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import emailjs from 'emailjs-com';

const EmailForm = () => {
  const [formData, setFormData] = useState({
    sendername: '',
    to: '',
    subject: '',
    replyto: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const sendMail = (e) => {
    e.preventDefault();

    emailjs.init('x-ySe3UstiiWwc0mG');

    const params = {
      sendername: formData.sendername,
      to: formData.to,
      subject: formData.subject,
      replyto: formData.replyto,
      message: formData.message,
    };

    const serviceID = 'service_oi4etjl';
    const templateID = 'template_qsrridc';

    emailjs
      .send(serviceID, templateID, params)
      .then((res) => {
        alert('Email sent successfully!!');
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  };

  return (
    <Box p={4} maxW="md" mx="auto">
      <form>
        <FormControl mb={4}>
          <FormLabel htmlFor="sendername">Sender Name</FormLabel>
          <Input
            type="text"
            id="sendername"
            onChange={handleChange}
            value={formData.sendername}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel htmlFor="to">To (Email)</FormLabel>
          <Input
            type="text"
            id="to"
            onChange={handleChange}
            value={formData.to}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel htmlFor="subject">Subject</FormLabel>
          <Input
            type="text"
            id="subject"
            onChange={handleChange}
            value={formData.subject}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel htmlFor="replyto">Reply To (Email)</FormLabel>
          <Input
            type="text"
            id="replyto"
            onChange={handleChange}
            value={formData.replyto}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel htmlFor="message">Message</FormLabel>
          <Textarea
            id="message"
            cols="40"
            rows="8"
            onChange={handleChange}
            value={formData.message}
          />
        </FormControl>

        <Button colorScheme="teal" onClick={sendMail}>
          Send
        </Button>
      </form>
    </Box>
  );
};

export default EmailForm;
