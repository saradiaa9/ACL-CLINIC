const express = require('express')
const upload = require("../Upload");

// patient routes
const {
  downloadPrescriptionPDF,
  payWalletPackage,
  viewPackageStatus,
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
  filterDoctors,
  viewDoctorDetails,
  getWallet,
  payWallet,
  cancelPackageSubscription,
  viewDoctorAppointments,
  selectAppointment,
  requestFollowup,
  PaymentMethod,
  addPatientToPatient,
  getDocuments,
  removeDocuments,
  getRecords,
  getSchedule,
  getScheduleDoctor,
  getmyRecords,
  getmyPrescriptions,
  getPatientDetails,
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
  updatePassword,
  getAppDoctorPatient,
  rescheduleApp,
  getPatientDetailsID,
  uploadDoc
  } = require("../Controller/patientController");

  const patientRouter = express.Router();

  // Patient routes
  patientRouter.get("/Patient/get", getPatients);
  patientRouter.post("/Patient/add", addPatient);
  patientRouter.get("/Patient/searchDoctor", searchDoctors);
  patientRouter.post("/Patient/addFamilyMember", addFamilyMember);
  patientRouter.get("/Patient/getFamilyMembers", getFamilyMembers);
  patientRouter.get("/Patient/viewDoctors", viewDoctors);
  patientRouter.post("/Patient/addPackageToPatient", addPackageToPatient);
  patientRouter.get("/Patient/getWallet", getWallet);
  patientRouter.post("/Patient/payWallet", payWallet);
  patientRouter.post("/Patient/payWalletPackage", payWalletPackage);
  patientRouter.post("/Patient/payForPackage", payForPackage);
  patientRouter.post("/Patient/addPackageToFamilyMember", addPackageToFamilyMember);
  patientRouter.post("/Patient/payForFamilyMemberPackage", payForFamilyMemberPackage);
  patientRouter.post("/Patient/CancelPackageSubscriptionForFamilyMember", CancelPackageSubscriptionForFamilyMember);
  patientRouter.post("/Patient/selectAppointmentForFamily", selectAppointmentForFamily);

  patientRouter.get("/Patient/viewPackageStatus", viewPackageStatus);
patientRouter.post("/Patient/CancelPackageSubscription", cancelPackageSubscription);
patientRouter.get("/Patient/viewDoctorAppointments", viewDoctorAppointments);
patientRouter.post("/Patient/selectAppointment", selectAppointment);
patientRouter.post("/Patient/requestFollowup", requestFollowup);
patientRouter.post("/Patient/PaymentMethod", PaymentMethod);
patientRouter.post("/Patient/addPatientToPatient", addPatientToPatient);
patientRouter.get("/Patient/getDocuments", getDocuments);
patientRouter.delete("/Patient/removeDocuments", removeDocuments);
patientRouter.get("/Patient/filterDoctors", filterDoctors);
patientRouter.get("/Patient/viewDoctorDetails", viewDoctorDetails);
patientRouter.get("/Patient/viewPrescription", viewPrescription);
patientRouter.get("/Patient/filterPrescriptions", filterPrescriptions);
patientRouter.get("/Patient/selectPrescription", selectPrescription);
patientRouter.get("/Patient/filterAppointments", filterAppointments);
patientRouter.get("/Patient/getRecords", getRecords);
patientRouter.get("/Patient/getSchedule", getSchedule);
patientRouter.get("/Patient/getScheduleDoctor", getScheduleDoctor);
patientRouter.get("/Patient/getmyRecords", getmyRecords);
patientRouter.get("/Patient/getmyPrescriptions", getmyPrescriptions);
patientRouter.get("/Patient/getPatientDetails", getPatientDetails);
patientRouter.post("/Patient/rescheduleAppointment", rescheduleAppointment);
patientRouter.post("/Patient/viewPrescriptionDetails", viewPrescriptionDetails);
patientRouter.post("/Patient/payForPrescription", payForPrescription);
patientRouter.post("/Patient/getTimeSlots", getTimeSlots);
patientRouter.get("/Patient/viewPrescriptions", viewPrescriptions);
patientRouter.post("/Patient/PrescriptionPayment", PrescriptionPayment);
patientRouter.post("/Patient/PayPackageCreditCard", PayPackageCreditCard);
patientRouter.put('/Patient/updatePassword', updatePassword);
patientRouter.get("/Patient/getPatientDetailsID", getPatientDetailsID);

patientRouter.put('/Patient/updatePassword', updatePassword);
patientRouter.get("/Patient/getAppDoctorPatient", getAppDoctorPatient);
patientRouter.post("/Patient/rescheduleApp", rescheduleApp);
patientRouter.post("/uploadDoc", upload.single("file"), uploadDoc);
patientRouter.get('/prescription/download/:PrescriptionId', downloadPrescriptionPDF);

module.exports = patientRouter;
