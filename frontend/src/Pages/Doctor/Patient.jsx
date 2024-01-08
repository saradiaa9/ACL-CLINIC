import React, { useState, useEffect } from 'react';
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
  useToast,
  SimpleGrid,
} from '@chakra-ui/react';
import Axios from 'axios';
import { useAuthContext } from '../../Hooks/useAuthContext';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import emailjs from 'emailjs-com';

const Patient = () => {
  const { user, loading } = useAuthContext();
  const Username = user?.Username;
  const Email = user?.Email;
  const Patient = useParams();
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();
  const [dataLoading, setDataLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newRecord, setNewRecord] = useState('');
  const [showDateInput, setShowDateInput] = useState(false);
  const [newDate, setNewDate] = useState('');
  const toast = useToast();
  const [appointments, setAppointments] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showFollowup, SetShowFollowup] = useState(false);
  const [showReschedule, SetShowReschedule] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [showAddInputD, setShowAddInputD] = useState(false);
  const [showAddPrescription, setShowAddPrescription] = useState(false);
  const [newNames, setNewNames] = useState([]);
  const [newDosages, setNewDosages] = useState([]);

  const fetchPatient = async () => {
    try {
      // Check if patient details have already been fetched
      if (!patient) {
        const response = await Axios.get(
          `/Doctor/getPatientByUsername?Username=${Patient.Username}`
        );
        setPatient(response.data.patient);

        try {
          const rec = await Axios.get(
            `/Patient/getmyRecords?Username=${Patient.Username}`
          );
          setRecords(rec.data.populatedRecords);
        } catch (error) {
          console.error('Error fetching records:', error);
        }

        try {
          const app = await Axios.get(
            `/Patient/getScheduleDoctor?Username=${Username}&patientUsername=${Patient.Username}`
          );
          setAppointments(app.data.schedules);
        } catch (error) {
          console.error('Error fetching appointments:', error);
        }

        try {
          const pres = await Axios.get(
            `/Patient/getmyPrescriptions?Username=${Patient.Username}`
          );
          console.log(pres.data.populatedPrescription);
          setPrescriptions(pres.data.populatedPrescription);
        } catch (error) {
          console.error('Error fetching prescriptions:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      Axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }

    fetchPatient();
  }, [user, Username, patient]);

  if (loading || dataLoading) {
    return (
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
    );
  }

  const formatDateTime = dateString => {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleAddRecordClick = () => {
    setShowInput(true);
  };

  const handleScheduleFollowupClick = () => {
    setShowDateInput(true);
    SetShowFollowup(true);
  };

  const handleRescheduleClick = () => {
    setShowDateInput(true);
    SetShowReschedule(true);
  };

  const handleRecordSubmit = async () => {
    try {
      await Axios.post(`/Doctor/addRecord?Username=${Username}`, {
        patientUsername: Patient.Username,
        description: newRecord,
      });

      toast({
        title: 'Record Added',
        description: 'Record added successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setNewRecord('');
      setShowInput(false);
      window.location.reload();
    } catch (error) {
      console.error('Error adding record:', error);

      toast({
        title: 'Error',
        description: 'Failed to add record. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCancel = async () => {
    try{
      await Axios.post(`/Doctor/cancelApp?id=${selectedSchedule._id}`)
      fetchPatient();

      toast({
        title: 'Appointment Cancelled',
        description: 'Appointment cancelled successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,

      });
      window.location.reload();
    } catch (error) {
      console.error('Error cancelling appointment:', error);

      toast({
        title: 'Error',
        description: 'Failed to cancel appointment. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const handleFollowupSubmit = async () => {
    try {
      await Axios.post(`/Doctor/scheduleFollowup?Username=${Username}`, {
        patientUsername: Patient.Username,
        dateFrom: newDate,
      });

      toast({
        title: 'Followup Scheduled',
        description: 'Followup scheduled successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setNewDate('');
      setShowDateInput(false);
      setSelectedSchedule(null);
      window.location.reload();
    } catch (error) {
      console.error('Error scheduling followup:', error);

      toast({
        title: 'Error',
        description: 'Failed to schedule followup. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleFollowupSubmit2 = async () => {
    if (user && Username) {
      try {
        // Create notifications for doctor and patient
        await Axios.post('/Notification/create', {
          doctorUsername: Username, // Assuming Username is the doctor's username
          message: 'Followup scheduled successfully with your patient. go back to the patient and see the Patient Appointment to see the details', // Customize the message
        });
    
        await Axios.post('/Notification/create', {
          patientUsername: Patient.Username,
          message: 'Followup scheduled successfully with your doctor. go to your appointnemt page to look at the details', // Customize the message
        });
        toast({
          title: 'Followup Notification',
          description: 'Followup Notified successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error scheduling followup:', error);
      }
    }
  };

  const handleRescheduleSubmit = async () => {
    try {
      await Axios.post(`/Doctor/rescheduleApp?Username=${Username}`, {
        patientUsername: Patient.Username,
        dateFrom: selectedSchedule.dateFrom,
        newDate: newDate,
      });

      toast({
        title: 'Followup Scheduled',
        description: 'Followup scheduled successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setNewDate('');
      setShowDateInput(false);
      setSelectedSchedule(null);
      window.location.reload();
    } catch (error) {
      console.error('Error scheduling followup:', error);

      toast({
        title: 'Error',
        description: 'Failed to schedule followup. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRescheduleSubmit2 = async () => {
    if (user && Username) {
      try {
        // Create notifications for doctor and patient
        await Axios.post('/Notification/create', {
          doctorUsername: Username, // Assuming Username is the doctor's username
          message: 'Appointment rescheduled successfully. go back to the patient and see the Patient Appointment to see the details', // Customize the message
        });
    
        await Axios.post('/Notification/create', {
          patientUsername: Patient.Username,
          message: 'Appointment rescheduled successfully with your doctor. go to your appointnemt page to look at the details', // Customize the message
        });
        toast({
          title: 'Followup Notification',
          description: 'Followup Notified successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error scheduling followup:', error);
      }
    }
  };

  const handleAddMedicineSubmit = async () => {
    try {
      await Axios.post(`/Doctor/addMedicine?Username=${Username}`, {
        patientUsername: Patient.Username,
        DateP: selectedPrescription.prescription.DateP,
        medicine: newName,
        dosage: newDosage,
      });

      toast({
        title: 'Medicine Added',
        description: 'Medicine added successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setNewName('');
      setNewDosage('');
      setShowAddInput(false);
      setSelectedSchedule(null);
      window.location.reload();
    } catch (error) {
      console.error('Error adding medicine:', error);

      toast({
        title: 'Error',
        description: 'Failed to add medicine. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteMedicineSubmit = async () => {
    try {
      await Axios.post(`/Doctor/deleteMedicine?Username=${Username}`, {
        patientUsername: Patient.Username,
        DateP: selectedPrescription.prescription.DateP,
        medicine: selectedMedicine.Name,
      });

      toast({
        title: 'Medicine Deleted',
        description: 'Medicine deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setSelectedSchedule(null);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting medicine:', error);

      toast({
        title: 'Error',
        description: 'Failed to delete medicine. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateMedicineSubmit = async () => {
    try {
      await Axios.post(`/Doctor/updateDosage?Username=${Username}`, {
        patientUsername: Patient.Username,
        DateP: selectedPrescription.prescription.DateP,
        medicine: selectedMedicine.Name,
        dosage: newDosage,
      });

      toast({
        title: 'Dosage Updated',
        description: 'Dosage updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setSelectedSchedule(null);
      window.location.reload();
    } catch (error) {
      console.error('Error updating dosage:', error);

      toast({
        title: 'Error',
        description: 'Failed to update dosage. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddPrescriptionSubmit = async () => {

    try {

      const medicineList = newNames.map((name, index) => ({
        Name: name,
        Dosage: newDosages[index],
      }));
      console.log(Patient.Username);
      await Axios.post(`/Doctor/addPrescription?Username=${Username}&patientUsername=${Patient.Username}`, {
        Medicine:medicineList
      });

      toast({
        title: 'Prescription Added',
        description: 'Prescription added successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setSelectedSchedule(null);
      window.location.reload();
    } catch (error) {
      console.error('Error adding Prescription:', error);

      toast({
        title: 'Error',
        description: 'Failed to add Prescription. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };


  const handleScheduleClick = schedule => {
    setSelectedSchedule(schedule);
  };

  const handlePrescriptionClick = prescription => {
    setSelectedPrescription(prescription);
  };

  const handleMedicineClick = medicine => {
    setSelectedMedicine(medicine);
  };

  const handleAddMedicineClick = () => {
    setShowAddInput(true);
    setShowAddInputD(true);
  };

  const handleUpdateMedicineClick = () => {
    setShowAddInputD(true);
  };

  const handleAddPrescriptionClick = () => {
    setShowAddPrescription(true);
  };

  const handleNameChange = event => {
    const inputNames = event.target.value;
    const namesArray = inputNames.split(',').map(name => name.trim());
    setNewNames(namesArray);
  };

  const handleDosageChange = event => {
    const inputDosages = event.target.value;
    const dosagesArray = inputDosages.split(',').map(dosage => dosage.trim());
    setNewDosages(dosagesArray);
  };

  const handleSubmitToPharmacy = async () => {
    confirmAlert({
      title: 'Confirm Submission',
      message: 'Are you sure you want to submit to the pharmacy?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await Axios.post(`/Doctor/submitToPharmacy?Username=${Username}`, {
                patientUsername: Patient.Username,
                DateP: selectedPrescription.prescription.DateP,
              });
        
              toast({
                title: 'Submitted to Pharmacy',
                description: 'Submitted to pharmacy successfully.',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
        
              
              window.location.reload();
            } catch (error) {
              console.error('Error submitting to pharmacy:', error);
        
              toast({
                title: 'Error',
                description: 'Failed to submit to pharmacy. Please try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
            }
          },
        },
        {
          label: 'No I Want To Update It',
          onClick: () => {
            // User clicked "No," do nothing or handle accordingly
            setSelectedMedicine("xx");
            setShowAddInputD(false);
            setShowAddInput(false);
            setShowAddPrescription(false);
            

          },
        },
      ],
    });
  }

  const downloadPrescription = async () => {
    try {
      const response = await Axios.get(`/prescription/download/${selectedPrescription.prescription._id}`, {
        responseType: 'blob', // Set the response type to blob
      });

      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Create a link element and trigger a click to download the file
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'prescription.pdf';
      link.click();
    } catch (error) {
      console.error('Error downloading prescription:', error);
    }
  };
  

  return (
    <Flex
      direction="column"
      // alignItems="center"
      padding="1rem"
      ml={250}
    >
      <Box
        width="100%"
        maxWidth="1050px"
        textAlign="center"
        backgroundColor="#f5f5f5"
        borderRadius="4px"
        margin="1rem"
        padding="1rem"
        left={30}
      >
        <Text
          fontSize="1.5rem"
          fontWeight="bold"
          marginBottom="1rem"
          color="#183D3D"
        >
          PATIENT DETAILS
        </Text>

        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tr>
            <td
              style={{
                borderRight: '2px solid #C0C0C0',
                paddingLeft: '5px',
                paddingRight: '5px',
              }}
            >
              <Text marginBottom="1" color="#5C8374">
                <strong>NAME</strong>
              </Text>
              <Text marginBottom="1">{patient?.Name}</Text>
            </td>
            <td
              style={{
                borderRight: '2px solid #C0C0C0',
                paddingLeft: '5px',
                paddingRight: '5px',
              }}
            >
              <Text marginBottom="1" color="#5C8374">
                <strong>DATE OF BIRTH</strong>
              </Text>
              <Text marginBottom="1">{formatDate(patient?.DateOfBirth)}</Text>
            </td>
            <td
              style={{
                borderRight: '2px solid #C0C0C0',
                paddingLeft: '5px',
                paddingRight: '5px',
              }}
            >
              <Text marginBottom="1" color="#5C8374">
                <strong>EMAIL</strong>
              </Text>
              <Text marginBottom="1" mt={6}>
                {patient?.Email}
              </Text>
            </td>
            <td
              style={{
                borderRight: '2px solid #C0C0C0',
                paddingLeft: '5px',
                paddingRight: '5px',
              }}
            >
              <Text marginBottom="1" color="#5C8374">
                <strong>NATIONAL ID</strong>
              </Text>
              <Text marginBottom="1">
                {patient.NationalID ? patient.NationalID : 'No ID'}
              </Text>
            </td>
            <td
              style={{
                borderRight: '2px solid #C0C0C0',
                paddingLeft: '5px',
                paddingRight: '5px',
              }}
            >
              <Text marginBottom="1" color="#5C8374">
                <strong>GENDER</strong>
              </Text>
              <Text marginBottom="1" mt={6}>
                {patient?.Gender}
              </Text>
            </td>
            <td
              style={{
                borderRight: '2px solid #C0C0C0',
                paddingLeft: '5px',
                paddingRight: '5px',
              }}
            >
              <Text marginBottom="1" color="#5C8374">
                <strong>MOBILE NUMBER</strong>
              </Text>
              <Text marginBottom="1">{patient?.MobileNumber}</Text>
            </td>
            <td
              style={{
                borderRight: '2px solid #C0C0C0',
                paddingLeft: '5px',
                paddingRight: '5px',
              }}
            >
              <Text marginBottom="1" color="#5C8374">
                <strong>EMERGENCY CONTACT NAME</strong>
              </Text>
              <Text marginBottom="1">{patient?.EmergencyContact.Name}</Text>
            </td>
            <td style={{ paddingLeft: '5px', paddingRight: '5px' }}>
              <Text marginBottom="1" color="#5C8374">
                <strong>EMERGENCY CONTACT MOBILE NUMBER</strong>
              </Text>
              <Text marginBottom="1">
                {patient?.EmergencyContact.MobileNumber}
              </Text>
            </td>
          </tr>
        </table>
      </Box>
      
      <Box
          width="100%"
          maxWidth="1040px"
          textAlign="center"
          backgroundColor="#f5f5f5"
          borderRadius="4px"
          margin="1rem"
          padding="1rem"
          left={30}
          mr={1}
        >
          <Text
            fontSize="1.5rem"
            fontWeight="bold"
            marginBottom="1rem"
            color="#183D3D"
          >
            PATIENT APPOINTMENTS
          </Text>
          {!showDateInput && (
            <Button
              onClick={handleScheduleFollowupClick}
              bg="#93B1A6"
              color="white"
              mb={5}
            >
              Schedule Followup
            </Button>
          )}
          {!showDateInput && selectedSchedule && (
            <Button
              onClick={handleRescheduleClick}
              bg="#93B1A6"
              color="white"
              mb={5}
              ml={5}
            >
              Reschedule Appointment
            </Button>
          )}
          { selectedSchedule && (<Button
              onClick={handleCancel}
              bg="#93B1A6"
              color="white"
              mb={5}
              ml={5}
            >
              Cancel Appointment
            </Button>)

          }
          {/* Input field for new record */}
          {showDateInput && (
            <Input
              onChange={e => setNewDate(e.target.value)}
              marginBottom="1rem"
              mb={5}
              type="datetime-local"
            />
          )}

          {/* Button to submit the new record */}
          {showFollowup && (
            <Button
              onClick={handleFollowupSubmit}
              bg="#93B1A6"
              color="white"
              mb={5}
            >
              Schedule Followup
            </Button>
          )}

          {/* Button to submit the new record */}
          {showReschedule && (
            <Button
              onClick={handleRescheduleSubmit}
              bg="#93B1A6"
              color="white"
              mb={5}
            >
              Reschedule Appointment
            </Button>
          )}

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
              <List spacing={3}>
              <SimpleGrid columns={[1, 4]} spacing={3}>
                {appointments.map((appointment, index) => (
                  <ListItem
                    key={index}
                    borderWidth="1px"
                    borderRadius="lg"
                    padding={4}
                    cursor="pointer"
                    backgroundColor={
                      selectedSchedule === appointment
                        ? '#93B1A6'
                        : appointment.status === 'Rescheduled'
                        ? '#C0C0C0'
                        : appointment.status === 'Completed'
                        ? '#E0E0E0'
                        : appointment.status === 'Cancelled'
                        ? 'F0F0F0'
                        : 'white'
                    }
                    onClick={() => handleScheduleClick(appointment)}
                    _hover={{ bg: '#93B1A6' }}
                  >
                    <Heading fontSize="md" color="#5C8374">
                      {appointment ? appointment.patient.Name : 'No Patient'}{' '}
                    </Heading>
                    <Text fontSize="sm" color="black">
                      {appointment
                        ? 'Dr. ' + appointment.doctor.Name
                        : 'No Doctor'}
                    </Text>
                    <Text fontSize="sm" color="black">
                      {appointment
                        ? formatDateTime(appointment.dateFrom)
                        : 'No Date'}
                    </Text>
                    <Text fontSize="sm" color="black">
                      {appointment ? appointment.status : 'No Status'}
                    </Text>
                  </ListItem>
                ))}
                </SimpleGrid>
              </List>
            </Box>
          )}
        </Box>
        <Flex direction="row">
        <Box
          width="100%"
          maxWidth="600px"
          textAlign="center"
          backgroundColor="#f5f5f5"
          borderRadius="4px"
          margin="1rem"
          padding="1rem"
          height="fit-content"
        >
          <Text
            fontSize="1.5rem"
            fontWeight="bold"
            marginBottom="1rem"
            color="#183D3D"
          >
            PATIENT HEALTH RECORDS
          </Text>

          {/* Button to show input field */}
          {!showInput && (
            <Button
              onClick={handleAddRecordClick}
              bg="#93B1A6"
              color="white"
              mb={5}
            >
              Add Record
            </Button>
          )}
          {/* Input field for new record */}
          {showInput && (
            <Input
              value={newRecord}
              onChange={e => setNewRecord(e.target.value)}
              placeholder="Enter new record..."
              marginBottom="1rem"
              mb={5}
            />
          )}

          {/* Button to submit the new record */}
          {showInput && (
            <Button
              onClick={handleRecordSubmit}
              bg="#93B1A6"
              color="white"
              mb={5}
            >
              Submit Record
            </Button>
          )}

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
              <List spacing={3}>
              <SimpleGrid columns={[1, 2]} spacing={3}>
                {records.map((record, index) => (
                  <ListItem
                    key={index}
                    borderWidth="1px"
                    borderRadius="lg"
                    padding={4}
                    _hover={{ bg: '#93B1A6' }}
                  >
                    <Heading fontSize="md" color="#5C8374">
                      {patient ? patient.Name : 'No Patient'}{' '}
                    </Heading>
                    <Text fontSize="sm" color="black">
                      {record ? 'Dr. ' + record.doctor.Name : 'No Doctor'}
                    </Text>
                    <Text fontSize="sm" color="black">
                      {record ? record.Description : 'No Description'}
                    </Text>
                  </ListItem>
                ))}
                </SimpleGrid>
              </List>
            </Box>
          )}
        </Box>
        <Box
        width="100%"
        maxWidth="1050px"
        textAlign="center"
        backgroundColor="#f5f5f5"
        borderRadius="4px"
        margin="1rem"
        padding="1rem"
        height="100%"
      >
        <Text
          fontSize="1.5rem"
          fontWeight="bold"
          marginBottom="1rem"
          color="#183D3D"
        >
          PATIENT PRESCRIPTIONS
        </Text>

        {!showAddPrescription && (
          <Button
            onClick={handleAddPrescriptionClick}
            bg="#93B1A6"
            color="white"
            mb={5}
          >
            Add Prescription
          </Button>
        )}

        {selectedPrescription && (
          <Button
            onClick={handleSubmitToPharmacy}
            bg="#93B1A6"
            color="white"
            mb={5}
            ml={5}
          >
            Submit to Pharmacy
          </Button>
        )}

        {selectedPrescription && (
          <Button
            onClick={downloadPrescription}
            bg="#93B1A6"
            color="white"
            mb={5}
            ml={5}
          >
            Download Prescription
          </Button>
        )}

        {showAddPrescription && (
          <Button
            onClick={handleAddPrescriptionSubmit}
            bg="#93B1A6"
            color="white"
            mb={5}
          >
            Add Prescription
          </Button>
        )}

        {showAddPrescription && (
          <Input
            type="text"
            value={newNames.join(',')}
            placeholder="Names seperated by commas"
            marginBottom="1rem"
            mb={5}
            onChange={handleNameChange}
          />
        )}

        {showAddPrescription && (
          <Input
            type="text"
            value={newDosages.join(',')}
            placeholder="Dosages seperated by commas"
            marginBottom="1rem"
            mb={5}
            onChange={handleDosageChange}
          />
        )}

        {selectedPrescription && !showAddInput && !showAddInputD && (
          <Button
            onClick={handleAddMedicineClick}
            bg="#93B1A6"
            color="white"
            mb={5}
            ml={5}
          >
            Add Medicine
          </Button>
        )}

        {selectedPrescription && showAddInput && (
          <Button
            onClick={handleAddMedicineSubmit}
            bg="#93B1A6"
            color="white"
            mb={5}
            ml={5}
          >
            Add Medicine
          </Button>
        )}

        {selectedMedicine && !showAddInputD && (
          <Button
            onClick={handleUpdateMedicineClick}
            bg="#93B1A6"
            color="white"
            mb={5}
            ml={5}
          >
            Update Dosage
          </Button>
        )}

        {selectedMedicine && showAddInputD && (
          <Button
            onClick={handleUpdateMedicineSubmit}
            bg="#93B1A6"
            color="white"
            mb={5}
            ml={5}
          >
            Update Dosage
          </Button>
        )}
        {selectedMedicine && !showAddInputD && (
          <Button
            onClick={handleDeleteMedicineSubmit}
            bg="#93B1A6"
            color="white"
            mb={5}
            ml={5}
          >
            Delete Medicine
          </Button>
        )}
        {/* Input field for new record */}
        {showAddInput && (
          <Input
            onChange={e => setNewName(e.target.value)}
            placeholder="Name"
            marginBottom="1rem"
            mb={5}
          />
        )}
        {showAddInputD && (
          <Input
            onChange={e => setNewDosage(e.target.value)}
            placeholder="Dosage"
            marginBottom="1rem"
            mb={5}
            type="Number"
          />
        )}

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
            <List spacing={3}>
              <SimpleGrid columns={[1, 2]} spacing={3}>
              {prescriptions.map((prescription, index) => (
                <ListItem
                  key={index}
                  borderWidth="1px"
                  borderRadius="lg"
                  padding={4}
                  cursor="pointer"
                  backgroundColor={
                    selectedPrescription === prescription
                      ? '#93B1A6'
                      : prescription.prescription.Submitted
                      ? '#C0C0C0'
                      : 'white'
                  }
                  onClick={() => handlePrescriptionClick(prescription)}
                  _hover={{ bg: '#93B1A6' }}
                  justifyContent='center'
                  
                >
                  <Heading fontSize="md" color="#5C8374">
                    {prescription
                      ? 'Dr. ' + prescription.doctor.Name
                      : 'No Doctor'}{' '}
                  </Heading>
                  <Text fontSize="sm" color="black">
                    {prescription
                      ? formatDateTime(prescription.prescription.DateP)
                      : 'No Date'}
                  </Text>
                  <Text fontSize="sm" color="black">
                    {prescription
                      ? prescription.prescription.Submitted
                        ? 'Submitted'
                        : 'Not Submitted'
                      : 'No Status'}
                  </Text>
                  <Text fontSize="sm" color="black">
                    {prescription
                      ? prescription.prescription.Filled
                        ? 'Filled'
                        : 'Not Filled'
                      : 'No Status'}
                  </Text>

                  <Flex spacing={3} mt={5}>
                    {prescription.prescription.Medicine &&
                      prescription.prescription.Medicine.map(
                        (medicine, index) => (
                          <ListItem
                            key={index}
                            borderWidth="1px"
                            borderRadius="lg"
                            padding={4}
                            cursor="pointer"
                            width="fit-content"
                           
                            backgroundColor={
                              selectedMedicine === medicine
                                ? '#93B1A6'
                                : '#f5f5f5'
                            }
                            onClick={() => handleMedicineClick(medicine)}
                            _hover={{ bg: '#93B1A6' }}
                          >
                            <Heading fontSize="md" color="#5C8374">
                              {medicine ? medicine.Name : 'No Name'}{' '}
                            </Heading>
                            <Text fontSize="sm" color="black">
                              {medicine ? medicine.Dosage : 'No Dosage'}
                            </Text>
                          </ListItem>
                        )
                      )}
                  </Flex>
                </ListItem>
              ))}
              </SimpleGrid>
            </List>
          </Box>
        )}
      </Box>

      </Flex>
    </Flex>
  );
};

export default Patient;
