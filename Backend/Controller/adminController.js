const Admin = require("../Models/admin");
const Patient = require("../Models/patient");
const Doctor = require("../Models/doctor");
const Package = require("../Models/package");
const bcrypt = require('bcrypt');

const { default: mongoose } = require("mongoose");

//get all Packages
const getPackage = async (req, res) => {
  try {
    const allPackages = await Package.find();
    res.status(200).json(allPackages);
  } catch (error) {
    console.log("ERROR retrieving Packages", error);
    res.status(400).json({ error: "Failed to retrieve Packages" });
  }
};
// get all admin
const getAdmin = async (req, res) => {
  try {
    const allAdmins = await Admin.find();
    res.status(200).json(allAdmins);
  } catch (error) {
    console.error("ERROR retrieving Admins", error);
    res.status(400).json({ error: "Failed to retrieve Admins" });
  }
};

const addAdmin = async (req, res) => {
  const { Username, Password } = req.body;

  try {
    // Hash the provided password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(Password, salt);

    // Create the admin with the hashed password
    const admin = await Admin.create({ Username, Password: hashedPassword });
    
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// delete admin by username
const deleteAdmin = async (req, res) => {
  //delete a admin from the database
  const { Username } = req.body; // Assuming you are passing the doctor username

  try {
    // Use the 'Package' model to find and remove the package by ID
    const deletedAdmin = await Admin.deleteMany({ Username });

    // Check if the package was found and deleted
    if (!deletedAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res
      .status(200)
      .json({ message: "Admin deleted successfully", deletedAdmin });
  } catch (error) {
    console.error("ERROR deleting admin", error);
    res.status(500).json({ error: "Failed to delete admin" });
  }
};

// delete patient by username
const deletePatient = async (req, res) => {
  const { Username } = req.body; // Assuming you are passing the Patient username
  try {
    const deletedPatient = await Patient.deleteMany({ Username });
    if (!deletedPatient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res
      .status(200)
      .json({ message: "Patient deleted successfully", deletedPatient });
  } catch (error) {
    console.error("ERROR deleting Patient", error);
    res.status(500).json({ error: "Failed to delete Patient" });
  }
};

// delete doctor by username
const deleteDoctor = async (req, res) => {
  const { Username } = req.body; // Assuming you are passing the Doctor username
  try {
    const deletedDoctor = await Doctor.deleteMany({ Username });
    if (!deletedDoctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res
      .status(200)
      .json({ message: "Doctor deleted successfully", deletedDoctor });
  } catch (error) {
    console.error("ERROR deleting Doctor", error);
    res.status(500).json({ error: "Failed to delete Doctor" });
  }
};

//get info doctor
const getDoctor = async (req, res) => {
  try {
    const { Username } = req.query;
    const doctor = await Doctor.find({
      Username: { $regex: new RegExp(Username, "i") },
    });
    console.log(doctor);
    res.status(200).json(doctor);
  } catch (error) {
    console.error("ERROR retrieving doctor", error);
    res.status(400).json({ error: "Failed to retrieve doctor" });
  }
};

// update doctor by id
const updateDoctorAcceptedById = async (req, res) => {
  try {
    const { Accepted } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(req.body.id, {
      Accepted,
    });
    res.status(200).json({ doctor });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

// get all doctor with Approved = not decided
const getAllNotDecidedDoctors = async (req, res) => {
  try {
    const doctor = await Doctor.find({ Accepted: "not decided" });
    res.status(200).json({ doctor });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

//add package
const addPackage = async (req, res) => {
  //Name, AnnualPrice, DoctorDiscount, MedicineDiscount, FamilyDiscount
  const {
    Name,
    AnnualPrice,
    DoctorDiscount,
    MedicineDiscount,
    FamilyDiscount,
  } = req.body;
  console.log(req.body);
  try {
    const pack = await Package.create({
      Name,
      AnnualPrice,
      DoctorDiscount,
      MedicineDiscount,
      FamilyDiscount,
    });
    res.status(200).json(pack);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete package by name
const deletePackage = async (req, res) => {
  //delete a package from the database
  const { Name } = req.body;

  try {
    // Use the 'Package' model to find and remove the package by ID
    const deletedPackage = await Package.deleteMany({ Name });

    // Check if the package was found and deleted
    if (!deletedPackage) {
      return res.status(404).json({ error: "Package not found" });
    }

    res
      .status(200)
      .json({ message: "Package deleted successfully", deletedPackage });
  } catch (error) {
    console.error("ERROR deleting package", error);
    res.status(500).json({ error: "Failed to delete package" });
  }
};

//update package by name
const updatePackage = async (req, res) => {
  try {
    const { OldName } = req.body;
    const updateFields = {};
    
    // Check if each field is present in the request body and add it to the updateFields object
    if (req.body.NewName) updateFields.Name = req.body.NewName;
    if (req.body.AnnualPrice) updateFields.AnnualPrice = req.body.AnnualPrice;
    if (req.body.DoctorDiscount) updateFields.DoctorDiscount = req.body.DoctorDiscount;
    if (req.body.MedicineDiscount) updateFields.MedicineDiscount = req.body.MedicineDiscount;
    if (req.body.FamilyDiscount) updateFields.FamilyDiscount = req.body.FamilyDiscount;
    
    const pack = await Package.findOneAndUpdate({ Name: OldName }, updateFields, {
      new: true, // Return the modified document rather than the original
    });
    
    res.status(200).json({ pack });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const acceptDoctor = async (req, res) => {
  try {
    const { Username } = req.body; // Assuming you are passing the doctor's Username to accept
    const doctor = await Doctor.findOneAndUpdate({ Username }, {
      Accepted: "accepted",
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.status(200).json({ doctor });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const rejectDoctor = async (req, res) => {
  try {
    const { Username } = req.body; // Assuming you are passing the doctor's Username to reject
    const doctor = await Doctor.findOneAndUpdate({ Username }, {
      Accepted: "rejected",
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.status(200).json({ doctor });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
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
  getDoctor,
  getPackage,
  acceptDoctor,
  rejectDoctor
};
