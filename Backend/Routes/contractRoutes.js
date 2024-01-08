const express = require('express')

const { getContracts, addContracts } = require("../Controller/contractController")

const contractRouter = express.Router();

// Contract routes
contractRouter.get("/Contract/get", getContracts);
contractRouter.post("/Contract/add", addContracts);

module.exports = contractRouter;