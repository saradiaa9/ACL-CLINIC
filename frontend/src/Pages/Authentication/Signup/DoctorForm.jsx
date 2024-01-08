import {
  Heading,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Radio,
  FormHelperText,
  RadioGroup,
  Stack,
  InputGroup,
  InputLeftAddon,
  Textarea,
} from '@chakra-ui/react';

function DoctorForm({ formData, setFormData }) {
  const handleFormDataChange = event => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  return (
    <>
      <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
        Doctor Details
      </Heading>

      <FormControl mt="2%">
        <FormLabel htmlFor="hourlyRate" fontWeight={'normal'}>
          Hourly Rate
        </FormLabel>
        <InputGroup size="sm">
          <InputLeftAddon
            bg="gray.50"
            _dark={{
              bg: 'gray.800',
            }}
            color="gray.500"
            rounded="md"
          >
            EGP
          </InputLeftAddon>
          <Input
            id="hourlyRate"
            type="number"
            placeholder="Hourly Rate"
            focusBorderColor="brand.400"
            rounded="md"
            value={formData.hourlyRate}
            onChange={handleFormDataChange}
            required
          />
        </InputGroup>
      </FormControl>

      <Flex>
        <FormControl mt="2%">
          <FormLabel htmlFor="affiliation" fontWeight={'normal'}>
            Affiliation
          </FormLabel>
          <Input
            id="affiliation"
            placeholder="Affiliation"
            value={formData.affiliation}
            onChange={handleFormDataChange}
            required
          />
        </FormControl>

        <FormControl mt="2%" ml="5%">
          <FormLabel htmlFor="educationalBackground" fontWeight={'normal'}>
            Educational Background
          </FormLabel>
          <Input
            id="educationalBackground"
            placeholder="Educational Background"
            value={formData.educationalBackground}
            onChange={handleFormDataChange}
            required
          />
        </FormControl>
      </Flex>

      <FormControl mt="2%">
        <FormLabel htmlFor="specialization" fontWeight={'normal'}>
          Specialization
        </FormLabel>
        <Input
          id="specialization"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={handleFormDataChange}
          required
        />
      </FormControl>
    </>
  );
}

export default DoctorForm;
