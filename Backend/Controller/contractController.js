const employmentContract = require("../Models/employmentContract.js");
const { default: mongoose } = require("mongoose");

//get contracts
const getContracts = async (req, res) => {
  try {
    const allContracts = await employmentContract.find();
    res.status(200).json(allContracts);
  } catch (error) {
    console.error("ERROR retrieving contracts", error);
    res.status(400).json({ error: "Failed to retrieve contracts" });
  }
};

//add contracts
const addContracts = async (req, res) => {
  //Doctor, Details, Markup
  const { Doctor, Details, Markup } = req.body;
  console.log(req.body);
  try {
    const contract = await employmentContract.create({
      Doctor,
      Details,
      Markup,
    });
    res.status(200).json(contract);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getContracts,
  addContracts,
};
