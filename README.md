# ABC-Stack-Clinic 

## Motivation
ABC-Stack Clinic Management System is a comprehensive software solution built on the MERN stack (MongoDB, Express.js, React, Node.js) with a user-friendly interface provided by Chakra UI. The system is designed to streamline clinic operations, enhance patient experience, and facilitate efficient communication and coordination among patients, doctors, and administrators.

## Build Status
### Passing
All methods in the backend and the pages created in the frontend are running correctly.

## Code Style

This project adheres to a set of coding conventions and style guidelines to ensure consistency and maintainability. Please follow these guidelines when contributing to or maintaining the codebase.

### General Guidelines

- **Consistency:** Keep naming conventions consistent throughout the codebase.
- **Indentation:** Use two spaces for indentation.
- **Comments:** Include comments for complex sections or where additional clarity is needed.
- **Error Handling:** Always use try-catch blocks for asynchronous operations.

### Naming Conventions

- **Variables and Functions:** Use camelCase (e.g., `getPackage`, `deleteAdmin`).
- **Classes:** Use PascalCase (e.g., `class MyClass`).

### File Structure

- Group related files together in appropriate directories.
- Maintain a clean and organized directory structure.

### ES6 Features

- Leverage ES6 features such as destructuring assignment, arrow functions, and template literals.

### Spacing

- Use consistent spacing around operators and after commas.

### Example

#### javascript
- const Admin = require("../Models/admin");
- const Patient = require("../Models/patient");
- const Doctor = require("../Models/doctor");
- const Package = require("../Models/package");
- const { default: mongoose } = require("mongoose");

## Screenshots
![759563af-af08-47b7-8636-b002fbd324f6](https://github.com/advanced-computer-lab-2023/ABC-Stack-Clinic/assets/119500151/78cec469-d5b7-4f57-8911-0ebd55ff2a27)
![React App - Google Chrome 2023-12-15 17-52-42 - frame at 1m45s](https://github.com/advanced-computer-lab-2023/ABC-Stack-Clinic/assets/119500151/e45cb310-a6cc-4017-b70a-4db6238ea456)
![React App - Google Chrome 2023-12-15 17-52-42 - frame at 0m2s](https://github.com/advanced-computer-lab-2023/ABC-Stack-Clinic/assets/119500151/5864c41b-2170-4a64-b1d0-60ddba43456a)
![React App - Google Chrome 2023-12-14 22-42-14 - frame at 0m7s](https://github.com/advanced-computer-lab-2023/ABC-Stack-Clinic/assets/119500151/c85ae6ed-ad7f-459f-beb7-31a9626b998b)

## Tech/Framework used
- MongoDB
- Express.js
- React (with Chakra UI)
- Node.js
- Figma

## Features

### Patient Registration
- Register as a patient with username, name, email, password, date of birth, gender, mobile number, and emergency contact (full name, mobile number).

### Document Management
- Upload/remove medical history documents in PDF, JPEG, JPG, and PNG formats.

### Doctor Registration
- Submit a request to register as a doctor with username, name, email, password, date of birth, hourly rate, affiliation (hospital), and educational background.
- Upload required documents such as ID, medical licenses, and medical degree.

### Authentication
- Login with username and password.
- Logout.

### Administrator Functions
- Add another administrator with a set username and password.
- Remove a doctor, patient, or administrator from the system.

### Doctor Approval
- View all information uploaded by a doctor to apply to join the platform.
- Accept or reject the request of a doctor to join the platform.

### Health Packages
- Add/update/delete health packages with different price ranges (silver, gold, platinum) based on services included.

### Account Management
- Change password.
- Reset a forgotten password through OTP sent to email.
- Edit/update email, hourly rate, or affiliation (hospital).

### Doctor Registration Management
- Accept a request for the registration of a doctor.
- View and accept the employment contract.

### Appointment Management
- Add available time slots for appointments.
- Schedule follow-ups for patients.

### Family Management
- Add family members with name, National ID, age, gender, and relation to the patient.
- Link another patient's account as a family member using email or phone number, stating the relation to the patient.

### Payment Integration
- Choose to pay for appointments using a wallet or credit card.
- Enter credit card details and pay for appointments using Stripe.

### Family Health Package
- Subscribe to a health package for yourself and family members.
- Choose to pay for the health package using a wallet or credit card.

### Appointment and Health Package Tracking
- View all upcoming and past appointments.
- Filter appointments by date/status.
- View subscribed health packages for yourself and your family members.

### Patient Interaction
- View a list of all patients.
- Search for a patient by name.
- Filter patients based on upcoming appointments.

### Doctor Interaction
- View a list of all doctors with their specialties and session prices.
- Search for a doctor by name and/or specialty.
- Filter a doctor by specialty and/or availability on a certain date and time.

### Appointment Booking
- Select an appointment date and time for yourself or family members.
- Receive notifications of appointments through the system and email.

### Appointment Management
- View a list of all upcoming/past appointments.
- Filter appointments by date or status.
- Reschedule or cancel appointments for yourself, family members, or patients.
- Receive notifications for appointment changes or cancellations.

### Follow-Up Sessions
- Schedule follow-ups for patients.
- Accept or revoke follow-up session requests.

### Prescription Management
- Add/delete medicine to/from prescriptions from the pharmacy platform.
- Add/update dosage for each medicine.
- View a list of all prescriptions.
- Filter prescriptions based on date, doctor, or filled/unfilled.

### Wallet and Refunds
- Receive a refund in the wallet when a doctor cancels an appointment.
- View the amount in the wallet.

### Communication
- Chat with doctors or patients.
- Start/end video calls with doctors or patients.

## Code Examples
### Doctor
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
    res.status(200).json(updatedPrescription); } 
    catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to delete medicine" });}};

### Patient
    const viewPrescription = async (req, res) => {
    // Get the patient's username from the request parameters or body
    const { Username } = req.body;
    
    try {
    // Find the patient by username
    const patient = await Patient.findOne({ Username }).populate("prescription");
    
    // If patient not found
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // If the patient has a prescription, return it
    if (patient.prescription) {
      res.status(200).json(patient.prescription);
    } else {
      res.status(404).json({ error: "Patient does not have a prescription" });
    } } catch (error) {
    console.error("ERROR viewing prescription", error);
    res.status(500).json({ error: "Failed to view prescription" }); } };

  
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
    res.status(200).json(filteredAppointments);  } 
    catch (error) {
    console.error("ERROR filtering appointments", error);
    res.status(500).json({ error: "Failed to filter appointments" }); }};

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

    res.status(200).json({populatedPrescription});  } 
    catch (error) {
    console.error("ERROR getting prescriptions", error);
    res.status(500).json({ error: "Failed to get prescriptions" }); }};

## Installation

To run this project locally, follow these steps:

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/advanced-computer-lab-2023/ABC-Stack-Clinic
    ```

2. **Navigate to the project directory:**
   open 2 terminals
    ```bash
    cd frontend
    ```
    ```bash
    cd backend
    ```

3. **Install server/client dependencies:**

    ```bash
    npm install
    ```

4. **Configure environment variables:**

    Create a `.env` file in the root of the `server` directory and add necessary environment variables.
   
6. **Run the development server:**

    in frontend terminal
    ```bash
    npm start  
    ```
    in backend terminal
     ```bash
    npm App.js  
    ```

7. **Access the application:**

    Open your web browser and go to [http://localhost:3000](http://localhost:3000) to access the application.

**Notes:**

- Make sure you have Node.js and npm installed on your machine.
- MongoDB should be installed and running locally or configured appropriately in your environment variables.

## API Refrences

### Admin Routes
- adminRouter.get("/Admin/get", getAdmin);
- adminRouter.post("/Admin/add", addAdmin);
- adminRouter.delete("/Admin/delete", deleteAdmin);
- adminRouter.delete("/Admin/deletePatient", deletePatient);
- adminRouter.delete("/Admin/deleteDoctor", deleteDoctor);
- adminRouter.get("/Admin/getDoctor", getDoctor);
= adminRouter.get("/Admin/getAllNotDecidedDoctors", getAllNotDecidedDoctors);
- adminRouter.put("/Admin/updateDoctorAcceptedById", updateDoctorAcceptedById);
- adminRouter.post("/Admin/addPackage", addPackage);
- adminRouter.put("/Admin/updatePackage", updatePackage);
- adminRouter.delete("/Admin/deletePackage", deletePackage);
- adminRouter.get("/Admin/getPackage", getPackage);

### Contract Routes
- contractRouter.get("/Contract/get", getContracts);
- contractRouter.post("/Contract/add", addContracts);

### Doctor Routes
- doctorRouter.get("/Doctor/get", getDoctors);
- doctorRouter.put("/Doctor/update", updateDoctor);
- doctorRouter.post("/Doctor/add", addDoctor);
- doctorRouter.get("/Doctor/getMyPatients", getMyPatients);
- doctorRouter.get("/Doctor/getPatientByName", getPatientByName);
- doctorRouter.get("/Doctor/getPatientByUsername", getPatientByUsername);
- doctorRouter.get("/Doctor/filterPatientsByUpcomingAppointments",filterPatientsByUpcomingAppointments);
- doctorRouter.get("/Doctor/getWallet", getWallet);
- doctorRouter.get("/Doctor/selectPatientFromList", selectPatientFromList);
- doctorRouter.put("/Doctor/addPatientToDoctor", addPatientToDoctor);
- doctorRouter.get("/Doctor/getPatientFromDoctorList", getPatientFromDoctorList);
- doctorRouter.get("/Doctor/getContract", viewContract);
- doctorRouter.put("/Doctor/acceptContract", acceptContract);
- doctorRouter.post("/Doctor/addSlots", addTimeSlots);
- doctorRouter.post("/Doctor/scheduleFollowup", scheduleFollowup);
- doctorRouter.get("/Doctor/getSchedule", getScheduleOfDoctor);
- doctorRouter.post("/Doctor/addRecord", addRecords);
- doctorRouter.get("/Doctor/getRecords", getRecords);
- doctorRouter.get("/Doctor/getTimeSlots", getTimeSlots);
- doctorRouter.post("/Doctor/rescheduleApp", rescheduleApp);
- doctorRouter.post("/Doctor/addMedicine", addMedicine);
- doctorRouter.post("/Doctor/deleteMedicine", deleteMedicine);
- doctorRouter.post("/Doctor/addPrescription", addPrescription);
- doctorRouter.post("/Doctor/updateDosage", updateDosage);
- doctorRouter.post("/Doctor/updateBeforeSubmit", updateBeforeSubmit);
- doctorRouter.post("/Doctor/submitToPharmacy", submitToPharmacy);
- doctorRouter.get("/Doctor/getFollowup", getFollowups)
- doctorRouter.post("/Doctor/acceptFollowup", acceptFollowup);
- doctorRouter.post("/Doctor/rejectFollowup", rejectFollowup);
- doctorRouter.get("/Doctor/getDocuments", getDocuments);
- doctorRouter.delete("/Doctor/removeDocuments", removeDocuments);
- doctorRouter.get("/Doctor/getDoctorDetails", getDoctorDetails);
- doctorRouter.get("/Doctor/getSchedule", getDoctorSchedule);
- doctorRouter.get("/Doctor/getRecords", getDoctorRecords);
- doctorRouter.get("/Doctor/filterAppointments",filterAppointments)
- doctorRouter.get("/Doctor/searchAppointments", searchAppointments)
- doctorRouter.get("/Doctor/getUpcomingPatients", getUpcomingPatients)

### Package Routes

- packageRouter.get("/Package/get", getPackages);
- packageRouter.get("/Package/getByUsername", getPackageByUsername);
- packageRouter.get("/Package/getByName", getPackageByName);

### Patient Routes
- patientRouter.get("/Patient/get", getPatients);
- patientRouter.post("/Patient/add", addPatient);
- patientRouter.get("/Patient/searchDoctor", searchDoctors);
- patientRouter.post("/Patient/addFamilyMember", addFamilyMember);
- patientRouter.get("/Patient/getFamilyMembers", getFamilyMembers);
- patientRouter.get("/Patient/viewDoctors", viewDoctors);
- patientRouter.post("/Patient/addPackageToPatient", addPackageToPatient);
- patientRouter.get("/Patient/getWallet", getWallet);
- patientRouter.post("/Patient/payWallet", payWallet);
- patientRouter.get("/Patient/viewPackageStatus", viewPackageStatus);
- patientRouter.post("/Patient/cancelPackageSubscription", cancelPackageSubscription);
- patientRouter.get("/Patient/viewDoctorAppointments", viewDoctorAppointments);
- patientRouter.post("/Patient/selectAppointment", selectAppointment);
- patientRouter.post("/Patient/requestFollowup", requestFollowup);
- patientRouter.put("/Patient/PaymentMethod", PaymentMethod);
- patientRouter.put("/Patient/addPatientToPatient", addPatientToPatient);
- patientRouter.get("/Patient/getDocuments", getDocuments);
- patientRouter.delete("/Patient/removeDocuments", removeDocuments);
- patientRouter.get("/Patient/filterDoctors", filterDoctors);
- patientRouter.get("/Patient/viewDoctorDetails", viewDoctorDetails);
- patientRouter.get("/Patient/viewPrescription", viewPrescription);
- patientRouter.get("/Patient/filterPrescriptions", filterPrescriptions);
- patientRouter.get("/Patient/selectPrescription", selectPrescription);
- patientRouter.get("/Patient/filterAppointments", filterAppointments);
- patientRouter.get("/Patient/getRecords", getRecords);
- patientRouter.get("/Patient/getSchedule", getSchedule);
- patientRouter.get("/Patient/getScheduleDoctor", getScheduleDoctor);
- patientRouter.get("/Patient/getmyRecords", getmyRecords);
- patientRouter.get("/Patient/getmyPrescriptions", getmyPrescriptions);
- patientRouter.get("/Patient/getPatientDetails", getPatientDetails);

### Schedule Routes
- scheduleRouter.get("/Schedule/getAll", getSchedules);
- scheduleRouter.post("/Schedule/add", addSchedule);
- scheduleRouter.put("/Schedule/update", updateSchedule);
- scheduleRouter.delete("/Schedule/delete", deleteSchedule);

### User Routes
- userRouter.post("/signup", signup);
- userRouter.post("/login", login);
- userRouter.get("/logout", logout);
- userRouter.post("/changePassword", requireAuth, changePassword);

## Tests

The system was tested using Postman to ensure the validation of the APIs.
Using the routes provided above just add the required input such as (Username or Name) using (body or query) to access the required method and fetch the results needed.
Testing was done on all routes and methods (get, put, post, delete).

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://god.gw.postman.com/run-collection/30362515-b9731ebd-f900-41c6-8938-4faad87f10c7?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D30362515-b9731ebd-f900-41c6-8938-4faad87f10c7%26entityType%3Dcollection%26workspaceId%3D19444b7a-3aaa-4b61-b663-aeb2fa7e9798)

## How to Use 

Follow the steps below to use the ABC-Stack Clinic Management System effectively:

1. **Patient Registration:**
   - Begin by registering as a patient. Complete the registration form with your username, name, email, password, date of birth, gender, mobile number, and emergency contact details (full name, mobile number, relation to the patient).

2. **Doctor Registration:**
   - If you are a medical doctor, submit a request to register using the doctor registration form. Provide your username, name, email, password, date of birth, hourly rate, and affiliation (hospital). Upload the required documents such as ID, medical license, and medical degree.

3. **Administrator Functions:**
   - Admins can add other administrators, remove doctors, patients, or admins, view doctor applications, and accept or reject doctor requests.

4. **Authentication:**
   - Log in with your username and password to access the clinic's dashboard.

5. **Profile Management:**
   - Change your password and reset a forgotten password through OTP sent to your email.

6. **Health Packages:**
   - Add, update, or delete health packages with different price ranges depending on the services included in each package (e.g., silver, gold, platinum).

7. **Appointment Scheduling:**
   - Add your available time slots for appointments. Patients can view available time slots, select a doctor, and schedule an appointment.

8. **Patient Management:**
   - Add family members and link other patients' accounts as family members using their email or phone number. View a list of all patients, search for patients by name, and filter patients based on upcoming appointments.

9. **Prescriptions and Medications:**
   - View all new and old prescriptions and their statuses (filled/not filled). Add, update, or delete medicine prescriptions from the pharmacy platform. View health records and information of patients registered with you.

10. **Health Package Subscriptions:**
    - Subscribe to health packages for yourself and your family members. Choose to pay using your wallet or credit card.

11. **Appointment Management:**
    - View a list of all your upcoming and past appointments. Filter appointments by date or status (upcoming, completed, canceled, rescheduled). Reschedule or cancel appointments.

12. **Follow-Ups and Video Calls:**
    - Schedule follow-ups for patients. Start/end video calls with patients or other doctors.

13. **Wallet and Notifications:**
    - View the amount in your wallet. Receive a refund in your wallet when a doctor cancels an appointment. Receive notifications about appointment changes.

14. **Communication:**
    - Chat with patients and other doctors.

Remember to explore all the features provided by the ABC-Stack Clinic Management System to streamline clinic operations and enhance patient care.

For more detailed information and specific functionalities, refer to the relevant sections in the documentation.

## Contribute

Thank you for considering contributing to the ABC-Stack project! Contributions are essential for improving the project and making it better.

### How to Contribute

1. **Fork the Repository:**
   - Fork the [ABC-Stack repository](https://github.com/advanced-computer-lab-2023/ABC-Stack-Clinic) on GitHub.

2. **Clone the Repository:**
   - Clone the forked repository to your local machine.

    ```bash
    git clone https://github.com/advanced-computer-lab-2023/ABC-Stack-Clinic
    ```
    
3. **Create a New Branch:**
   - Create a new branch for the feature/bug fix you're working on.

    ```bash
    git checkout -b feature/your-feature
    ```

4. **Make Changes:**
   - Make your changes to the codebase. Ensure your changes adhere to the coding standards and style guide.

5. **Commit Changes:**
   - Commit your changes with a descriptive commit message.

    ```bash
    git commit -m "Add your descriptive commit message here"
    ```

6. **Push Changes:**
   - Push your changes to the branch on your forked repository.

    ```bash
    git push origin feature/your-feature
    ```

7. **Create a Pull Request (PR):**
   - Create a Pull Request from your forked repository to the original El7a2ny repository.

8. **Review and Merge:**
   - Participate in the discussion if any feedback is given.
   - Once approved, your changes will be merged into the main branch.

Thank you for contributing to ABC-Stack! Your help is greatly appreciated.

## Credits

- [Academind](https://www.youtube.com/channel/UC29ju8bIPH5as8OGnQzwJyA)
  - Node.js Beginner Playlist: [Link](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_uZs4vJMIhcinABSTUH2bY)
  - Express.js Tutorial: [Link](https://www.youtube.com/watch?v=fgTGADljAeg)
  - React Beginner Playlist: [Link](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_NT5zPVp18nGe_W9LqBDQK)
  - React Hooks and Functional Components Playlist: [Link](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH8EtggFGERCwMY5u5hOjf-h)
  - useState VS useEffect Article: [Link](https://codedamn.com/news/reactjs/usestate-and-useeffect-hooks)

- [Traversy Media](https://www.youtube.com/channel/UCW5YeuERMmlnqo4oq8vwUpg)
  - JWT Authentication Playlist: [Link](https://www.youtube.com/watch?v=mbsmsi7l3r4)
  - MERN Stack Authentication Tutorial: [Link](https://dev.to/salarc123/mern-stack-authentication-tutorial-part-1-the-backend-1c57)

- [Academind](https://www.youtube.com/channel/UC29ju8bIPH5as8OGnQzwJyA)
  - Stripe API Tutorial: [Link](https://youtu.be/1r-F3FIONl8)

- [Academind](https://www.youtube.com/channel/UC29ju8bIPH5as8OGnQzwJyA)
  - To be a Good Developer Playlist: [Link](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_ma_XO-GLSpL9L06ii4mAp)
  - Tests Playlist: [Link](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_63f0HH-dUtkininO7GO6f)

## License

This project is licensed under the Apache License 2.0 and MIT.

### Apache License 2.0 Description

The Apache License 2.0 is a permissive open-source license written by the Apache Software Foundation. It allows users to use the software for any purpose, to distribute it, to modify it, and to distribute modified versions of the software under the terms of the license. This license provides an express grant of patent rights from contributors to users and includes a limitation of liability. It is a widely used license in the open-source community, promoting collaboration and innovation.

### MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so.


