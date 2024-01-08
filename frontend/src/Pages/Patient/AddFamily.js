import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Input,
  Button,
  Select,
  FormControl,
  FormLabel,
  List,
  ListItem,
  Text,
  Spinner,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { useAuthContext } from "../../Hooks/useAuthContext";
import Axios from "axios";

const AddFamilyPage = () => {
  const { user, loading } = useAuthContext();
  const Username = user?.Username;
  const [dataLoading, setDataLoading] = useState(true);
  const [family, setFamily] = useState([]); // Array of family members
  const toast = useToast();
  const [familyInput, setFamilyInput] = useState(false);
  const [Name, setName] = useState("");
  const [NationalID, setNationalID] = useState("");
  const [Age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [relation, setRelation] = useState("");
  const [patientInput, setPatientInput] = useState(false);
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");

  const fetchFamily = async () => {
    try {
      const response = await Axios.get(
        `/Patient/getFamilyMembers?Username=${Username}`
      );
      console.log(response.data);
      setFamily(response.data);
    } catch (error) {
      console.error("Error fetching family:", error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      Axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    }

    fetchFamily();
  }, [user, Username, family]); // Include 'doctor' in the dependency array

  const handleAddFamily = async () => {
    setFamilyInput(true);
    setPatientInput(false);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleNationalIDChange = (event) => {
    setNationalID(event.target.value);
  };

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const handleAddFamilySubmit = async () => {
    try {
      await Axios.post(`/Patient/addFamilyMember?Username=${Username}`, {
        Name: Name,
        NationalID: NationalID,
        Age: Age,
        Gender: gender,
        Relation: relation,
      });

      toast({
        title: "Family member added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setFamilyInput(false);
      fetchFamily();
      window.location.reload();
    } catch (error) {
      console.error("Error adding family member:", error);

      toast({
        title: "Error adding family member",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleAddPatient = async () => {
    setPatientInput(true);
    setFamilyInput(false);
  };

  const handlePatient = async () => {
    try{
      await Axios.post(`/Patient/addPatientToPatient?Username=${Username}`, {
        Email: Email,
        Phone: Phone,
        Relation: relation,
      });

      toast({
        title: "Patient added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setPatientInput(false);
      fetchFamily();
      window.location.reload();

    } catch (error) {
      console.error("Error adding this patient:", error);

      toast({
        title: "Error adding this patient",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

    }
  }

  return (
    <Flex
      direction="column"
      // alignItems="center"
      padding="1rem"
      ml="300px"
    >
      <Box
        width="100%"
        maxWidth="800px"
        textAlign="center"
        backgroundColor="#f5f5f5"
        borderRadius="4px"
        margin="1rem"
        padding="1rem"
        left={30}
        ml={100}
      >
        <Text
          fontSize="1.5rem"
          fontWeight="bold"
          marginBottom="1rem"
          color="#183D3D"
        >
          MY FAMILY MEMBERS
        </Text>

        

        <Flex direction="row" ml={1} justifyContent={"center"}>

        {patientInput && (
          <Input
            mb={2}
            placeholder="Email"
            value={Email}
            onChange={handleEmailChange}
            mt={2}
            width={250}
            mr={2}
          />
        )}

        {patientInput && (
          <Input
            mb={2}
            placeholder="Phone Number"
            value={Phone}
            onChange={handlePhoneChange}
            mt={2}
            width={250}
            mr={2}
          />
        )}

        {familyInput && (
          <Input
            mb={2}
            placeholder="Name"
            value={Name}
            onChange={handleNameChange}
            mt={2}
            width={250}
            mr={2}
          />
        )}

        {familyInput && (
          <Input
            mb={2}
            placeholder="National ID"
            value={NationalID}
            onChange={handleNationalIDChange}
            mt={2}
            type="number"
            width={250}
            mr={2}
          />
        )}

        {familyInput && (
          <Input
            mb={2}
            placeholder="Age"
            value={Age}
            onChange={handleAgeChange}
            mt={2}
            type="number"
            width={250}
            mr={2}
          />
        )}
          {familyInput && (
            <Select
              mb={2}
              placeholder="Select Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              mt={2}
              width={250}
              mr={2}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          )}

          {familyInput | patientInput && (
            <Select
              mb={2}
              placeholder="Select Relation"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              mt={2}
              width={250}
              mr={1}
            >
              <option value="Husband">Husband</option>
              <option value="Wife">Wife</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
            </Select>
          )}
        </Flex>

        {!familyInput && (
          <Button bg="#93B1A6" color={"white"} onClick={handleAddFamily} mt={4}>
            Add Family Member
          </Button>
        )}

        {!patientInput && (
          <Button
            bg="#93B1A6"
            color={"white"}
            onClick={handleAddPatient}
            mt={4}
            ml={5}
          >
            Add Patient As Family Member
          </Button>
        )}
        {familyInput && (
          <Button bg="#183D3D" color={"white"} onClick={handleAddFamilySubmit} mt={4}
          ml={5}>
            Add Family Member
          </Button>
        )}

{patientInput && (
          <Button
            bg="#183D3D"
            color={"white"}
            onClick={handlePatient}
            mt={4}
            ml={5}
          >
            Add Patient As Family Member
          </Button>
        )}

        <List spacing={3} mt={5}>
          {family &&
            family.map((fam, index) => (
              <ListItem
                key={index}
                borderWidth="1px"
                borderRadius="lg"
                padding={4}
                backgroundColor={"white"}
                textAlign={"center"}
                alignItems={"center"}
              >
                <Heading fontSize="xl" color="#5C8374" mb={1} ml={5}>
                  {fam?.Name}
                </Heading>

                <Text marginBottom="1" ml={5}>
                  <strong>{fam?.NationalID}</strong>
                </Text>
                <Text marginBottom="1" ml={5}>
                  {fam?.Age} years old
                </Text>
                <Text marginBottom="1" ml={5}>
                  {fam?.Gender}
                </Text>
                <Text marginBottom="1" ml={5}>
                  {fam?.Relation}
                </Text>

                <List spacing={3} mt={5}>
                  <Heading fontSize="md" color="#5C8374" ml={5}>
                    {fam.Gender == "female" ? "Her Records" : "His Records"}
                  </Heading>

                  <Flex direction="row" ml={5} mt={5} justifyContent="center">
                    {fam.records &&
                      fam.records.map((record, index) => (
                        <ListItem
                          key={index}
                          borderWidth="1px"
                          borderRadius="lg"
                          padding={4}
                          backgroundColor="white"
                          marginRight={3} // Adjust the spacing between records
                          width="fit-content"
                        >
                          <Text marginBottom="1">{record?.Description}</Text>
                        </ListItem>
                      ))}
                  </Flex>
                </List>
              </ListItem>
            ))}
        </List>
      </Box>
    </Flex>
  );
};

export default AddFamilyPage;
