const Chat = require("../Models/chat");
const Doctor = require("../Models/doctor");
const Patient = require("../Models/patient");
const { default: mongoose } = require("mongoose");

//get chat between patient and doctor if patient and doctor username are passed in the request body
const getChat = async (req, res) => {
  try {
    const { PatientUsername, DoctorUsername } = req.query;
    //check the patient and doctor exist
    const patient = await Patient.findOne({ Username: PatientUsername });
    const doctor = await Doctor.findOne({
      Username: DoctorUsername,
    });
    if (!patient || !doctor) {
      return res
        .status(404)
        .json({ message: "Patient or Doctor not found" });
    }
    //check if the chat already exists
    const chat = await Chat.findOne({
      Patient: PatientUsername,
      Doctor: DoctorUsername,
    });
    if (chat) {
      return res.status(200).json({ chat: chat.Messages });
    }
    const newChat = await Chat.create({
      Patient: PatientUsername,
      Doctor: DoctorUsername,
    });
    return res.status(200).json({ chat: newChat.Messages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//create a new chat if doesn't exist between patient and doctor if patient and doctor username and the message are passed in the request body
const sendPatientChat = async (req, res) => {
  try {
    const { PatientUsername, DoctorUsername, Message } = req.query;
    //check the patient and doctor exist
    const patient = await Patient.findOne({ Username: PatientUsername });
    const doctor = await Doctor.findOne({
      Username: DoctorUsername,
    });
    if (!patient || !doctor) {
      return res
        .status(404)
        .json({ message: "Patient or Doctor not found" });
    }
    //check if the chat already exists add the message to the chat
    const chat = await Chat.findOne({
      Patient: PatientUsername,
      Doctor: DoctorUsername,
    });
    if (chat) {
      chat.Messages.push({
        Sender: PatientUsername,
        Message: Message,
        Time: Date.now(),
      });
      await chat.save();
      return res.status(200).json({ chat: chat.Messages });
    }
    //create a new chat
    const newChat = await Chat.create({
      Patient: PatientUsername,
      Doctor: DoctorUsername,
      Messages: [
        {
          Sender: PatientUsername,
          Message: Message,
          Time: Date.now(),
        },
      ],
    });
    return res.status(200).json({ chat: newChat.Messages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//create a new chat if doesn't exist between patient and doctor if patient and doctor username and the message are passed in the request body
const sendDoctorChat = async (req, res) => {
  try {
    const { PatientUsername, DoctorUsername, Message } = req.query;
    //check the patient and doctor exist
    const patient = await Patient.findOne({ Username: PatientUsername });
    const doctor = await Doctor.findOne({
      Username: DoctorUsername,
    });
    if (!patient || !doctor) {
      return res
        .status(404)
        .json({ message: "Patient or Doctor not found" });
    }
    //check if the chat already exists add the message to the chat
    const chat = await Chat.findOne({
      Patient: PatientUsername,
      Doctor: DoctorUsername,
    });
    if (chat) {
      chat.Messages.push({
        Sender: DoctorUsername,
        Message: Message,
        Time: Date.now(),
      });
      await chat.save();
      return res.status(200).json({ chat: chat.Messages });
    }
    //create a new chat
    const newChat = await Chat.create({
      Patient: PatientUsername,
      doctor: DoctorUsername,
      Messages: [
        {
          Sender: DoctorUsername,
          Message: Message,
          Time: Date.now(),
        },
      ],
    });
    return res.status(200).json({ chat: newChat.Messages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



// Exporting modules
module.exports = {
  getChat,
  sendPatientChat,
  sendDoctorChat,
};
