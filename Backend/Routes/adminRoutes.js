const express = require('express')
const {
  getAdmin,
  addAdmin,
  deleteAdmin,
  deletePatient,
  deleteDoctor,
  getAllNotDecidedDoctors,
  updateDoctorAcceptedById,
  addPackage,
  deletePackage,
  updatePackage,
  getPackage,
  getDoctor,
  acceptDoctor,
  rejectDoctor
} = require("../Controller/adminController");

  const adminRouter = express.Router();

adminRouter.get("/Admin/get", getAdmin);
adminRouter.post("/Admin/add", addAdmin);
adminRouter.delete("/Admin/delete", deleteAdmin);
adminRouter.delete("/Admin/deletePatient", deletePatient);
adminRouter.delete("/Admin/deleteDoctor", deleteDoctor);
adminRouter.get("/Admin/getAllNotDecidedDoctors", getAllNotDecidedDoctors);
adminRouter.put("/Admin/updateDoctorAcceptedById", updateDoctorAcceptedById);
adminRouter.post("/Admin/addPackage", addPackage);
adminRouter.put("/Admin/updatePackage", updatePackage);
adminRouter.delete("/Admin/deletePackage", deletePackage);
adminRouter.get("/Admin/getPackage", getPackage);
adminRouter.get("/Admin/getDoctor", getDoctor);
adminRouter.post("/Admin/acceptDoctor", acceptDoctor);
adminRouter.post("/Admin/rejectDoctor", rejectDoctor);

module.exports = adminRouter;
