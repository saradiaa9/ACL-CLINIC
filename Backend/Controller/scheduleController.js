const Schedule = require("../Models/Schedule");
const Doctor = require("../Models/doctor");
const Patient = require("../Models/patient");

const { default: mongoose } = require("mongoose");

// get all schedules
const getSchedules = async (req, res) => {
  try {
    const allSchedules = await Schedule.find();
    res.status(200).json(allSchedules);
  } catch (error) {
    res.status(400).json({ error: "Failed to retrieve schedules" });
  }
};

// add a schedule
const addSchedule = async (req, res) => {
  try {
    const { Username } = req.query;
    const { patientUsername, dateFrom } = req.body;

    // Check if the provided doctorId and patientId exist
    const doctorExists = await Doctor.findOne({ Username});

    if (!doctorExists) {
      return res.status(400).json({ error: "Doctor not found" });
    }


    const newDate = new Date(dateFrom);
    newDate.setHours(newDate.getHours() + 2);

    
    const existingAppointment = await Schedule.findOne({
      doctor: doctorExists,
      dateFrom: { $lte: newDate },
      dateTo: { $gt: newDate },
    });
    //console.log(existingAppointment);

    if (existingAppointment) {
      //return res.status(400).json({ error: "Doctor has an appointment at this time" });
      return;
    }
    // You might want to add a similar check for patientId
    const patientExists = await Patient.findOne({ Username: patientUsername });

    if (!patientExists) {
      return res.status(400).json({ error: "Patient not found" });
    }

    // Create a new schedule
    const newSchedule = await Schedule.create({
      doctor: doctorExists,
      patient: patientExists,
      dateFrom: newDate,
    });

    // Check if the patient is already in the doctor's patients array
    const isPatientInArray = doctorExists.patients.some(patient => patient.equals(patientExists._id));

    // If the patient is not in the array, add them
    if (!isPatientInArray) {
      doctorExists.patients.push(patientExists._id);
      await doctorExists.save();
    }
    
    console.log("Schedule added successfully");
    
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: "Failed to add schedule" });
  }
};

// check if doctor has appointment on a specific date
function hasApp(doctor, date) {
  const docApp = Schedule.find({ doctor, date });
  if (!docApp) {
    return true;
  }
  return false;
}

// update schedule information by id
const updateSchedule = async (req, res) => {
  const { doctor, patient, date, status } = req.body;
  try {
    const schedule = await Schedule.findByIdAndUpdate(
      req.body.id,
      {
        doctor,
        patient,
        date,
        status,
      },
      { new: true }
    );
    res.status(200).json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete schedule by id
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.body.id);
    res.status(200).json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Schedule.findById(req.body.id);
    
    // If appointment not found
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    const patient = await Patient.findById(appointment.patient);
    console.log(patient);

    // If patient not found
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    doctor = await Doctor.findById(appointment.doctor);
    console.log(doctor);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    if (appointment.status === 'Cancelled') {
      return res.status(400).json({ error: 'Appointment is already cancelled or is already completed' });
    }

    if(appointment.status === 'Completed'){
      return res.status(400).json({ error: 'Appointment is already completed' });
    }

    appointment.status = 'Cancelled';
    patient.Wallet += doctor.HourlyRate;
    await appointment.save();
    await patient.save();
    console.log(patient.Wallet)

    res.status(200).json({
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling appointment', error);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
};

// export functions
module.exports = {
  getSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  cancelAppointment
};
