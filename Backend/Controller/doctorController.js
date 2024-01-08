const Doctor = require("../Models/doctor");
const Patient = require("../Models/patient");
const Schedule = require("../Models/Schedule");
const employmentContract = require("../Models/employmentContract.js");
const Record = require("../Models/Record");
const Prescription = require("../Models/Prescription");
const Followup = require("../Models/Followup");
const { addSchedule } = require("./scheduleController.js");
const { default: mongoose } = require("mongoose");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const multer = require("multer");

const getDoctors = async (req, res) => {
  try {
    const allDoctors = await Doctor.find({ Accepted: "accepted" });
    res.status(200).json(allDoctors);
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve doctors" });
  }
};

const loginDoctor = async (req, res) => {
  const { Username, Password } = req.body;
  try {
    const doctor = await Doctor.findOne({ Username });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    if (doctor.Password !== Password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (doctor.Accepted !== "accepted") {
      return res.status(403).json({ error: "Doctor not accepted" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const addDoctor = async (req, res) => {
  //username, name, email, password, date of birth, hourly rate, affiliation (hospital), Specialty, educational background
  const {
    Username,
    Name,
    Email,
    Password,
    DateOfBirth,
    HourlyRate,
    Affiliation,
    Specialty,
    EducationalBackground,
  } = req.body;
  try {
    const doctor = await Doctor.create({
      Username,
      Name,
      Email,
      Password,
      DateOfBirth,
      HourlyRate,
      Affiliation,
      Specialty,
      EducationalBackground,
    });
    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateDoctor = async (req, res) => {
  const { Username } = req.query;
  const { Email, HourlyRate, Affiliation } = req.body;

  // Create an object to store the fields that need to be updated
  const updateFields = {};

  // Check each field and add it to the updateFields object if it is not null
  if (Email !== null && Email !== undefined && Email !== "") {
    updateFields.Email = Email;
  }

  if (HourlyRate !== null && HourlyRate !== undefined && HourlyRate !== "") {
    updateFields.HourlyRate = HourlyRate;
  }

  if (Affiliation !== null && Affiliation !== undefined && Affiliation !== "") {
    updateFields.Affiliation = Affiliation;
  }

  try {
    // Find and update the doctor based on the provided username
    const doctor = await Doctor.findOneAndUpdate(
      { Username },
      updateFields, // Use the updateFields object
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    return res.status(200).json(doctor);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


// get all patients of a doctor
const getMyPatients = async (req, res) => {
  const { Username } = req.query; // Retrieving data from the request body

  try {
    // Find the doctor by username
    const doctor = await Doctor.findOne({
      Username: Username,
      Accepted: "accepted",
    }).populate("patients");

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // You can now access patient information and records here
    res.status(200).json({ patients: doctor.patients });
  } catch (error) {
    console.error("Error fetching patient information:", error);
    res.status(500).json({ error: "Failed to retrieve patient information" });
  }
};


const getPatientByName = async (req, res) => {
  const { Username, Name } = req.query;
  try {
    const doctor = await Doctor.findOne({
      Username,
      Accepted: "accepted",
    }).populate("patients");

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const patients = doctor.patients;
    const patient = patients.find((patient) => patient.Name === Name);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.status(200).json({patient});
  } catch (error) {
    console.error("ERROR retrieving patient", error);
    res.status(400).json({ error: "Failed to retrieve patient" });
  }
};

const getPatientByUsername = async (req, res) => {
  const { Username } = req.query;
  try {
    const foundPatient = await Patient.findOne({
      Username,
    });

    if (!foundPatient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const populateFields = [];
    if (foundPatient.Package) populateFields.push("Package");
    if (foundPatient.records) populateFields.push("records");
    if (foundPatient.prescription) populateFields.push("prescription");

    const patient = await Patient.findOne({
      Username,
    }).populate(populateFields);
    

    res.status(200).json({ patient });
  } catch (error) {
    console.error("ERROR retrieving patient", error);
    res.status(400).json({ error: "Failed to retrieve patient" });
  }
};

const getUpcomingPatients = async (req, res) => {
  const { Username } = req.query;
  try {
    const doctor = await Doctor.findOne({
      Username,
      Accepted: "accepted",
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const schedules = await Schedule.find({ doctor: doctor._id, status: "Upcoming" }).populate("patient");

    // Use a set to keep track of unique patients based on Username
    const uniquePatientsSet = new Set();

    const uniquePatients = schedules.reduce((accumulator, schedule) => {
      const patient = schedule.patient;
      if (patient && !uniquePatientsSet.has(patient.Username)) {
        uniquePatientsSet.add(patient.Username);
        accumulator.push(patient);
      }
      return accumulator;
    }, []);

    res.status(200).json({ patients: uniquePatients });
  } catch (error) {
    console.error("Error fetching upcoming patients:", error);
    res.status(500).json({ error: "Failed to retrieve upcoming patients" });
  }
};


// get specific patient from doctor's list of patients by Username
const getPatientFromDoctorList = async (req, res) => {
  const { doctorUsername, patientUsername } = req.body;
  try {
    // Find the doctor by username
    const doctor = await Doctor.findOne({
      Username: doctorUsername,
      Accepted: "accepted",
    });

    // Find the patient by username
    const patient = await Patient.findOne({ Username: patientUsername });

    // Check if the patient is in the doctor's patients list
    if (!doctor.patients.includes(patient._id)) {
      return res
        .status(400)
        .json({ error: "Patient not found in doctor's list" });
    }

    // Return the patient
    res.status(200).json({ patient });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Failed to retrieve patient from doctor's list" });
  }
};

// filter doctor appointments by upcoming schedules
const filterPatientsByUpcomingAppointments = async (req, res) => {
  try {
    const { doctorUsername, date } = req.body;
    
    const doctor = await Doctor.findOne({
      Username: doctorUsername,
      Accepted: "accepted",
    });
    const schedules = await Schedule.find({ doctor: doctor._id });
    const filteredPatients = [];
    for (let i = 0; i < schedules.length; i++) {
      
      if (new Date(schedules[i].date) > new Date(date)) {
        
        filteredPatients.push(schedules[i].patient);
      }
    }
    res.status(200).json({ filteredPatients });
  } catch (error) {
    console.error("ERROR retrieving patients", error);
    res.status(400).json({ error: "Failed to retrieve patients" });
  }
};


// get my patients
const selectPatientFromList = async (req, res) => {
  const { Username } = req.query;
  try {
    // Find the doctor by username
    const doctor = await Doctor.findOne({
      Username: Username,
      Accepted: "accepted",
    }).populate("patients");

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // You can now access patient information and records here
    res.status(200).json({ patients: doctor.patients });
  } catch (error) {
    console.error("Error fetching patient information:", error);
    res.status(500).json({ error: "Failed to retrieve patient information" });
  }
};

// add patient to doctor
const addPatientToDoctor = async (req, res) => {
  const { doctorUsername, patientUsername } = req.body;
  try {
    // Find the doctor by username
    const doctor = await Doctor.findOne({
      Username: doctorUsername,
      Accepted: "accepted",
    });

    // Find the patient by username
    const patient = await Patient.findOne({ Username: patientUsername });
    // Add the patient to the doctor's patients array
    doctor.patients.push(patient._id);
    // Save the doctor
    await doctor.save();

    // You can now access patient information and records here
    res.status(200).json({ patient });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to add patient to doctor" });
  }
};

const viewContract = async (req, res) => {
  try {
    const { Username } = req.query;

    // Find the contract for the given doctor ID
   
    const doctor = await Doctor.findOne({ Username});
    
    const contract = await employmentContract.find({ Doctor: doctor});
    
    if (!contract) {
      return res
        .status(404)
        .json({ error: "Contract not found for this doctor" });
    }

    res.status(200).json({ contract });
  } catch (error) {
    console.error("Error retrieving contract:", error);
    res.status(500).json({ error: "Failed to retrieve contract" });
  }
};

const acceptContract = async (req, res) => {
  try {
    const { Username } = req.query;

    const doctor = await Doctor.findOne({ Username: Username });

    const contract = await employmentContract.findOneAndUpdate(
      { Doctor: doctor },
      { Accepted: true }
    );
    console.log(contract.Accepted);
    res.status(200).json({ contract });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

const addTimeSlots = async (req, res) => {
  const { Username } = req.query;
  const { timeSlots } = req.body;

  try {
    // Check if the doctor exists and has an accepted employment contract
    const doctor = await Doctor.findOne({
      Username: Username,
      Accepted: "accepted",
    });

    if (!doctor) {
      return res
        .status(404)
        .json({ error: "Doctor not found or not accepted" });
    }

    // Check if the doctor has an accepted employment contract
    const contract = await employmentContract.findOne({
      Doctor: doctor,
      Accepted: true,
    });

    if (!contract) {
      return res.status(403).json({
        error: "Doctor does not have an accepted employment contract",
      });
    }

    // Add 2 hours to each time slot
    const updatedTimeSlots = timeSlots.map((slot) => {
      const newSlot = new Date(slot);
      newSlot.setHours(newSlot.getHours() + 2);
      return newSlot;
    });

    // Update the time slots for the doctor
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { Username: Username },
      { TimeSlots: updatedTimeSlots },
      { new: true }
    );

    res.status(200).json({
      doctor: updatedDoctor,
      message: "Time slots added successfully",
    });
  } catch (err) {
    console.error("Error adding time slots:", err);
    res.status(500).json({ error: "Failed to add time slots" });
  }
};

const getTimeSlots = async (req, res) => {
  try {
    const { Username } = req.query;

    // Find the doctor by username
    const doctor = await Doctor.findOne({
      Username: Username,
      Accepted: "accepted",
    });

    if (!doctor) {
      return res
        .status(404)
        .json({ error: "Doctor not found or not accepted" });
    }

    // Subtract 2 hours from each time slot
    const updatedTimeSlots = doctor.TimeSlots.map((timeSlot) => {
      const updatedTime = new Date(timeSlot.getTime());
      updatedTime.setHours(updatedTime.getHours() - 2);
      return updatedTime;
    });

    // Return the updated time slots
    res.status(200).json({ timeSlots: updatedTimeSlots });
  } catch (error) {
    console.error("Error fetching time slots:", error);
    res.status(500).json({ error: "Failed to retrieve time slots" });
  }
};

const scheduleFollowup = async (req, res) => {
  try {
    const { Username } = req.query;
    const { patientUsername, dateFrom } = req.body;
    // Extract required information from the request body

    const doctor = await Doctor.findOne({ Username });
    if (!doctor) {
      return res.status(400).json({ error: "Doctor not found" });
    }

    const patient = await Patient.findOne({ Username: patientUsername });
    if (!patient) {
      return res.status(400).json({ error: "Patient not found" });
    }

    // Call addSchedule to schedule the follow-up
    const followupSchedule = await addSchedule(req, res);

    if(!doctor.patients.includes(patient._id)){
      doctor.patients.push(patient._id);
      await doctor.save();
    }

    let config = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    };

    let transporter = nodemailer.createTransport(config);

    // Email to doctor
    let doctorMailGenerator = new Mailgen({
      theme: "salted",
      product: {
        name: "El7a2ny Clinic",
        link: "http://localhost:3000/",
        logo: "https://i.ibb.co/2kDDTxv/logo.png",
      },
    });

    let doctorResponse = {
      body: {
        name: doctor.Name,
        intro: "Your appointment has been scheduled successfully with your patient " + patient.Name + ". Please go back to the patient's appointment page to see the details.",
        outro: "Thank you for using our service!",
      },
    };

    let doctorMail = doctorMailGenerator.generate(doctorResponse);

    let doctorMessage = {
      from: "El7a2ny Clinic",
      to: doctor.Email,
      subject: "Followup ",
      html: doctorMail,
    };

    // Email to patient
    let patientMailGenerator = new Mailgen({
      theme: "salted",
      product: {
        name: "El7a2ny Clinic",
        link: "http://localhost:3000/",
        logo: "https://i.ibb.co/2kDDTxv/logo.png",
      },
    });

    let patientResponse = {
      body: {
        name: patient.Name,
        intro: "Your appointment has been scheduled successfully with your doctor " + doctor.Name + ". Please check your appointment details at the Appointment page.",
        outro: "Thank you for using our service!",
      },
    };

    let patientMail = patientMailGenerator.generate(patientResponse);

    let patientMessage = {
      from: "El7a2ny Clinic",
      to: patient.Email,
      subject: "Followup ",
      html: patientMail,
    };

    // Send emails
    transporter.sendMail(doctorMessage, (doctorErr) => {
      if (doctorErr) {
        return res.status(500).json({ error: doctorErr.message });
      }

      transporter.sendMail(patientMessage, (patientErr) => {
        if (patientErr) {
          return res.status(500).json({ error: patientErr.message });
        }

        res.status(201).json({ message: "Emails sent successfully" });
      });
    });
    
    res.status(201).json(followupSchedule);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to schedule follow-up" });
  }
};

const getScheduleOfDoctor = async (req, res) => {
  try {
    const { Username } = req.query;

    // Find the doctor by username
    const doctor = await Doctor.findOne({
      Username: Username,
      Accepted: "accepted",
    });

    if (!doctor) {
      return res
        .status(404)
        .json({ error: "Doctor not found or not accepted" });
    }

    // Find the schedules for the given doctor
    const schedules = await Schedule.find({ doctor: doctor._id }).populate("patient");
    
    // Subtract 2 hours from each dateFrom and dateTo
    const updatedSchedules = schedules.map((schedule) => {
      const updatedSchedule = schedule;
      return updatedSchedule;
    });

    
    res.status(200).json({ updatedSchedules });
  } catch (error) {
    console.error("Error fetching doctor schedules:", error);
    res.status(500).json({ error: "Failed to retrieve doctor schedules" });
  }
};

const getFollowups = async (req, res) => {
  try{
    const {Username} = req.query;

     const doctor = await Doctor.findOne({ Username });
    if (!doctor) {
      return res.status(400).json({ error: "Doctor not found" });
    }

    const followups = await Followup.find({ doctor, status:"Pending" }).populate("patient");
    res.status(201).json({followups});
    
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to get follow-ups" });
  }
}

const filterAppointments = async (req, res) => {
  try {
    const { Username } = req.query;
    const { status } = req.query;

    // Find the doctor by username
    const doctor = await Doctor.findOne({
      Username: Username,
      Accepted: "accepted",
    });

    if (!doctor) {
      return res
        .status(404)
        .json({ error: "Doctor not found or not accepted" });
    }

    // Find the schedules for the given doctor and filter by status
    const schedules = await Schedule.find({ doctor: doctor._id, status }).populate("patient");
    
    // Subtract 2 hours from each dateFrom and dateTo
    const updatedSchedules = schedules.map((schedule) => {
      const updatedSchedule = schedule;
      return updatedSchedule;
    });
    
    res.status(200).json({ updatedSchedules });
  } catch (error) {
    console.error("Error fetching doctor schedules:", error);
    res.status(500).json({ error: "Failed to retrieve doctor schedules" });
  }
};

const searchAppointments = async (req, res) => {
  try {
    const { Username } = req.query;
    const { patientName } = req.query;

    // Find the doctor by username
    const doctor = await Doctor.findOne({
      Username: Username,
      Accepted: "accepted",
    });

    if (!doctor) {
      return res
        .status(404)
        .json({ error: "Doctor not found or not accepted" });
    }

    const patient = await Patient.findOne({ Name : patientName })
    
    if (!patient) {
      return res
        .status(404)
        .json({ error: "Patient not found" });
    }

    // Find the schedules for the given doctor and filter by status
    const schedules = await Schedule.find({ doctor: doctor._id, patient: patient._id }).populate("patient");
    
    // Subtract 2 hours from each dateFrom and dateTo
    const updatedSchedules = schedules.map((schedule) => {
      const updatedSchedule = schedule;
      return updatedSchedule;
    });
    
    res.status(200).json({ updatedSchedules });
  } catch (error) {
    console.error("Error fetching doctor schedules:", error);
    res.status(500).json({ error: "Failed to retrieve doctor schedules" });
  }
};


const addRecords = async (req, res) => {
  try {
    const { Username } = req.query;
    const { patientUsername, description } = req.body;

    // Check if the provided doctorId and patientId exist
    const doctor = await Doctor.findOne({ Username });
    if (!doctor) {
      return res.status(400).json({ error: "Doctor not found" });
    }

    const patient = await Patient.findOne({ Username: patientUsername });
    if (!patient) {
      return res.status(400).json({ error: "Patient not found" });
    }

    // Create a new record
    const newRecord = await Record.create({
      Description: description,
      DoctorUsername: doctor.Username,
      PatientUsername: patient.Username,
    });

    // Add the record to the patient's records array
    patient.records.push(newRecord._id);
    await patient.save();

    // You can also add the record to the doctor's records array if needed
    // doctor.records.push(newRecord._id);
    // await doctor.save();

    res
      .status(201)
      .json({ record: newRecord, message: "Record added successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to add record" });
  }
};

const getRecords = async (req, res) => {
  try {
    const { Username } = req.query;

    // Find the doctor by username
    const doctor = await Doctor.findOne({
      Username: Username,
      Accepted: "accepted",
    });

    if (!doctor) {
      return res
        .status(404)
        .json({ error: "Doctor not found or not accepted" });
    }

    // Find the records for the given doctor
    const records = await Record.find({ DoctorUsername: doctor.Username });

    res.status(200).json({ records });
  } catch (error) {
    console.error("Error fetching doctor records:", error);
    res.status(500).json({ error: "Failed to retrieve doctor records" });
  }
};

const rescheduleApp = async (req, res) => {
  try {
    // Extract required information from the request body
    const { Username } = req.query;
    const { patientUsername, dateFrom, newDate } = req.body;

    const doctor = await Doctor.findOne({ Username });
    if (!doctor) {
      return res.status(400).json({ error: "Doctor not found" });
    }
    const patient = await Patient.findOne({ Username: patientUsername });
    if (!patient) {
      return res.status(400).json({ error: "Patient not found" });
    }
    const newDateFrom = new Date(dateFrom);

    const schedule = await Schedule.findOneAndUpdate({
      doctor,
      patient,
      dateFrom: newDateFrom,
    },
    {status: "Rescheduled"},
    {new: true}
    );
    
    const newSchedule = await addSchedule({
      query: { Username },
      body: { patientUsername, dateFrom: newDate },
    });

    let config = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    };

    let transporter = nodemailer.createTransport(config);

    // Email to doctor
    let doctorMailGenerator = new Mailgen({
      theme: "salted",
      product: {
        name: "El7a2ny Clinic",
        link: "http://localhost:3000/",
        logo: "https://i.ibb.co/2kDDTxv/logo.png",
      },
    });

    let doctorResponse = {
      body: {
        name: doctor.Name,
        intro: "Your appointment has been rescheduled successfully with your patient " + patient.Name + ". Please go back to the patient's appointment page to see the details.",
        outro: "Thank you for using our service!",
      },
    };

    let doctorMail = doctorMailGenerator.generate(doctorResponse);

    let doctorMessage = {
      from: "El7a2ny Clinic",
      to: doctor.Email,
      subject: "Followup ",
      html: doctorMail,
    };

    // Email to patient
    let patientMailGenerator = new Mailgen({
      theme: "salted",
      product: {
        name: "El7a2ny Clinic",
        link: "http://localhost:3000/",
        logo: "https://i.ibb.co/2kDDTxv/logo.png",
      },
    });

    let patientResponse = {
      body: {
        name: patient.Name,
        intro: "Your appointment has been rescheduled successfully with your doctor " + doctor.Name + ". Please check your appointment details at the Appointment page.",
        outro: "Thank you for using our service!",
      },
    };

    let patientMail = patientMailGenerator.generate(patientResponse);

    let patientMessage = {
      from: "El7a2ny Clinic",
      to: patient.Email,
      subject: "Followup ",
      html: patientMail,
    };

    // Send emails
    transporter.sendMail(doctorMessage, (doctorErr) => {
      if (doctorErr) {
        return res.status(500).json({ error: doctorErr.message });
      }

      transporter.sendMail(patientMessage, (patientErr) => {
        if (patientErr) {
          return res.status(500).json({ error: patientErr.message });
        }

        res.status(201).json({ message: "Emails sent successfully" });
      });
    });

    res.status(201).json(schedule);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to schedule follow-up" });
  }
};

const addMedicine = async (req, res) => {
  try {
    const { Username } = req.query;
    const { patientUsername, DateP, medicine, dosage } = req.body;

    const doctor = await Doctor.findOne({ Username });
    if (!doctor) {
      return res.status(400).json({ error: "Doctor not found" });
    }

    const patient = await Patient.findOne({ Username: patientUsername }).populate("prescription");
    if (!patient) {
      return res.status(400).json({ error: "Patient not found" });
    }
    
    const presc = patient.prescription;
    


    var id =0;
    const newDate = new Date(DateP);

    
    // look for prescription in patient's prescription array and update it
    for (let i = 0; i < presc.length; i++) {
      
      
      
      if (presc[i].DateP && presc[i].DateP.getTime() === newDate.getTime() ) {
        id = presc[i]._id;
        
      }
    }

    if(id === 0){
       return res.status(400).json({error: "Prescription not found"})
    }
  
    const prescription = await Prescription.findOneAndUpdate(
      { _id: id },
      { $push: { Medicine: { Name: medicine, Dosage: dosage } }, Filled: false },
      { new: true }
    );

    if (!prescription) {
      return res.status(400).json({ error: "Prescription not found" });
    }

    res.status(201).json(prescription);

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to add medicine" });
  }
};

const deleteMedicine = async (req, res) => {
  try {
    const { Username } = req.query;
    const { patientUsername, DateP, medicine } = req.body;

    const doctor = await Doctor.findOne({ Username });
    if (!doctor) {
      return res.status(400).json({ error: "Doctor not found" });
    }

    const patient = await Patient.findOne({ Username: patientUsername }).populate("prescription");
    if (!patient) {
      return res.status(400).json({ error: "Patient not found" });
    }

    const prescriptions = patient.prescription;

    const newDate = new Date(DateP);
    

    // Find the prescription to update
    let prescriptionToUpdate = prescriptions.find(
      (presc) =>
        presc.DateP &&
        presc.DateP.getTime() === newDate.getTime() 
        
    );

    if (!prescriptionToUpdate) {
      return res.status(400).json({ error: "Prescription not found" });
    }

    // Remove medicine from the prescription
    prescriptionToUpdate.Medicine = prescriptionToUpdate.Medicine.filter(
      (med) => med.Name !== medicine
    );

    // Save the changes to the patient
    await patient.save();

    // Update the prescription in the database
    const updatedPrescription = await Prescription.findOneAndUpdate(
      {
        _id: prescriptionToUpdate._id, // Assuming _id is the unique identifier for Prescription
      },
      {
        Medicine: prescriptionToUpdate.Medicine,
      },
      { new: true } // To get the updated document
    );

    // Respond with the updated prescription
    res.status(200).json(updatedPrescription);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to delete medicine" });
  }
};

const updateDosage = async (req, res) => {
  try {
    const { Username } = req.query;
    const { patientUsername, DateP, medicine, dosage } = req.body;

    const doctor = await Doctor.findOne({ Username });
    if (!doctor) {
      return res.status(400).json({ error: "Doctor not found" });
    }

    const patient = await Patient.findOne({ Username: patientUsername }).populate("prescription");
    if (!patient) {
      return res.status(400).json({ error: "Patient not found" });
    }

    const prescriptions = patient.prescription;

    const newDate = new Date(DateP);
    

    // Find the prescription to update
    let prescriptionToUpdate = prescriptions.find(
      (presc) =>
        presc.DateP &&
        presc.DateP.getTime() === newDate.getTime() 
        
    );

    if (!prescriptionToUpdate) {
      return res.status(400).json({ error: "Prescription not found" });
    }

    // Find the index of the medicine to update
    const medicineIndex = prescriptionToUpdate.Medicine.findIndex(
      (med) => med.Name === medicine
    );

    if (medicineIndex === -1) {
      return res.status(400).json({ error: "Medicine not found in the prescription" });
    }

    // Update the dosage for the specified medicine
    prescriptionToUpdate.Medicine[medicineIndex].Dosage = dosage;

    // Save the changes to the patient
    await patient.save();

    // Update the prescription in the database
    const updatedPrescription = await Prescription.findOneAndUpdate(
      {
        _id: prescriptionToUpdate._id, // Assuming _id is the unique identifier for Prescription
      },
      {
        Medicine: prescriptionToUpdate.Medicine,
      },
      { new: true } // To get the updated document
    );

    // Respond with the updated prescription
    res.status(200).json(updatedPrescription);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to update dosage" });
  }
};

const submitToPharmacy = async (req, res) => {
  try {
    const { Username } = req.query;
    const { patientUsername, DateP } = req.body;

    const doctor = await Doctor.findOne({Username});
    if(!doctor){
      return res.status(400).json({error: "Doctor not found"});
    }
    const patient = await Patient.findOne({Username: patientUsername});
    if(!patient){
      return res.status(400).json({error: "Patient not found"});
    }
    
    
    

    const prescription = await Prescription.findOneAndUpdate({
      DateP: new Date(DateP),
      PatientUsername: patient.Username,
    }, {Submitted: true}, {new: true});
    
    
    

    res.status(201).json(prescription);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to submit prescription to pharmacy" });
  }
}
 
const addPrescription = async (req, res) => {
  try{
    const {Username, patientUsername} = req.query;
    const {Medicine} = req.body;

    const doctor = await Doctor.findOne({Username});
    if(!doctor){
      return res.status(400).json({error: "Doctor not found"});
    }

    const patient = await Patient.findOne({Username: patientUsername});
    if(!patient){
      return res.status(400).json({error: "Patient not found"});
    }

    const prescription = await Prescription.create({
      DoctorUsername: doctor.Username,
      PatientUsername: patient.Username,
      DateP: new Date(),
      Medicine: Medicine,
    });

    patient.prescription.push(prescription._id);
    await patient.save();

    res.status(201).json(prescription);

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to add prescription to patient" });
  }
}

const updateBeforeSubmit = async (req, res) => {
  try {
    const { Username } = req.query;
    const { patientUsername, DateP, addMedicine, updateMedicine, deleteMedicine } = req.body;

    const doctor = await Doctor.findOne({ Username });
    if (!doctor) {
      return res.status(400).json({ error: "Doctor not found" });
    }

    const patient = await Patient.findOne({ Username: patientUsername }).populate("prescription");
    if (!patient) {
      return res.status(400).json({ error: "Patient not found" });
    }

    const prescriptions = patient.prescription;

    const newDate = new Date(DateP);
    newDate.setHours(newDate.getHours() + 2);

    // Find the prescription to update
    let prescriptionToUpdate = prescriptions.find(
      (presc) =>
        presc.DateP &&
        presc.DateP.getTime() === newDate.getTime() &&
        presc.DoctorUsername === Username
    );

    if (!prescriptionToUpdate) {
      return res.status(400).json({ error: "Prescription not found" });
    }

    // Update medicines
    if (updateMedicine && updateMedicine.length > 0) {
      updateMedicine.forEach(async (updateInfo) => {
        const { Name, Dosage } = updateInfo;

        const medicineIndex = prescriptionToUpdate.Medicine.findIndex(
          (med) => med.Name === Name
        );

        if (medicineIndex !== -1) {
          prescriptionToUpdate.Medicine[medicineIndex].Dosage = Dosage;
        }
      });
    }

    // Add medicines
    if (addMedicine && addMedicine.length > 0) {
      addMedicine.forEach(async (addInfo) => {
        const { Name, Dosage } = addInfo;
        prescriptionToUpdate.Medicine.push({ Name, Dosage});
      });
    }

    // Delete medicines
    if (deleteMedicine && deleteMedicine.length > 0) {
      deleteMedicine.forEach(async (deleteInfo) => {
        const { Name } = deleteInfo;
        prescriptionToUpdate.Medicine = prescriptionToUpdate.Medicine.filter(
          (med) => med.Name !== Name
        );
      });
    }

    // Save the changes to the patient
    await patient.save();

    // Update the prescription in the database
    const updatedPrescription = await Prescription.findOneAndUpdate(
      {
        _id: prescriptionToUpdate._id, // Assuming _id is the unique identifier for Prescription
      },
      {
        Medicine: prescriptionToUpdate.Medicine,
      },
      { new: true } // To get the updated document
    );

    // Respond with the updated prescription
    res.status(200).json(updatedPrescription);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to update prescription" });
  }
};





const acceptFollowup = async (req, res) => {
  try {
    const { Username } = req.query;
    const { patientUsername, dateFrom } = req.body;

    const doctor = await Doctor.findOne({ Username });
    if (!doctor) {
      return res.status(400).json({ error: "Doctor not found" });
    }

    const patient = await Patient.findOne({ Username: patientUsername });
    if (!patient) {
      return res.status(400).json({ error: "Patient not found" });
    }

    const newDateFrom = new Date(dateFrom);
    //newDateFrom.setHours(newDateFrom.getHours() + 2);

   
    const followup = await Followup.findOneAndUpdate(
      {
        doctor,
        patient,
        dateFrom: newDateFrom,
      },
      { status: "Accepted" },
      { new: true }
    );

    

    const followupSchedule = await addSchedule(req, res);

    
    if(!doctor.patients.includes(patient._id)){
      doctor.patients.push(patient._id);
      await doctor.save();
    }


    res.status(201).json(followup);

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to accept follow-up" });
  }
};

const rejectFollowup = async (req, res) => {
  try {
    const { Username } = req.query;
    const { patientUsername, dateFrom } = req.body;


    const doctor = await Doctor.findOne({ Username });
    if (!doctor) {
      return res.status(400).json({ error: "Doctor not found" });
    }
    
    const patient = await Patient.findOne({ Username: patientUsername });
    if (!patient) {
      return res.status(400).json({ error: "Patient not found" });
    }

    const newDateFrom = new Date(dateFrom);
    // newDateFrom.setHours(newDateFrom.getHours() + 2);

    const followup = await Followup.findOneAndUpdate(
      {
        doctor,
        patient,
        dateFrom: newDateFrom,
      },
      { status: "Rejected" },
      { new: true }
    );



    res.status(201).json(followup);

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to accept follow-up" });
  }
};


const getDocuments = async (req, res) => {
  try {
    // Assuming req.query.username contains the patient's username
    const username = req.query.username;

    // Set the path to the MedicalHistory folder
    const DoctorDetailsFolder = path.join(
      "../frontend/public/Documents/DoctorDetails",
      username
    );

    // Read the files in the folder asynchronously
    const files = await fs.promises.readdir(DoctorDetailsFolder);

    // Construct an array of document objects with file names
    const documents = files.map((filename) => ({
      filename,
      path: path.join(DoctorDetailsFolder, filename),
    }));

    res.json({ documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const removeDocuments = async (req, res) => {
  try {
    const { username, filename } = req.query;

    // Validate username and filename
    if (!username || !filename) {
      return res
        .status(400)
        .json({ error: "Username and filename are required." });
    }

    // Set the path to the specific user's folder
    const userFolder = path.join(
      "../frontend/public/Documents/DoctorDetails",
      username
    );

    // Check if the file exists
    const filePath = path.join(userFolder, filename);

    try {
      // Check if the file exists using fs.promises.access
      await fs.promises.access(filePath);

      // Remove the file
      await fs.promises.unlink(filePath);

      // Update your database if needed (e.g., remove the file record)
      // Example using Mongoose:
      // await MedicalRecord.findOneAndRemove({ username, filename });

      res.json({ success: true, message: "File removed successfully." });
    } catch (error) {
      // Handle file not found
      if (error.code === "ENOENT") {
        return res.status(404).json({ error: "File not found." });
      }

      // Rethrow other errors
      throw error;
    }
  } catch (error) {
    console.error("Error removing file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getDoctorSchedule = async (req, res) => {
  const { Username } = req.query;

  try {
    // Find the doctor by username
    const doctor = await Doctor.findOne({ Username: Username });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Fetch all schedules for the found doctor
    const schedules = await Schedule.find({ doctor: doctor._id });

    if (schedules.length === 0) {
      return res
        .status(404)
        .json({ error: "No schedules found for this doctor" });
    }

    // Return the schedules associated with the doctor
    res.status(200).json({ schedules });
  } catch (error) {
    console.error("Error getting schedules", error);
    res.status(500).json({ error: "Failed to get schedules" });
  }
};

const getDoctorDetailsID = async (req, res) => {
  const { _id } = req.query;

  try {
    const doctor = await Doctor.findById(_id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.status(200).json(doctor.Username);
  } catch (error) {
    res.status(500).json({ error: "Error fetching doctor details" });
  }
};

const cancelApp = async (req, res) => {
  
  try{
    const{ id } = req.query;
    
    const app = await Schedule.findById(id);  
    app.status = "Cancelled";
    await app.save();
    res.status(200).json({app});


  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to cancel appointment" });
  }
}

const getDoctorDetails = async (req, res) => {
  const { Username } = req.query;
  try {
    const doctor = await Doctor.findOne({ Username });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    if (doctor.TimeSlots) {
      doctor.TimeSlots = doctor.TimeSlots.map(slot => {
        const updatedSlot = new Date(slot);
        updatedSlot.setHours(updatedSlot.getHours() - 2);
        return updatedSlot.toISOString(); // Convert to ISO string
      });

      res.status(200).json(doctor);
    } else {
      res.status(200).json(doctor);
    }
  } catch (error) {
    res.status(400).json({ error: "Error fetching doctor details" });
  }
};


const getDoctorRecords = async (req, res) => {
  const { Username } = req.query;

  try {
    const records = await Record.find({ DoctorUsername: Username });

    if (!records || records.length === 0) {
      return res.status(404).json({ error: 'No records found for this doctor' });
    }

    res.status(200).json(records);
  } catch (error) {
    console.error("ERROR getting doctor records", error);
    res.status(500).json({ error: "Failed to get doctor records" });
  }
};

const getDoctorWallet = async (req, res) => {
  const { Username } = req.query;
  try {
    const exist = await Doctor.findOne({ Username });
    if (!exist) {
      return res.status(404).json({ error: "No doctor found" });
    }
    res.status(200).json(exist.Wallet);
  } catch (error) {
    console.error("Error getting wallet", error);
    res.status(500).json({ error: "Failed to get wallet" });
  }
};

const viewDoctorPrescription = async (req, res) => {
  const { Username } = req.query;
  try {
    const prescriptions = await Prescription.find({ DoctorUsername: Username });
    if(!prescriptions || prescriptions.length===0){
      return res.status(404).json({ error: "No prescription found under the name of the doctor" })
    }
    res.status(200).json(prescriptions);
  } catch(error){
    console.error("Error viewing prescription", error);
    res.status(500).json({ error: "Failed to view prescription"});
  }
};
// get docs
const getDocs = async (req, res) => {
  const { Username } = req.query;

  try {
    const doctor = await Doctor.findOne({ Username });
    const docs = doctor.Docs;

    res.status(200).json({ docs });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};
const uploadDoc = async (req, res) => {
  const { Username } = req.query;
  const file = req.file;

  console.log(req.file);

  try {
    const user = await Doctor.findOne({ Username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Push the filename to the Docs array in the user document
    if (!user.Docs.includes(file.filename)) {
      user.Docs.push(file.filename);
    }
    await user.save();

    res.status(200).json({
      message: "Document uploaded successfully",
      filename: file.filename,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateDoctor,
  getDoctors,
  addDoctor,
  getMyPatients,
  getPatientByName,
  getPatientByUsername,
  filterPatientsByUpcomingAppointments,
  selectPatientFromList,
  addPatientToDoctor,
  getPatientFromDoctorList,
  loginDoctor,
  viewContract,
  acceptContract,
  addTimeSlots,
  scheduleFollowup,
  addRecords,
  getRecords,
  getTimeSlots,
  getScheduleOfDoctor,
  rescheduleApp,
  addMedicine,
  deleteMedicine,
  updateDosage,
  addPrescription,
  updateBeforeSubmit,
  submitToPharmacy,
  getFollowups,
  acceptFollowup,
  rejectFollowup,
  getDocuments,
  removeDocuments,
  getDoctorSchedule,
  getDoctorDetails,
  getDoctorDetailsID,
  getDoctorRecords,
  getDoctorWallet,
  viewDoctorPrescription,
  filterAppointments,
  searchAppointments,
  getUpcomingPatients,
  cancelApp,
  getDocs,
  uploadDoc,
};
