const jwt = require("jsonwebtoken");
const Admin = require("../Models/admin");
const Patient = require("../Models/patient");
const Doctor = require("../Models/doctor");
require("dotenv").config();


const localVariables = (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: null,
    username: null,
  };
  next();
};

const requireAuth = async (req, res, next) => {
  // verify authentication
  const authorization = req.headers.authorization;
  console.log("authorization: ", authorization);
  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // find user
    let user = await Admin.findOne({ Username: payload.username }).select(
      "Username"
    );

    if (user === null) {
      user = await Patient.findOne({ Username: payload.username }).select(
        "Username"
      );
    }

    if (user === null) {
      user = await Doctor.findOne({ Username: payload.username }).select(
        "Username"
      );
    }

    req.user = {
      Username: user.Username,
      UserType: user.constructor.modelName.toLowerCase(),
    };
    // console.log("req.user: ", req.user);
    next();
  } catch (error) {
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = {localVariables, requireAuth };
