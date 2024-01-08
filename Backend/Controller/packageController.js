const Package = require("../Models/package.js");
const { default: mongoose } = require("mongoose");
const Patient = require("../Models/patient");
const FamilyMember = require("../Models/FamilyMember.js");
const Family = require("../Models/FamilyMember.js");

//get packages
const getPackages = async (req, res) => {
  try {
   
    const allPackages = await Package.find();
    res.status(200).json(allPackages);
  } catch (error) {
    console.error("ERROR retrieving packages", error);
    res.status(400).json({ error: "Failed to retrieve packages" });
  }
};

// get package by username
const getPackageByUsername = async (req, res) => {
  try {
    const { Username } = req.query; //take username
    const patient = await Patient.findOne({ Username });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const package = await Package.findOne({ _id: patient.Package._id });
    res.status(200).json(package);
  }
  catch (error) {
    res.status(500).json({ error: "Failed to get package" });
  }
};

const getFamilyMemberPackageByPatient = async (req, res) => {
  try {
    const { Username } = req.query;
    const { familyMember } = req.body;
    
    const patient = await Patient.findOne({ Username });
  
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const family = await FamilyMember.findOne({ Name: familyMember });
    if (!family) {
      return res.status(404).json({ error: "Family member not found" });
    }

    const familyPackageStatus = {
      Status: family.PackageStatus.Status,
      StartDate: family.PackageStatus.StartDate,
      EndDate: family.PackageStatus.EndDate,
      Activated: family.PackageStatus.Activated,
    };

    const familyPackage = await Package.findOne({ _id: family.Package });
    
    res.status(200).json({ familyPackage, familyPackageStatus });
  } catch (error) {
    res.status(500).json({ error: "Failed to get package and status" });
  }
};




// get package by name
const getPackageByName = async (req, res) => {
  const { Name } = req.body; //take package name

  try {
    const package = await Package.find({ Name });
    res.status(200).json(package);
  } catch (error) {
    res.status(500).json({ error: "Failed to get package" });
  }
};

// export functions
module.exports = {
  getPackages,
  getPackageByUsername,
  getPackageByName,
  getFamilyMemberPackageByPatient,
};
