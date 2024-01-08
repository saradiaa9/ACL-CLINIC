const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const validator = require("validator");
const otpGenerator = require("otp-generator");
const Mailgen = require("mailgen");
require("dotenv").config();
const employmentContract = require("../Models/employmentContract");
const Admin = require("../Models/admin");
const Patient = require("../Models/patient");
const Doctor = require("../Models/doctor");
const multer = require("multer");

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (username) => {
  return jwt.sign({ username }, process.env.JWT_SECRET_KEY, {
    expiresIn: maxAge,
  });
};

// sign up
const signup = async (req, res) => {
  const {
    Username,
    Password,
    UserType,
    Name,
    Email,
    DateOfBirth,
    Gender,
    MobileNumber,
    Prescription,
    HourlyRate,
    Affiliation,
    EducationalBackground,
    EmergencyContact,
    Specialty,
    NationalID
  } = req.body;

  try {
    if (!validator.isStrongPassword(Password)) {
      return res.status(400).json({
        error:
          "Password does not meet the requirements. It must have at least 1 capital letter, 1 number, and 1 symbol, and be at least 8 characters long.",
      });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(Password, salt);
    let user;
    switch (UserType) {
      case "admin":
        user = await Admin.create({
          Username: Username,
          Password: hashedPassword,
        });

        break;
      case "patient":
        user = await Patient.create({
          Username: Username,
          Password: hashedPassword,
          Name: Name,
          Email: Email,
          NationalID: NationalID,
          DateOfBirth: DateOfBirth,
          Gender: Gender,
          MobileNumber: MobileNumber,
          EmergencyContact: EmergencyContact,
          Prescription: Prescription,
        });

        break;
      case "doctor":
        user = await Doctor.create({
          Username: Username,
          Password: hashedPassword,
          Name: Name,
          Email: Email,
          DateOfBirth: DateOfBirth,
          HourlyRate: HourlyRate,
          Affiliation: Affiliation,
          EducationalBackground: EducationalBackground,
          Specialty: Specialty,
        });
        const contract = await employmentContract.create({
          Doctor: user,
          Details: "Details",
          Markup: "Markup",
        });
        console.log(contract);

        break;
      default:
        return res.status(400).json({ error: "Invalid user type" });
    }

    const token = createToken(user.Username);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({
      Username: user.Username,
      UserType: UserType,
      token: token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const findUserByUsername = async (username) => {
  let user = await Admin.findOne({ Username: username });
  let userType = "admin";

  if (user === null) {
    user = await Patient.findOne({ Username: username });
    userType = "patient";
  }

  if (user === null) {
    user = await Doctor.findOne({ Username: username });
    userType = "doctor";
  }

  return { user, userType };
};

const login = async (req, res) => {
  const { Username, Password } = req.body;
  try {
    // search for user in database of admin, patient, doctor
    const { user, userType } = await findUserByUsername(Username);

    if (Username === "" && Password === "") {
      return res.status(401).json({ error: "Empty fields" });
    }

    if (Username === "") {
      return res.status(401).json({ error: "Empty Username" });
    }

    if (Password === "") {
      return res.status(401).json({ error: "Empty Password" });
    }

    if (user === null) {
      return res.status(401).json({ error: "User Not Found" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(Password, user.Password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }
    // Generate a JWT token
    const token = createToken(user.Username);

    // Set the JWT token as a cookie for the client
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    // return username , userType , token

    res.status(200).json({
      Username: user.Username,
      UserType: userType,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = (req, res) => {
  // Clear the JWT cookie to log the user out
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logout successful" });
};

const changePassword = async (req, res) => {
  const { Username, Password, NewPassword } = req.body;

  try {
    // Retrieve the user's current password from the database
    const { user, userType } = await findUserByUsername(Username);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided current password with the stored hashed password

    const passwordMatch = await bcrypt.compare(Password, user.Password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    if (!validator.isStrongPassword(NewPassword)) {
      return res.status(400).json({
        error:
          "New password does not meet the requirements. It must have at least 1 capital letter, 1 number, 1 symbol, and be at least 8 characters long.",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(NewPassword, salt);
    console.log("hashedPassword");

    // Update the user's password in the database
    user.Password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const generateOTP = async (req, res) => {
  const { Username } = req.query;
  try {
    // Retrieve the user's current password from the database
    const { user, userType } = await findUserByUsername(Username);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const salt = await bcrypt.genSalt();
    const hashedOTP = await bcrypt.hash(otp, salt);

    req.app.locals.OTP = hashedOTP;
    req.app.locals.resetSession = Date.now() + 600000;
    req.app.locals.username = Username;

    let config = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    };

    let transporter = nodemailer.createTransport(config);

    let Mailgenerator = new Mailgen({
      theme: "salted",
      product: {
        name: "El7a2ny Clinic",
        link: "http://localhost:3000/",
        logo: "https://i.ibb.co/2kDDTxv/logo.png",
      },
    });

    let response = {
      body: {
        name: user.Name,
        intro: `Your OTP is: ${otp}`,
        outro: "Thank you for using our service!",
      },
    };

    let mail = Mailgenerator.generate(response);

    let message = {
      from: "El7a2ny Clinic",
      to: user.Email,
      subject: "OTP",
      html: mail,
    };

    transporter.sendMail(message, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res
        .status(201)
        .json({ message: "OTP is sent to your mail successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  const { Username, OTP } = req.query;
  try {
    if (Username !== req.app.locals.username) {
      return res.status(400).json({ error: "Incorrect username" });
    }

    if (req.app.locals.OTP === null) {
      return res.status(400).json({ error: "OTP not generated" });
    }

    if (req.app.locals.resetSession.expiry < Date.now()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    const otpMatch = await bcrypt.compare(OTP, req.app.locals.OTP);

    if (!otpMatch) {
      return res.status(400).json({ error: "Incorrect OTP" });
    }

    req.app.locals.OTP = null;
    req.app.locals.resetSession = null;
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { Password } = req.body;
  const Username = req.query.Username;

  try {
    // Retrieve the user's current password from the database
    const { user, userType } = await findUserByUsername(Username);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }


    if (Username !== req.app.locals.username) {
      return res.status(400).json({ error: "Incorrect username" });
    }

    if (!validator.isStrongPassword(Password)) {
      return res.status(400).json({
        error:
          "Password does not meet the requirements. It must have at least 1 capital letter, 1 number, and 1 symbol, and be at least 8 characters long.",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(Password, salt);

    // Update the user's password in the database
    user.Password = hashedPassword;
    await user.save();

    req.app.locals.username = null;

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmail = async (req, res) => {
  const { Username } = req.query;
  try {
    // Retrieve the user's current password from the database
    const { user, userType } = await findUserByUsername(Username);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ Email: user.Email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  signup,
  logout,
  login,
  changePassword,
  generateOTP,
  verifyOTP,
  resetPassword,
  getEmail,

};
