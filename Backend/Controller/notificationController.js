const express = require("express");
const router = express.Router();
const Notification = require("../Models/Notification.js");
const Patient = require("../Models/patient");
const Doctor = require("../Models/doctor");

// Assuming you have a route like '/createNotification'
const createNotification = async (req, res) =>  {
    try {
      const { patientUsername, doctorUsername, message } = req.body;
  
      // Check if either patientUsername or doctorUsername is provided
      if (!patientUsername && !doctorUsername) {
        return res.status(400).json({ error: "Please provide either PatientUsername or DoctorUsername." });
      }
  
      if (patientUsername) {
        // If PatientUsername is provided, create a notification for the patient
        const patient = await Patient.findOne({ Username: patientUsername });
  
        if (patient) {
          const doc = '';
          const rel = {
            PatientUsername: patientUsername,
            DoctorUsername: doc,
            Message: message,
          };
          await Notification.create(rel);
          return res.status(201).json({ message: "Notification created successfully." });
        }
      } else {
        // If DoctorUsername is provided, create a notification for the doctor
        const doctor = await Doctor.findOne({ Username: doctorUsername });
  
        if (doctor) {
          const doc = '';
          const rel = {
            PatientUsername: doc,
            DoctorUsername: doctorUsername,
            Message: message,
          };
          await Notification.create(rel);
        
          return res.status(201).json({ message: "Notification created successfully." });
        }
      }
  
      return res.status(404).json({ error: "Patient or doctor not found." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

const createMail = async (req, res) =>  {
    try {
      const { patientEmail, doctorEmail, message } = req.body;
  
      // Check if either patientUsername or doctorUsername is provided
      if (!patientEmail && !doctorEmail) {
        return res.status(400).json({ error: "Please provide either patientEmail or doctorEmail." });
      }
  
      if (patientEmail) {
        // If PatientUsername is provided, create a notification for the patient
        const patient = await Patient.findOne({ Email: patientEmail });
  
        if (patient) {
          const doc = '';
          const rel = {
            PatientMail: patientMail,
            DoctorMail: doc,
            Message: message,
          };
          await Notification.create(rel);
          return res.status(201).json({ message: "Mail sent successfully." });
        }
      } else {
        // If DoctorUsername is provided, create a notification for the doctor
        const doctor = await Doctor.findOne({ Email: doctorEmail });
  
        if (doctor) {
          const doc = '';
          const rel = {
            PatientMail: doc,
            DoctorMail: doctorMail,
            Message: message,
          };
          await Notification.create(rel);
        
          return res.status(201).json({ message: "Mail sent successfully." });
        }
      }
  
      return res.status(404).json({ error: "Patient or doctor not found." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  

const getNotifications = async (req, res) => {
  try {
    const { patientUsername, doctorUsername } = req.query;
    let notifications;

    if (patientUsername) {
      const patient = await Patient.findOne({ Username: patientUsername });
      if (!patient) {
        return res.status(404).json({ error: "Patient not found." });
      }
      notifications = await Notification.find({ PatientUsername: patientUsername });
    } else if(doctorUsername) {
      const doctor = await Doctor.findOne({ Username: doctorUsername });
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found." });
      }
      notifications = await Notification.find({ DoctorUsername: doctorUsername });
    }
    else{
      notifications = await Notification.find();
    }
    return res.status(200).json({ notifications });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
    createNotification,
    getNotifications,
};