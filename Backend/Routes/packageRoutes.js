const express = require('express');
const { requireAuth } = require("../Middleware/authMiddleware");

const {
  getPackages,
  getPackageByUsername,
  getPackageByName,
  getFamilyMemberPackageByPatient
} = require("../Controller/packageController");

const packageRouter = express.Router();

// Package routes
packageRouter.get("/Package/get", getPackages);
packageRouter.get("/Package/getByUsername", getPackageByUsername);
packageRouter.get("/Package/getByName", getPackageByName);
packageRouter.post("/Package/getFamilyMemberPackageByPatient",getFamilyMemberPackageByPatient)

module.exports = packageRouter;
