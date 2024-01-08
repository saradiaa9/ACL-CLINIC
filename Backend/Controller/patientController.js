const Patient = require("../Models/patient.js");
const Doctor = require("../Models/doctor.js");
const FamilyMember = require("../Models/FamilyMember.js");
const Package = require("../Models/package.js");
const Prescription = require("../Models/Prescription.js");
const Schedule = require("../Models/Schedule.js");
const Followup = require("../Models/Followup.js");
const path = require("path");
const fs = require("fs");
const bcrypt = require('bcrypt');
const PDFDocument = require('pdfkit');

const { default: mongoose } = require("mongoose");
const { addPackage } = require("./packageController.js");
const { addSchedule } = require("./scheduleController.js");

const getPatients = async (req, res) => {
  try {
    const allPatients = await Patient.find();
    res.status(200).json(allPatients);
  } catch (error) {
    console.error("ERROR retrieving patients", error);
    res.status(400).json({ error: "Failed to retrieve patients" });
  }
};

const addPatient = async (req, res) => {
  //username, name, email, password, date of birth, gender, mobile number, emergency contact ( full name , mobile number)
  const {
    Username,
    Name,
    Email,
    Password,
    DateOfBirth,
    NationalID,
    Gender,
    MobileNumber,
    EmergencyContact,
  } = req.body;
  //NEED TO CHECK IF IT IS SILVER OR GOLD OR PLATINUM
  try {
    // Create a new patient document
    const newPatient = await Patient.create({
      Username,
      Name,
      Email,
      Password,
      DateOfBirth,
      NationalID,
      Gender,
      MobileNumber,
      EmergencyContact,
    });

    // Respond with the newly created patient document
    res.status(201).json(newPatient);
  } catch (error) {
    console.error("ERROR adding patient", error);
    res.status(400).json({ error: "Failed to add patient" });
  }
};

const searchDoctors = async (req, res) => {
  //search for a doctor by name and/or speciality
  const { Username } = req.query;
  const { Name, Specialty } = req.query;
  try {
    console.log(Name);
    const patient = await Patient.findOne({ Username: Username });
    const package = await Package.findOne({ _id: patient.Package });
    let query = {};

    // Check if 'name','specialty' query parameter is provided
    if (Name) {
      query.Name = { $regex: Name, $options: "i" }; // Case-insensitive search for name
    }

    if (Specialty) {
      query.Specialty = { $regex: Specialty, $options: "i" }; // Case-insensitive search for specialty
    }



    query.Accepted = "accepted";


    const doctors = await Doctor.find(query);

    const doctorsList = doctors.map((doctor) => ({
      Username: doctor.Username,
      Name: doctor.Name,
      Specialty: doctor.Specialty,
      SessionPrice: calculateDiscount(package, doctor),
    }));

    console.log(doctorsList);

    // Return the search results as JSON
    res.status(200).json(doctorsList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addFamilyMember = async (req, res) => {
  // Add a family member to a patient using name, national ID, age, gender, and relation to the patient
  const { Username } = req.query
  const { Name, NationalID, Age, Gender, Relation } = req.body;

  try {
    // Try finding the patient by username
    const patient = await Patient.findOne({ Username });

    // If the patient is found and the Relation is valid, create a new family member
    const newFamilyMember = await FamilyMember.create({
      Name,
      NationalID,
      Age,
      Gender,
      Relation,
    });

    console.log(newFamilyMember);

    // Add the new family member's _id to the patient's family array
    patient.family.push(newFamilyMember._id);

    // Save the changes to both the patient and family member documents
    await Promise.all([patient.save(), newFamilyMember.save()]);

    res.status(200).json({ message: "Family member added successfully" });
  } catch (error) {
    console.error("ERROR adding family member", error);
    res.status(400).json({ error: "Failed to add family member" });
  }
};

const getFamilyMembers = async (req, res) => {
  // Get all family members of a patient
  const { Username } = req.query;

  try {
    // Try finding the patient by username and populate the family field
    const patient = await Patient.findOne({ Username: Username });

    // Check if patient is found
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Check if the patient has family members
    if (patient.family != null) {
      const familyMemberIds = patient.family.map(
        (familyMember) => familyMember._id
      );
      const familyMembers = await FamilyMember.find({
        _id: { $in: familyMemberIds },
      }).populate("Package").populate("records");

      return res.status(200).json(familyMembers);
    } else {
      // If patient has no family members
      return res.status(200).json([]);
    }
  } catch (error) {
    console.error("ERROR getting family members", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const payWallet = async (req, res) => {
  const { Username} = req.query;
  const {doctorId}= req.body;

  try {
    const patient = await Patient.findOne({ Username }).populate("Package");
    const doctor = await Doctor.findOne({ _id: doctorId });

    if (!patient || !doctor) {
      return res.status(404).json({ error: "Patient or doctor not found" });
    }
    console.log(99)


    // Calculate the session price using the calculateDiscount function
    const sessionPrice = calculateDiscount(patient.Package, doctor);

    // Check if the patient has sufficient funds in the wallet
    if (patient.Wallet < sessionPrice) {
      return res
        .status(400)
        .json({ error: "Insufficient funds in the wallet" });
    }

    // Subtract the session price from the patient's wallet
    patient.Wallet -= sessionPrice;
    await patient.save();

    res.status(200).json({ message: "Payment successful", sessionPrice });
    patient.PackageStatus.Activated = "Activated";
  } catch (error) {
    console.error("Error paying with wallet", error);
    res.status(500).json({ error: "Failed to process payment with wallet" });
  }
};

const payWalletPackage = async (req, res) => {
  const { Username } = req.query;
  const { packageName } = req.body;

  try {
    const patient = await Patient.findOne({ Username });
    

    if (!patient ) {
      return res.status(404).json({ error: "Patient not found" });
    }
    
    const pack = await Package.findOne({ Name: packageName });

    if (!pack) {
      return res.status(404).json({ error: "Package not found" });
    }

    // Check if the patient has sufficient funds in the wallet
    if (patient.Wallet < pack.AnnualPrice) {
      return res
        .status(400)
        .json({ error: "Insufficient funds in the wallet" });
    }

    // Subtract the session price from the patient's wallet
    patient.Wallet -= pack.AnnualPrice;
    await patient.save();

    res.status(200).json({ message: "Payment successful", pack });

  } catch (error) {
    console.error("Error paying with wallet", error);
    res.status(500).json({ error: "Failed to process payment with wallet" });
  }
};

const getWallet = async (req, res) => {
  const { Username } = req.query;
  try {
    const exist = await Patient.findOne({ Username });
    if (!exist) {
      return res.status(404).json({ error: "No patient found" });
    }
    res.status(200).json(exist.Wallet);
  } catch (error) {
    console.error("Error getting Wallet", error);
    res.status(500).json({ error: "Failed to get Wallet" });
  }
};

// filter a doctor by specialty and/or availability on a certain date and at a specific time
const filterDoctors = async (req, res) => {
  const { Username, Specialty, date } = req.query;

  try {

    const patient = await Patient.findOne({ Username: Username });
    const package = await Package.findOne({ _id: patient.Package });
    let query = { Accepted: "accepted" };

    // Check if 'specialty' query parameter is provided
    if (Specialty) {
      query.Specialty = { $regex: Specialty, $options: "i" }; // Case-insensitive search for specialty
    }

    
    // Check if 'date' query parameter is provided
    if (date) {

      const appointmentDateTime = new Date(date);
      appointmentDateTime.setHours(appointmentDateTime.getHours() + 2);

      
      
      // Find all doctors and populate the schedule field
      const doctorsWithAppointments = await Schedule.find({
        dateFrom: { $lte: appointmentDateTime },
        dateTo: { $gt: appointmentDateTime },
      }).select('doctor');



      console.log(appointmentDateTime);


      query._id = { $nin: doctorsWithAppointments.map(appointment => appointment.doctor) };
    }
    

    const filteredDoctors = await Doctor.find(query);

    const doctorsList = filteredDoctors.map((doctor) => ({
      Username: doctor.Username,
      Name: doctor.Name,
      Specialty: doctor.Specialty,
      SessionPrice: calculateDiscount(package, doctor),
    }));

    // Return the filtered doctors as JSON
    res.status(200).json(doctorsList);
  } catch (error) {
    console.error("ERROR filtering doctors", error);
    res.status(500).json({ error: "Failed to filter doctors" });
  }
};

const loginPatient = async (req, res) => {
  const { Username, Password } = req.body;
  try {
    const patient = await Patient.findOne({ Username });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    if (patient.Password !== Password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (patient.Accepted !== "accepted") {
      return res.status(403).json({ error: "Patient not accepted" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const viewDoctors = async (req, res) => {
  const { Username } = req.query;
  try {
    // Find all doctors and populate the package field
    const doctors = await Doctor.find({ Accepted: "accepted" });
    const patient = await Patient.findOne({ Username: Username });
    
    
    let package = null; // Declare package outside the blocks

    if (patient.Package) {
      
      package = await Package.findOne({ _id: patient.Package });
    }

    

    // Manually map the doctors array to only include the required fields
    const doctorsList = doctors.map((doctor) => ({
      Username: doctor.Username,
      Name: doctor.Name,
      Specialty: doctor.Specialty,
      SessionPrice: calculateDiscount(package, doctor),
    }));

    if (doctorsList.length === 0) {
      return res.status(404).json({ error: "No doctors found" });
    }

    res.status(200).json(doctorsList);
  } catch (error) {
    console.error("Error getting doctors", error);
    res.status(500).json({ error: "Failed to get doctors" });
  }
};



//add package to patient
const addPackageToPatient = async (req, res) => {
  const { Username } = req.query;
  const { packageName } = req.body;
  try {
    const patient = await Patient.findOne({ Username: Username });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const existingPackage = await Package.findOne({ Name: packageName });
    if (!existingPackage) {
      return res.status(404).json({ error: "Package not found" });
    }
    if(patient.PackageStatus.Activated) {
    patient.Package = existingPackage._id;
    patient.PackageStatus.Status = "Subscribed";
    patient.PackageStatus.StartDate = new Date();

    // Ensure StartDate is set before calculating EndDate
    if (patient.PackageStatus.StartDate) {
      patient.PackageStatus.EndDate = new Date(patient.PackageStatus.StartDate);
      patient.PackageStatus.EndDate.setFullYear(
        patient.PackageStatus.EndDate.getFullYear() + 1
      );
    }
    }
    await patient.save();
    res.status(200).json({ message: "Package added successfully" });
  } catch (error) {
    console.error("ERROR adding package", error);
    res.status(400).json({ error: "Failed to add package" });
  }
};

function calculateDiscount(Package, Doctor) {
  //if package doesnt exist
  let total = 0;
  
  if (Package == null) {
    total = Doctor.HourlyRate;
  } else {
    total =
      Doctor.HourlyRate - (Doctor.HourlyRate * (Package.DoctorDiscount / 100));
  }
  //calculate discount for the package
  return total;
}

function buildPDF(dataCallback, endCallback, prescription) {
  const doc = new PDFDocument({ bufferPages: true, font: 'Courier' });

  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  doc.fontSize(20).text(`Prescription`);

  doc
    .fontSize(12)
    .text(`Doctor: ${prescription.DoctorUsername}`);
  doc.text(`Date: ${prescription.DateP.toDateString()}`);

  doc.fontSize(14).text('Medicines:');
  prescription.Medicine.forEach((med, index) => {
    doc.text(`${index + 1}. ${med.Name}, Dosage: ${med.Dosage}`);
  });

  doc.text(`Total Price: ${prescription.Price}`);

  doc.end();
}

const generatePrescriptionPDF = (prescription, res) => {
  const stream = res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment;filename=prescription.pdf`,
  });

  buildPDF(
    (chunk) => stream.write(chunk),
    () => stream.end(),
    prescription
  );
};

// Use it in your route handler
const downloadPrescriptionPDF = async (req, res) => {
  const { PrescriptionId } = req.params;

  try {
    const prescription = await Prescription.findById(PrescriptionId);

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    generatePrescriptionPDF(prescription, res);
  } catch (error) {
    console.error('ERROR generating prescription PDF', error);
    res.status(500).json({ error: 'Failed to generate prescription PDF' });
  }
};

const viewPrescription = async (req, res) => {
  // Get the patient's username from the request parameters or body
  const { Username } = req.query;

  try {
    // Find the patient by username
    const patient = await Patient.findOne({ Username }).populate(
      "prescription"
    );

    // If patient not found
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // If the patient has a prescription, return it
    if (patient.prescription) {
      res.status(200).json(patient.prescription);
    } else {
      res.status(404).json({ error: "Patient does not have a prescription" });
    }
  } catch (error) {
    console.error("ERROR viewing prescription", error);
    res.status(500).json({ error: "Failed to view prescription" });
  }
};

const filterPrescriptions = async (req, res) => {
  const { Username, DateP, DoctorUsername, Filled } = req.body;

  try {
    const patient = await Patient.findOne({ Username }).populate('prescription');

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    let query = {};

    if (DateP) {
      query.DateP = new Date(DateP);
    }

    if (DoctorUsername) {
      query.DoctorUsername = DoctorUsername.toLowerCase();
    }

    if (Filled !== undefined) {
      query.Filled = Filled;
    }

    const filteredPrescriptions = patient.prescription.filter((prescription) => {
      // Check if the prescription matches the query criteria
      return (
        (!DateP || prescription.DateP.toISOString() === query.DateP.toISOString()) &&
        (!DoctorUsername || prescription.DoctorUsername.toLowerCase().includes(query.DoctorUsername)) &&
        (Filled === undefined || prescription.Filled === query.Filled)
      );
    });

    res.status(200).json(filteredPrescriptions);
  } catch (error) {
    console.error('ERROR filtering prescriptions', error);
    res.status(500).json({ error: 'Failed to filter prescriptions' });
  }
};

const selectPrescription = async (req, res) => {
  const { PatientUsername, MedicineName, DoctorUsername, DateP, Filled } =
    req.body;

  try {
    // Find the patient by username and populate the 'prescription' field
    const patient = await Patient.findOne({
      Username: PatientUsername,
    }).populate("prescription");

    // Check if the patient exists
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Filter prescriptions based on the specified criteria
    const selectedPrescriptions = patient.prescription.filter(
      (prescription) => {
        const matchMedicine =
          !MedicineName ||
          prescription.Medicine.some((med) =>
            med.Name.toLowerCase().includes(MedicineName.toLowerCase())
          );
        const matchDoctor =
          !DoctorUsername ||
          prescription.DoctorUsername.toLowerCase().includes(
            DoctorUsername.toLowerCase()
          );
          const matchDate =
          !DateP || prescription.DateP.toISOString() === new Date(DateP).toISOString();        
        const matchFilled =
          Filled === undefined || prescription.Filled === Filled;

        return matchMedicine && matchDoctor && matchDate && matchFilled;
      }
    );

    // Return the selected prescriptions as JSON
    res.status(200).json(selectedPrescriptions);
  } catch (error) {
    console.error("ERROR selecting prescriptions", error);
    res.status(500).json({ error: "Failed to select prescriptions" });
  }
};

const viewPrescriptions = async (req, res) => {
  const { Username } = req.query; // Assuming the patient's ID is available in the query
  try {
    const prescriptions = await Prescription.find({ PatientUsername: Username});
    if (!prescriptions || prescriptions.length === 0) {
      return res.status(404).json({ error: "Prescriptions not found" });
    }

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Error viewing prescriptions:", error);
    res.status(500).json({ error: "Failed to view prescriptions" });
  }
};

//view the details of my selected prescription
const viewPrescriptionDetails = async (req, res) => {
  const {Username}= req.query;
  const { prescriptionId } = req.body;
  try{
    const patient = await Patient.findOne({Username});
    if(!patient){
      return res.status(404).json({error: "Patient not found"});
    }
    const prescription = await Prescription.findOne({_id: prescriptionId});
    if(!prescription){
      return res.status(404).json({error: "Prescription not found"});
    }
 
    res.status(200).json(prescription);
  }
  catch(error){
    console.error("ERROR viewing prescription details", error);
    res.status(500).json({ error: "Failed to view prescription details" });
  }
}
const filterAppointments = async (req, res) => {
  const { PatientUsername, Date, Status } = req.body;

  try {
    // Find the patient by username
    const patient = await Patient.findOne({ Username: PatientUsername });

    // Check if the patient exists
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    let query = { patient: patient._id };

    // Check if 'Date' query parameter is provided
    if (Date) {
      query.date = Date; // Filter by appointment date
    }

    // Check if 'Status' query parameter is provided
    if (Status) {
      query.status = Status; // Filter by appointment status
    }

    // Find appointments based on the specified criteria
    const filteredAppointments = await Schedule.find(query);

    // Return the filtered appointments as JSON
    res.status(200).json(filteredAppointments);
  } catch (error) {
    console.error("ERROR filtering appointments", error);
    res.status(500).json({ error: "Failed to filter appointments" });
  }
};

const viewDoctorDetails = async (req, res) => {
  try {
    const { doctorUsername } = req.query;
    const selectedDoctor = await Doctor.findOne({ Username: doctorUsername });

    if (!selectedDoctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }


    res.status(200).json(selectedDoctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Package Subscription

const viewPackageStatus = async (req, res) => {
  const { Username } = req.query;

  try {
    // Find the patient by their username
    const patient = await Patient.findOne({ Username });

    // If patient not found
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    if (patient.PackageStatus.Status === "Cancelled") {
      return res.status(200).json({ status: "cancelled" });
    }

    // Check if the patient has a package subscription
    if (!patient.Package) {
      return res.status(200).json({ status: "unsubscribed" });
    }

    // Find the package associated with the patient
    const package = await Package.findById(patient.Package);

    // If package not found
    if (!package) {
      return res.status(404).json({ error: "Package not found" });
    }

    // Build the package status response
    const packageStatus = {
      status: "subscribed",
      package: package.Name,
      startDate: patient.PackageStatus.StartDate,
      renewalDate: patient.PackageStatus.EndDate,
      packagePrice: package.AnnualPrice,
      packageDiscount: package.FamilyDiscount,
      doctorDiscount: package.DoctorDiscount,
      medicineDiscount: package.MedicineDiscount,
      Activated: patient.PackageStatus.Activated,
    };

    res.status(200).json(packageStatus);
  } catch (error) {
    console.error("ERROR viewing package status", error);
    res.status(500).json({ error: "Failed to view package status" });
  }
};

const cancelPackageSubscription = async (req, res) => {
  const { Username } = req.query;

  try {
    // Find the patient by their username
    const patient = await Patient.findOne({ Username });

    // If patient not found
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Check if the patient has a package subscription
    if (!patient.Package) {
      return res
        .status(200)
        .json({ message: "No package subscription to cancel" });
    }

    // Find the package associated with the patient
    const package = await Package.findById(patient.Package);

    // If package not found
    if (!package) {
      return res.status(404).json({ error: "Package not found" });
    }

    // Remove the package reference from the patient
   
    patient.PackageStatus.Status = "Cancelled";
    patient.PackageStatus.Activated = "Not Activated";

    // Save the changes to the patient document
    await patient.save();
   
    // Return a success message
    res
      .status(200)
      .json({ message: "Package subscription canceled successfully" });

  } catch (error) {
    console.error("ERROR canceling package subscription", error);
    res.status(500).json({ error: "Failed to cancel package subscription" });
  }
};
//
// Doctor Appointments

// Check if doctor is available at a specific time
const viewDoctorAppointments = async (req, res) => {

  const { Username } = req.query;

  try {
    const doctor = await Doctor.findOne({ Username });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const appointments = await Schedule.find({ doctor: doctor._id });
    const occupiedSlots = appointments.map(
      (appointment) => appointment.appointmentTime
    );

    // Assuming TimeSlots is an array of available slots for the doctor
    const availableSlots = doctor.TimeSlots.filter(
      (slot) => !occupiedSlots.includes(slot)
    ).map((slot) => {
      const hours = slot.getHours().toString().padStart(2, "0");
      const minutes = slot.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    });

    res.status(200).json({ availableSlots });
  } catch (error) {
    console.error("Error fetching doctor appointments", error);
    res.status(500).json({ error: "Failed to fetch doctor appointments" });
  }
};

function calculateDiscountWithFam(package, doctor, isFamily) {
  let total = 0;
  console.log(package);

  if (!package) {
    total = doctor.HourlyRate;
  } else {
    // Use FamilyDiscount if isFamily is true, otherwise use DoctorDiscount
    const discountRate = isFamily
      ? package.FamilyDiscount
      : package.DoctorDiscount;

    total = doctor.HourlyRate - doctor.HourlyRate * (discountRate / 100);
  }

  // Calculate discount for the package
  return total;
}

// Book an appointment with a doctor for myself or a family member
const selectAppointment = async (req, res) => {
  const { Username} = req.query;
  const {doctorUsername, date, time } = req.body;

  try {
    // Find the patient by their username
    const patient = await Patient.findOne({ Username });

    // If patient not found
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Find the doctor by their username
    const doctor = await Doctor.findOne({ Username: doctorUsername });

    // If doctor not found
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const package = await Package.findOne({ _id: patient.Package });

    // Combine the specified date and time into a single Date object
    const dateValue = date.toString(); // Replace this with your Date parameter
    const timeValue = time.toString(); // Replace this with your Time parameter

    const combinedDateTimeString = `${dateValue}T${timeValue}`;

    const combinedDateTime = new Date(combinedDateTimeString);
    combinedDateTime.setHours(combinedDateTime.getHours() + 2);

    // Now you can use combinedDateTime in your code

    // Check if the doctor has an appointment at the specified date and time
    const existingAppointment = await Schedule.findOne({
      doctor: doctor._id,
      dateFrom: combinedDateTime,
    });

    if (existingAppointment) {
      return res.status(400).json({
        error: "Doctor already has an appointment at this date and time",
      });
    }

    // Check if the specified time is within the doctor's time slots
    const isTimeSlotValid = doctor.TimeSlots.some((timeSlot) => {
      const timeSlotDateTime = new Date(timeSlot);

      return (
        timeSlotDateTime.getHours() === combinedDateTime.getHours() &&
        timeSlotDateTime.getMinutes() === combinedDateTime.getMinutes()
      );
    });

    if (!isTimeSlotValid) {
      return res.status(400).json({
        error: "Specified time is not within the doctor's time slots",
      });
    }

    // Calculate the appointment price using the calculateDiscount function

    const appointmentPrice = await calculateDiscountWithFam(
      package,
      doctor,
     
    );
    console.log(appointmentPrice);

    const newAppointment = await addSchedule({
      query: { Username: doctorUsername},
      body: {
        patientUsername: Username,
        dateFrom: combinedDateTime,
      },
    });


    //add the patient to patient list of the doctor
    if(!doctor.patients.includes(patient._id)){

    doctor.patients.push(patient._id);
    await doctor.save();
    }

    res.status(200).json({
      message: "Appointment created successfully",
      price: appointmentPrice,
    });
  } catch (error) {
    console.error("Error creating appointment", error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

const requestFollowup = async (req, res) => {
  const { Username, doctorUsername } = req.query;
  const { date, isFamily } = req.body;

  try {
    console.log(date, isFamily);
    
    // Find the patient by their username
    const patient = await Patient.findOne({ Username });

    // If patient not found
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Find the doctor by their username
    const doctor = await Doctor.findOne({ Username: doctorUsername });

    // If doctor not found
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const package = await Package.findOne({ _id: patient.Package });


    const combinedDateTime = new Date(date);
    

    
    // Now you can use combinedDateTime in your code

    // Check if the doctor has an appointment at the specified date and time
    const existingAppointment = await Schedule.findOne({
      doctor: doctor._id,
      dateFrom: combinedDateTime,
    });

    if (existingAppointment) {
      return res.status(400).json({
        error: "Doctor already has an appointment at this date and time",
      });
    }

    // Check if the specified time is within the doctor's time slots
    const isTimeSlotValid = doctor.TimeSlots.some((timeSlot) => {
      const timeSlotDateTime = new Date(timeSlot);

      return (
        timeSlotDateTime.getHours() === combinedDateTime.getHours() &&
        timeSlotDateTime.getMinutes() === combinedDateTime.getMinutes()
      );
    });

    if (!isTimeSlotValid) {
      return res.status(400).json({
        error: "Specified time is not within the doctor's time slots",
      });
    }

    // Calculate the appointment price using the calculateDiscount function

    const appointmentPrice = await calculateDiscountWithFam(
      package,
      doctor,
      isFamily
    );
    console.log(appointmentPrice);

    const request = await Followup.create({
      patient: patient._id,
      doctor: doctor._id,
      dateFrom: combinedDateTime,
    });

    res.status(200).json({
      message: "Request sent successfully",
      price: appointmentPrice,
    });
  } catch (error) {
    console.error("Error requesting followup", error);
    res.status(500).json({ error: "Failed to request followup" });
  }

};

const selectAppointmentForFamily = async (req, res) => {
  const { Username } = req.query;
  const { doctorUsername, date, time, familyMemberId } = req.body;
  try{
    const patient = await Patient.findOne({ Username });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const doctor = await Doctor.findOne({ Username: doctorUsername });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    const family = await FamilyMember.findOne({ _id: familyMemberId });
    if (!family) {
      return res.status(404).json({ error: "Family member not found" });
    }
    
    const package = await Package.findOne({ _id: patient.Package });

    // Combine the specified date and time into a single Date object
    const dateValue = date.toString(); // Replace this with your Date parameter
    const timeValue = time.toString(); // Replace this with your Time parameter

    const combinedDateTimeString = `${dateValue}T${timeValue}`;

    const combinedDateTime = new Date(combinedDateTimeString);
    combinedDateTime.setHours(combinedDateTime.getHours() + 2);

    // Now you can use combinedDateTime in your code

    // Check if the doctor has an appointment at the specified date and time
    const existingAppointment = await Schedule.findOne({
      doctor: doctor._id,
      dateFrom: combinedDateTime,
    });

    if (existingAppointment) {
      return res.status(400).json({
        error: "Doctor already has an appointment at this date and time",
      });
    }

    // Check if the specified time is within the doctor's time slots
    const isTimeSlotValid = doctor.TimeSlots.some((timeSlot) => {
      const timeSlotDateTime = new Date(timeSlot);

      return (
        timeSlotDateTime.getHours() === combinedDateTime.getHours() &&
        timeSlotDateTime.getMinutes() === combinedDateTime.getMinutes()
      );
    });

    if (!isTimeSlotValid) {
      return res.status(400).json({
        error: "Specified time is not within the doctor's time slots",
      });
    }

    // Calculate the appointment price using the calculateDiscount function

    const appointmentPrice = await calculateDiscountWithFam(
      package,
      doctor,
     
    );
    console.log(appointmentPrice);

    //Create a new appointment in the Schedule collection with the calculated price
    const newAppointment = await Schedule.create({
      doctor: doctor._id,
      family: family._id,
      dateFrom: combinedDateTime,
      // Add any other relevant fields to the new appointment
    });

    res.status(200).json({
      message: "Appointment created successfully",
      price: appointmentPrice,
    });
  } catch (error) {
    console.error("Error creating appointment", error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
};



    
  
const rescheduleAppointment = async (req, res) => {
  const { Username } = req.query;
  const { date, time, oldAppointmentID,doctorUsername} = req.body;

  try {
    // Find the patient by their username
    const patient = await Patient.findOne({ Username });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Find the doctor by their username
    const doctor = await Doctor.findOne({ Username: doctorUsername });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Find the package details for the patient
    const package = await Package.findOne({ _id: patient.Package });

    // Combine the specified date and time into a single Date object
    const dateValue = date.toString();
    const timeValue = time.toString();
    const combinedDateTimeString = `${dateValue}T${timeValue}`;
    const combinedDateTime = new Date(combinedDateTimeString);
    combinedDateTime.setHours(combinedDateTime.getHours() + 2);

    // Find and delete the existing appointment using oldAppointmentID
    const existingAppointment = await Schedule.findByIdAndDelete(oldAppointmentID);

    if (!existingAppointment) {
      return res.status(400).json({
        error: "No existing appointment found to reschedule",
      });
    }

    // Check if the specified time is within the doctor's time slots
    const isTimeSlotValid = doctor.TimeSlots.some((timeSlot) => {
      const timeSlotDateTime = new Date(timeSlot);
      return (
        timeSlotDateTime.getHours() === combinedDateTime.getHours() &&
        timeSlotDateTime.getMinutes() === combinedDateTime.getMinutes()
      );
    });

    if (!isTimeSlotValid) {
      return res.status(400).json({
        error: "Specified time is not within the doctor's time slots",
      });
    }

    // Calculate the appointment price using the calculateDiscount function
    const appointmentPrice = await calculateDiscountWithFam(
      package,
      doctor,
   
    );

    // Create a new appointment in the Schedule collection with the calculated price
    const newAppointment = await Schedule.create({
      doctor: doctor._id,
      patient: patient._id,
      dateFrom: combinedDateTime,
      
      // Add any other relevant fields to the new appointment
    });

    // Respond with success message and the appointment price
    res.status(200).json({
      message: "Appointment rescheduled successfully",
      price: appointmentPrice,
    });
  } catch (error) {
    console.error("Error rescheduling appointment", error);
    res.status(500).json({ error: "Failed to reschedule appointment" });
  }
};
const addPatientToPatient = async (req, res) => {
  const { Username } = req.query;
  const { Email, Phone, Relation } = req.body;

  
  try {
    const myPatient1 = await Patient.findOne({ Username: Username });
    if (!myPatient1) {
      return res.status(404).json({ error: "Patient 1 not found" });
    }
    
    

    var myPatient2 = await Patient.findOne({ Email: Email });
    if (!myPatient2) {
      myPatient2 = await Patient.findOne({ MobileNumber: Phone });
      if (!myPatient2) {
        return res.status(404).json({ error: "Patient 2 not found" });
      }
    }

    console.log(myPatient2.NationalID);

    if (myPatient1.NationalID === myPatient2.NationalID) {
      return res.status(404).json({ error: "Can't Marry Yourself" });
    }

    if (
      Relation !== "Wife" &&
      Relation !== "Husband" &&
      Relation !== "Son" &&
      Relation !== "Daughter"
    ) {
      return res.status(404).json({ error: "Invalid relation" });
    }

    // Check if the family member already exists
    const patient2National = myPatient2.NationalID;
    const family = myPatient1.family;
    var existing = false;
    for (const fam of family) {
      const familyMember = await FamilyMember.findOne({ _id: fam });
      if (
        familyMember.NationalID === patient2National &&
        familyMember.Relation === Relation
      ) {
        existing = true;
        break;
      }
    }
    if (existing) {
      return res.status(404).json({ error: "Family member already exists" });
    }

    if (existing) {
      return res.status(404).json({ error: "Family member already exists" });
    }

    const familyMember = await FamilyMember.findOne({
      NationalID: myPatient2.NationalID,
      Relation: Relation,
    });
    if (familyMember) {
      myPatient1.family.push(familyMember._id);
      await myPatient1.save();
      return res
        .status(200)
        .json({ message: "Family member added successfully" });
    }

    // Use the FamilyMember model to create a new family member
    const newFamilyMember = await FamilyMember.create({
      Name: myPatient2.Name,
      NationalID: myPatient2.NationalID,
      Age: new Date().getFullYear() - myPatient2.DateOfBirth.getFullYear(),
      Gender: myPatient2.Gender,
      Relation: Relation,
    });

    myPatient1.family.push(newFamilyMember._id);
    await myPatient1.save();

    res.status(200).json({ message: "Family member added successfully" });
  } catch (error) {
    console.error("ERROR adding family member", error);
    res.status(400).json({ error: "Failed to add family member" });
  }
};
const getTimeSlots = async (req, res) => {
  try {
    const {Username} = req.query;
    const { doctorUsername } = req.body;

    const patient = await Patient.findOne({ Username });
    // Find the doctor by username
    const doctor = await Doctor.findOne({
      Username: doctorUsername,
      Accepted: "accepted",
    });

    if (!doctor) {
      return res
        .status(404)
        .json({ error: "Doctor not found or not accepted" });
    }

    // Return the doctor's time slots
    res.status(200).json({ timeSlots: doctor.TimeSlots });
  } catch (error) {
    console.error("Error fetching time slots:", error);
    res.status(500).json({ error: "Failed to retrieve time slots" });
  }
};

//Payment method
const PaymentMethod = async (req, res) => {
  const { Username} = req.query;
  const {doctorId}= req.body;
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  try {
    const patient = await Patient.findOne({ Username}).populate("Package");
    const doctor = await Doctor.findOne({ _id: doctorId });
    console.log(doctor);
    console.log(patient);

    if (!patient || !doctor) {
      return res.status(404).json({ error: "Patient or doctor not found" });
    }

    // Calculate the session price using the calculateDiscount function
    const sessionPrice = calculateDiscount(patient.Package, doctor);
    console.log(sessionPrice);
    const doctorName = doctor.Name;

const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  mode: "payment",
  line_items: [
    {
    
      price_data: {
        currency: "usd",
        product_data: {
          name: doctorName,
        },
        unit_amount: sessionPrice * 100,
      },
      quantity: 1,
    },
  ],
  
  success_url: `${process.env.CLIENT_URL}/Patient/success`,
  cancel_url: `${process.env.CLIENT_URL}/Patient/cancel`,
})
console.log(sessionPrice);
console.log(session);

res.json({ url: session.url })

} catch (e) {
res.status(500).json({ error: e.message })
}
};

const getDocuments = async (req, res) => {
  try {
    // Assuming req.query.username contains the patient's username
    const username = req.query.username;

    // Set the path to the MedicalHistory folder
    const medicalHistoryFolder = path.join(
      "../frontend/public/Documents/MedicalHistory",
      username
    );

    // Read the files in the folder asynchronously
    const files = await fs.promises.readdir(medicalHistoryFolder);

    // Construct an array of document objects with file names
    const documents = files.map((filename) => ({
      filename,
      path: path.join(medicalHistoryFolder, filename),
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
      "../frontend/public/Documents/MedicalHistory",
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

const getRecords = async (req, res) => {
  const { Username } = req.query;

  try {
    const patient = await Patient.findOne({ Username }).populate("records");

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    if (!patient.records || patient.records.length === 0) {
      return res
        .status(404)
        .json({ error: "No records found for this patient" });
    }

    res.status(200).json(patient.records);
  } catch (error) {
    console.error("ERROR getting records", error);
    res.status(500).json({ error: "Failed to get records" });
  }
};

const getSchedule = async (req, res) => {
  const { Username } = req.query;

  try {
    // Find the patient by username
    const patient = await Patient.findOne({ Username });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Fetch all schedules for the found patient
    const schedules = await Schedule.find({ patient: patient._id });

    if (schedules.length === 0) {
      return res
        .status(404)
        .json({ error: "No schedules found for this patient" });
    }

    // Return the schedules associated with the patient
    res.status(200).json({ schedules });
  } catch (error) {
    console.error("Error getting schedules", error);
    res.status(500).json({ error: "Failed to get schedules" });
  }
};

const getmyRecords = async (req, res) => {
  const { Username } = req.query;

  try {
    const patient = await Patient.findOne({ Username }).populate("records");

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    if (!patient.records || patient.records.length === 0) {
      return res
        .status(404)
        .json({ error: "No records found for this patient" });
    }

    // Map through the records and populate the 'patient' and 'doctor' fields
    const populatedRecords = await Promise.all(
      patient.records.map(async (record) => {
        const doctorfind = await Doctor.findOne({ Username: record.DoctorUsername });
        return { Description: record.Description, doctor: doctorfind, pateint: patient };
      })
    );

    res.status(200).json({populatedRecords});
  } catch (error) {
    console.error("ERROR getting records", error);
    res.status(500).json({ error: "Failed to get records" });
  }
};

const getmyPrescriptions = async (req, res) => {
  const { Username } = req.query;

  try {
    const patient = await Patient.findOne({ Username }).populate("prescription");

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    if (!patient.prescription || patient.prescription.length === 0) {
      return res
        .status(404)
        .json({ error: "No prescriptions found for this patient" });
    }

    // Map through the records and populate the 'patient' and 'doctor' fields
    const populatedPrescription = await Promise.all(
      patient.prescription.map(async (theprescription) => {
        const doctorfind = await Doctor.findOne({ Username: theprescription.DoctorUsername });
        return { prescription: theprescription , doctor: doctorfind, pateint: patient };
      })
    );

    res.status(200).json({populatedPrescription});
  } catch (error) {
    console.error("ERROR getting prescriptions", error);
    res.status(500).json({ error: "Failed to get prescriptions" });
  }
};

const getScheduleDoctor = async (req, res) => {
  const { Username, patientUsername } = req.query;

  try {

    const doctor = await Doctor.findOne({ Username });

    if (!doctor) {
      return res.status(404).json({ error: "Patient not found" });
    }
  
    // Find the patient by username
    const patient = await Patient.findOne({ Username: patientUsername });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Fetch all schedules for the found patient
    const schedules = await Schedule.find({ patient: patient, doctor: doctor })
  .populate('doctor') // Populate the 'doctor' field with the actual Doctor document
  .populate('patient'); // Populate the 'patient' field with the actual Patient document


    if (schedules.length === 0) {
      return res
        .status(404)
        .json({ error: "No schedules found for this patient" });
    }

    // Return the schedules associated with the patient
    res.status(200).json({ schedules });
  } catch (error) {
    console.error("Error getting schedules", error);
    res.status(500).json({ error: "Failed to get schedules" });
  }
};

const getPatientDetailsID = async (req, res) => {
  const { _id } = req.query; // Assuming the doctorId is passed in the query parameters

  try {
    const patient = await Patient.findById(_id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.status(200).json(patient.Name);
  } catch (error) {
    res.status(500).json({ error: "Error fetching patient details" });
  }
};

const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

const updatePassword = async (req, res) => {
  const { Username, newPassword } = req.body;

  try {
    // Fetch the user from the database
    const patient = await Patient.findOne({ Username });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the password in the database
    patient.Password = hashedPassword;
    await patient.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
};


const getAppDoctorPatient = async (req, res) => {
  try {
    const { Username } = req.query;
    const { doctorUsername } = req.query;

    const patient = await Patient.findOne({ Username });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const doctor = await Doctor.findOne({ Username: doctorUsername });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const schedule = await Schedule.find({
      patient: patient._id,
      doctor: doctor._id,
    })
      .populate("doctor")
      .populate("patient");

    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    // Subtract 2 hours from dateFrom property in each schedule
    const modifiedSchedule = schedule.map((entry) => {
      const modifiedDateFrom = new Date(entry.dateFrom);
      modifiedDateFrom.setHours(modifiedDateFrom.getHours() - 2);

      return {
        ...entry.toObject(),
        dateFrom: modifiedDateFrom,
      };
    });

    res.status(200).json(modifiedSchedule);
  } catch (error) {
    console.error("Error getting patient appointments:", error);
    res.status(500).json({ error: "Failed to get patient appointments" });
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


    res.status(201).json(schedule);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to schedule follow-up" });
  }
};
const getPatientDetails = async (req,res) => {
  const { Username } = req.query; // Assuming the doctorId is passed in the query parameters

    try {
        const patient = await Patient.findOne({ Username} ).populate('Package');
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching patient details' });
    }
}
const payForPackage = async (req, res) => {
  const { Username } = req.body;
  const { packageName } = req.body;

  try {
    const patient = await Patient.findOne({ Username });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const packageIsValid = await Package.findOne({ Name: packageName });

    if (!packageIsValid) {
      return res.status(404).json({ error: "Package not found" });
    }

    const packagePrice = packageIsValid.AnnualPrice;

    if (patient.Wallet < packagePrice) {
      return res.status(400).json({ error: "Insufficient funds in the wallet" });
    }

    patient.Wallet -= packagePrice;
    patient.PackageStatus.Activated = "Activated"; // Activate the package after deducting funds
    await patient.save();
    console.log(patient.PackageStatus.Activated)

    res.status(200).json({ message: "Payment successful", packagePrice });
  } catch (error) {
    console.error("Error paying for package", error);
    res.status(500).json({ error: "Failed to process payment for package" });
  }
};
const addPackageToFamilyMember = async (req, res) => {
  const { Username } = req.query;
  const { packageName, familyMember } = req.body;

  try {
    const patient = await Patient.findOne({ Username });
    
    const packageNameIsValid = await Package.findOne({ Name: packageName });
    const familyMemberIsValid = await FamilyMember.findOne({ Name: familyMember });
    
    if(!patient){
      return res.status(404).json({ error: "Patient not found" });
    }
    if(!packageNameIsValid){
      return res.status(404).json({ error: "Package not found" });
    }
    if(!familyMemberIsValid){
      return res.status(404).json({ error: "Family member not found" });
    }
    
      familyMemberIsValid.Package = packageNameIsValid._id;
      console.log(familyMemberIsValid.Package)
      familyMemberIsValid.PackageStatus.Status = "Subscribed";
      familyMemberIsValid.PackageStatus.StartDate = new Date();
  
      // Ensure StartDate is set before calculating EndDate
      if (familyMemberIsValid.PackageStatus.StartDate) {
        familyMemberIsValid.PackageStatus.EndDate = new Date(familyMemberIsValid.PackageStatus.StartDate);
        familyMemberIsValid.PackageStatus.EndDate.setFullYear(
          familyMemberIsValid.PackageStatus.EndDate.getFullYear() + 1
        );
      }
       await familyMemberIsValid.save();
      res.status(200).json({ message: "Package added successfully" });
      console.log(familyMemberIsValid.PackageStatus.Status)
    } catch (error) {
      console.error("ERROR adding package", error);
      res.status(400).json({ error: "Failed to add package" });
    }
  };
  //choose to pay directly pay for the prescription items wallet or credit card
const payForPrescription = async (req, res) => {
  const { Username } = req.query;
  const { prescriptionId } = req.body;
  try{
    const patient = await Patient.findOne({ Username });
    if(!patient){
      return res.status(404).json({error: "Patient not found"});
    }
    const prescription = await Prescription.findOne({_id: prescriptionId});
    if(!prescription){
      return res.status(404).json({error: "Prescription not found"});
    }
    const prescriptionPrice = prescription.Price;
    if(patient.Wallet < prescriptionPrice){
      return res.status(400).json({error: "Insufficient funds in the wallet"});
    }
    console.log(patient.Wallet)
    patient.Wallet -= prescriptionPrice;
    prescription.Paid = true;
    console.log(patient.Wallet)
    await patient.save();
    await prescription.save();
    res.status(200).json({message: "Payment successful"});
  }
  catch(error){
    console.error("ERROR paying for prescription", error);
    res.status(500).json({ error: "Failed to pay for prescription" });
  }
}

 // Pay for family member package
const payForFamilyMemberPackage = async (req, res) => {
  const { Username, familyMember, packageName } = req.body;
  try {
    // Find the patient based on the Username
    const patient = await Patient.findOne({ Username });
    
    // If the patient doesn't exist, return a 404 error
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    
    // Find the family member based on their name
    const family = await FamilyMember.findOne({ Name: familyMember });
    
    // If the family member doesn't exist, return a 404 error
    if (!family) {
      return res.status(404).json({ error: "Family member not found" });
    }

    // Find the package details based on the package name
    const familyPackage = await Package.findOne({ Name: packageName });
    
    // If the package doesn't exist, return a 404 error
    if (!familyPackage) {
      return res.status(404).json({ error: "Package not found" });
    }

    // Perform the payment processing logic here...
    // Calculate the package price
    const packagePrice = familyPackage.AnnualPrice;
    

    console.log(packagePrice)
    console.log(patient.Wallet)
    // Check if the patient has sufficient funds in the wallet
    if (patient.Wallet < packagePrice) {
      return res.status(400).json({ error: "Insufficient funds in the wallet" });
    }

    // Subtract the package price from the patient's wallet
    patient.Wallet -= packagePrice;
    family.PackageStatus.Activated = "Activated";
    await patient.save();
    await family.save();
    console.log(patient.Wallet)


    // Return a success message after payment
    return res.status(200).json({ message: "Payment successful" });
  } catch (error) {
    // Handle any errors that might occur during payment processing
    return res.status(500).json({ error: "Failed to process payment" });
  }
};

//Cancel Package Subscription for family member

const CancelPackageSubscriptionForFamilyMember = async (req, res) => {
  const { Username} = req.query;
  const {familyMember} = req.body;

  try {
          const patient = await Patient.findOne({ Username });
          if(!patient){
            return res.status(404).json({ error: "Patient not found" });
          }
      
          const familyMemberIsValid = await FamilyMember.findOne({ Name: familyMember });
          if(!familyMemberIsValid){
            return res.status(404).json({ error: "Family member not found" });
          }
          if(!familyMemberIsValid.Package){
            return res.status(200).json({ message: "No package subscription to cancel" });
          }
          const package = await Package.findOne({ _id: familyMemberIsValid.Package });
          if(!package){
            return res.status(404).json({ error: "Package not found" });
          }
        
          familyMemberIsValid.PackageStatus.Status = "Cancelled";
          familyMemberIsValid.PackageStatus.Activated = "Not Activated";
          console.log(familyMemberIsValid.PackageStatus.Status)
          await familyMemberIsValid.save();
          res.status(200).json({ message: "Package subscription canceled successfully" });
  }
  catch (error) {
    console.error("ERROR canceling package subscription", error);
    res.status(500).json({ error: "Failed to cancel package subscription" });

}
}
const PrescriptionPayment = async (req, res) => {
  const { Username} = req.query;
  const { prescriptionId } = req.body;
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  try {
    const patient = await Patient.findOne({ Username});
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    const prescription = await Prescription.findOne({ _id: prescriptionId });
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

   
    const prescriptionPrice = prescription.Price;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Prescription Payment',
            },
            unit_amount: prescriptionPrice * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/Prescription/success`,
      cancel_url: `${process.env.CLIENT_URL}/Prescription/cancel`,
    });
    prescription.Paid = true;
    await prescription.save();
    return res.status(200).json({ message: 'Payment successful', url: session.url });
  
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const PayPackageCreditCard = async (req, res) => {
  const { Username} = req.query;
  const { packageId } = req.body;
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  try{
     const patient = await Patient.findOne({ Username });
      if(!patient){
        return res.status(404).json({ error: "Patient not found" });
      }
      const package = await Package.findOne({ _id: packageId });
      if(!package){
        return res.status(404).json({ error: "Package not found" });
      }
      const packagePrice = package.AnnualPrice;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Package Payment',
              },
              unit_amount: packagePrice * 100, // Amount in cents
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.CLIENT_URL}/Package`,
        cancel_url: `${process.env.CLIENT_URL}/Package`,
      });
      
      return res.status(200).json({ message: 'Payment successful', url: session.url });
  }
  catch(error){
    res.status(500).json({ error: error.message });
  }
}

const uploadDoc = async (req, res) => {
  const { Username } = req.query;
  const file = req.file;

  console.log(req.file);

  try {
    const user = await Patient.findOne({ Username });

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
  getPatients,
  addPatient,
  addFamilyMember,
  getFamilyMembers,
  searchDoctors,
  viewPrescription,
  filterPrescriptions,
  selectPrescription,
  filterAppointments,
  viewDoctors,
  addPackageToPatient,
  viewDoctorDetails,
  filterDoctors,
  viewPackageStatus,
  cancelPackageSubscription,
  viewDoctorAppointments,
  selectAppointment,
  requestFollowup,
  loginPatient,
  getWallet,
  payWallet,
  payWalletPackage,
  addPatientToPatient,
  PaymentMethod,
  getDocuments,
  removeDocuments,
  getRecords,
  getSchedule,
  getScheduleDoctor,
  getmyRecords,
  getmyPrescriptions,
  getPatientDetails,
  updatePassword,
  getAppDoctorPatient,
  rescheduleApp,
  getPatientDetailsID,
  payForPackage,
  addPackageToFamilyMember,
  payForFamilyMemberPackage,
  CancelPackageSubscriptionForFamilyMember,
  rescheduleAppointment,
  viewPrescriptionDetails,
  payForPrescription,
  selectAppointmentForFamily,
  getTimeSlots,
  viewPrescriptions,
  PrescriptionPayment,
  PayPackageCreditCard,
  uploadDoc,
  downloadPrescriptionPDF
};
