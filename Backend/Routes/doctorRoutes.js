const express = require('express')

const upload = require("../Upload");

const {
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
    viewContract,
    acceptContract,
    addTimeSlots,
    scheduleFollowup,
    addRecords,
    getRecords,
    getTimeSlots,
    getDoctorDetails,
    getDoctorDetailsID,
    getDoctorSchedule,
    getDoctorRecords,
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
    getDoctorWallet,
    viewDoctorPrescription,
    filterAppointments,
    searchAppointments,
    getUpcomingPatients,
    cancelApp,
    getScheduleOfDoctor,
    getDocs,
    uploadDoc,
  } = require("../Controller/doctorController");

  const doctorRouter = express.Router();

  // Doctor routes
  doctorRouter.get("/Doctor/get", getDoctors);
  doctorRouter.put("/Doctor/update", updateDoctor);
  doctorRouter.post("/Doctor/add", addDoctor);
  doctorRouter.get("/Doctor/getMyPatients", getMyPatients);
  doctorRouter.get("/Doctor/getPatientByName", getPatientByName);
  doctorRouter.get("/Doctor/getPatientByUsername", getPatientByUsername);
  doctorRouter.get(
  "/Doctor/filterPatientsByUpcomingAppointments",
  filterPatientsByUpcomingAppointments
);

doctorRouter.get("/Doctor/selectPatientFromList", selectPatientFromList);
doctorRouter.put("/Doctor/addPatientToDoctor", addPatientToDoctor);
doctorRouter.get("/Doctor/getPatientFromDoctorList", getPatientFromDoctorList);
doctorRouter.get("/Doctor/getContract", viewContract);
doctorRouter.put("/Doctor/acceptContract", acceptContract);
doctorRouter.post("/Doctor/addSlots", addTimeSlots);
doctorRouter.post("/Doctor/scheduleFollowup", scheduleFollowup);
doctorRouter.post("/Doctor/addRecord", addRecords);
doctorRouter.get("/Doctor/getRecords", getRecords);
doctorRouter.get("/Doctor/getTimeSlots", getTimeSlots);
doctorRouter.post("/Doctor/rescheduleApp", rescheduleApp);
doctorRouter.post("/Doctor/addMedicine", addMedicine);
doctorRouter.post("/Doctor/deleteMedicine", deleteMedicine);
doctorRouter.post("/Doctor/addPrescription", addPrescription);
doctorRouter.post("/Doctor/updateDosage", updateDosage);
doctorRouter.post("/Doctor/updateBeforeSubmit", updateBeforeSubmit);
doctorRouter.post("/Doctor/submitToPharmacy", submitToPharmacy);
doctorRouter.get("/Doctor/getFollowup", getFollowups)
doctorRouter.post("/Doctor/acceptFollowup", acceptFollowup);
doctorRouter.post("/Doctor/rejectFollowup", rejectFollowup);
doctorRouter.get("/Doctor/getDocuments", getDocuments);
doctorRouter.delete("/Doctor/removeDocuments", removeDocuments);
doctorRouter.get("/Doctor/getDoctorDetails", getDoctorDetails);
doctorRouter.get("/Doctor/getSchedule", getDoctorSchedule);
doctorRouter.get("/Doctor/getRecords", getDoctorRecords);
doctorRouter.get("/Doctor/getWallet", getDoctorWallet);
doctorRouter.get("/Doctor/viewPrescription", viewDoctorPrescription);
doctorRouter.get("/Doctor/filterAppointments",filterAppointments)
doctorRouter.get("/Doctor/searchAppointments", searchAppointments)
doctorRouter.get("/Doctor/getUpcomingPatients", getUpcomingPatients)
doctorRouter.post("/Doctor/cancelApp", cancelApp)
doctorRouter.get("/Doctor/getDoctorDetailsID", getDoctorDetailsID);
doctorRouter.get("/Doctor/getScheduleOfDoctor", getScheduleOfDoctor);
doctorRouter.get("/Doctor/getDocs", getDocs);
doctorRouter.post("/uploadDoc", upload.single("file"), uploadDoc);


module.exports = doctorRouter;
