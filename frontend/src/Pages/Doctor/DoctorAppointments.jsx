import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Input,
  Button,
  List,
  ListItem,
  Text,
  Spinner,
  Flex,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
import Axios from "axios";
import { useAuthContext } from "../../Hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

const DoctorAppointments = () => {
  const { user, loading } = useAuthContext();
  const Username = user?.Username;
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [newDateTime, setNewDateTime] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchValue, setSearchValue] = useState("");

  const fetchDoctorSchedules = async () => {
    try {
      const response = await Axios.get(
        `/Doctor/getScheduleOfDoctor?Username=${Username}`
      );
      console.log(response.data);
      setSchedules(response.data.updatedSchedules);
    } catch (error) {
      console.error("Error fetching doctor schedules:", error);
    }
  };

  useEffect(() => {
    if (user) {
      Axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    }

    fetchDoctorSchedules();
  }, [Username, user, filterStatus]);

  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const handleFilter = async (selectedFilter) => {
    if (selectedFilter != "All") {
      try {
        // Perform the rescheduling process
        setSearchValue("");
        const response = await Axios.get(
          `/Doctor/filterAppointments?Username=${Username}&status=${selectedFilter}`
        );

        // Use the state callback function to ensure it's based on the latest state
        setSchedules(response.data.updatedSchedules);
        console.log(response.data.updatedSchedules);
      } catch (error) {
        console.error("Error filtering appointments:", error);
      }
    } else {
      fetchDoctorSchedules();
    }
  };

  const handleSearch = async () => {
    try {
      // Perform the rescheduling process
      console.log(searchValue);
      const response = await Axios.get(
        `/Doctor/searchAppointments?Username=${Username}&patientName=${searchValue}`
      );

      // Use the state callback function to ensure it's based on the latest state
      setSchedules(response.data.updatedSchedules);
      console.log(response.data.updatedSchedules);
    } catch (error) {
      setSchedules([]);
      console.error("No appointments found:", error);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  const handleGoToPatient = () => {
    if (selectedSchedule && selectedSchedule.patient) {
      const patientUsername = selectedSchedule.patient.Username;
      navigate(`/thispatient/${patientUsername}`); // Use navigate to redirect
    }
  };

  return (
    <Flex direction="column" padding="1rem" ml={340} mt={50}>
      <Box
        width="100%"
        maxWidth="900px"
        textAlign="center"
        backgroundColor="#f5f5f5"
        borderRadius="4px"
        margin="1rem"
        padding="1rem"
      >
        {/* Dropdown for filtering */}
        <Select onChange={(e) => handleFilter(e.target.value)} mb={3}>
          <option value="All">All</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Rescheduled">Rescheduled</option>
        </Select>

        {/* Search input for date or patient name */}
        <Input
          type="text"
          placeholder="Search by patient name"
          onChange={(e) => handleSearchChange(e.target.value)}
          mb={3}
          value={searchValue}
        />

        {/* Button for triggering search */}
        <Button bg="#183D3D" onClick={handleSearch} color="white">
          Search
        </Button>
      </Box>

      {/* My Details section */}
      <Box
        width="100%"
        maxWidth="700px"
        textAlign="center"
        backgroundColor="#f5f5f5"
        borderRadius="4px"
        margin="1rem"
        padding="1rem"
        ml={130}
      >
        <Text
          fontSize="1.5rem"
          fontWeight="bold"
          marginBottom="1rem"
          color="#183D3D"
        >
          MY SCHEDULE
        </Text>
        {loading ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="grey.200"
            color="#5C8374"
            size="xl"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            mt={300}
            ml={20}
          />
        ) : (
          <Box>
            {selectedSchedule && (
              <Button
                bg="#183D3D"
                color="white"
                mb={5}
                ml={6}
                onClick={handleGoToPatient}
              >
                Go To Patient
              </Button>
            )}
            <List spacing={3}>
              <SimpleGrid columns={[1, 2]} spacing={3}>
                {schedules.map((schedule, index) => (
                  <ListItem
                    key={index}
                    borderWidth="1px"
                    borderRadius="lg"
                    padding={4}
                    backgroundColor={
                      selectedSchedule === schedule ? "#93B1A6" : "white"
                    }
                    onClick={() => handleScheduleClick(schedule)}
                    cursor="pointer"
                    _hover={{ bg: "#93B1A6" }}
                  >
                    <Heading fontSize="md">
                      {schedule.patient ? schedule.patient.Name : "No Patient"}
                    </Heading>
                    <Heading fontSize="md">
                      {schedule.patient
                        ? schedule.patient.MobileNumber
                        : "No Number"}
                    </Heading>
                    <Text fontSize="sm" color="black">
                      {formatDateTime(schedule.dateFrom)}
                    </Text>
                    <Text fontSize="sm" color="black">
                      {schedule.status}
                    </Text>
                  </ListItem>
                ))}
              </SimpleGrid>
            </List>
            
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default DoctorAppointments;
