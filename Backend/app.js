//requires
const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const fs = require("fs");
const uploadPath = "../frontend/public/Documents/MedicalID";
const doctorFolder = "../frontend/public/Documents/MedicalID";
require("dotenv").config();

const adminRouter = require("./Routes/adminRoutes")
const contractRouter = require("./Routes/contractRoutes")
const doctorRouter = require("./Routes/doctorRoutes")
const packageRouter = require("./Routes/packageRoutes")
const patientRouter = require("./Routes/patientRoutes")
const scheduleRouter = require("./Routes/scheduleRoutes")
const userRouter = require("./Routes/userRoutes");
const notificationRouter = require("./Routes/notificationRoutes");
const chatRouter = require("./Routes/chatRoutes");

//Variables
const app = express();
const port = process.env.PORT || 4000;

//Connect to db
mongoose
  .connect(process.env.MONGO_URI) //connect to mongodb
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

//Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Assuming req.body.username contains the patient's username
    const username = req.query.username;

    // Set the path to the specific user's folder
    const userFolder = path.join('../frontend/public/Documents/MedicalHistory', username);

    // Create the folder if it doesn't exist
    require('fs').mkdirSync(userFolder, { recursive: true });

    cb(null, userFolder);
  },
  filename: function (req, file, cb) {
    // Assuming req.query.username contains the patient's username
    const username = req.query.username;

    // Check file mimetype
    if (
      file.mimetype !== 'application/pdf' &&
      file.mimetype !== 'image/jpeg' &&
      file.mimetype !== 'image/png' &&
      file.mimetype !== 'image/jpg'
    ) {
      return cb(new Error('Only pdfs or jpeg or jpg or png are allowed'));
    }

    // Set the base filename
    let baseFilename = `${file.originalname}`;

    // Function to check for duplicate filenames
    const checkAndAppendNumber = (filename, number) => {
      const finalFilename = number > 0 ? `${filename}(${number})` : filename;
      if (fs.existsSync(path.join(userFolder, `${finalFilename}`))) {
        return checkAndAppendNumber(baseFilename, number + 1);
      }
      return finalFilename;
    };

    // Set the final filename
    const finalFilename = checkAndAppendNumber(baseFilename, 0);

    // Use the final filename
    cb(null, `${finalFilename}`);
  },
});
const upload = multer({ storage });

// Routes
app.post("/Patient/upload", upload.single('file'), (req, res) => {
  console.log(req.file);
  console.log(req.query);
  console.log(req.query.username)
  
  res.send('File uploaded!');
});

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    // Assuming req.body.username contains the patient's username
    const username = req.query.username;

    // Set the path to the specific user's folder
    const userFolder = path.join('../frontend/public/Documents/MedicalHistory', username);

    // Create the folder if it doesn't exist
    require('fs').mkdirSync(userFolder, { recursive: true });

    cb(null, userFolder);
  },
  filename: function (req, file, cb) {
    // Assuming req.query.username contains the patient's username
    const username = req.query.username;

    // Check file mimetype
    if (
      file.mimetype !== 'application/pdf' &&
      file.mimetype !== 'image/jpeg' &&
      file.mimetype !== 'image/png' &&
      file.mimetype !== 'image/jpg'
    ) {
      return cb(new Error('Only pdfs or jpeg or jpg or png are allowed'));
    }

    // Set the base filename
    let baseFilename = `${file.originalname}`;

    // Function to check for duplicate filenames
    const checkAndAppendNumber = (filename, number) => {
      const finalFilename = number > 0 ? `${filename}(${number})` : filename;
      if (fs.existsSync(path.join(userFolder, `${finalFilename}`))) {
        return checkAndAppendNumber(baseFilename, number + 1);
      }
      return finalFilename;
    };

    // Set the final filename
    const finalFilename = checkAndAppendNumber(baseFilename, 0);

    // Use the final filename
    cb(null, `${finalFilename}`);
  },
});


// Routes
app.post("/Patient/upload", upload.single('file'), (req, res) => {
  console.log(req.file);
  console.log(req.query);
  console.log(req.query.username)
  
  res.send('File uploaded!');
});

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    // Assuming req.body.username contains the patient's username
    const username = req.query.username;

    // Set the path to the specific user's folder
    const doctorFolder = path.join(__dirname, "../frontend/public");

    // Create the folder if it doesn't exist
    require("fs").mkdirSync(doctorFolder, { recursive: true });

    cb(null, doctorFolder);
  },
  filename: function (req, file, cb) {
    // Assuming req.query.username contains the patient's username
    const username = req.query.username;

    // Check file mimetype
    if (
      file.mimetype !== "application/pdf" &&
      file.mimetype !== "image/jpeg" &&
      file.mimetype !== "image/png" &&
      file.mimetype !== "image/jpg"
    ) {
      return cb(new Error("Only pdfs or jpeg or jpg or png are allowed"));
    }

    // Set the base filename
    let baseFilename = `${file.originalname}`;

    // Function to check for duplicate filenames
    const checkAndAppendNumber = (filename, number) => {
      const finalFilename = number > 0 ? `${filename}(${number})` : filename;
      if (fs.existsSync(path.join(doctorFolder, `${finalFilename}`))) {
        return checkAndAppendNumber(baseFilename, number + 1);
      }
      return finalFilename;
    };

    // Set the final filename
    const finalFilename = checkAndAppendNumber(baseFilename, 0);

    // Use the final filename
    cb(null, `${finalFilename}`);
  },
});

const upload1 = multer({ storage1 });

// Routes
// app.post("/Doctor/upload", upload1.array("file", 3), (req, res) => {
//   console.log(req.file);
//   console.log(req.query);
//   console.log(req.query.username);

//   res.send("File uploaded!");
// })
//Routes
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../frontend/uploads"))
);
app.use(adminRouter);
app.use(contractRouter);
app.use(doctorRouter);
app.use(packageRouter);
app.use(patientRouter);
app.use(scheduleRouter);
app.use(userRouter);
app.use(notificationRouter);
app.use(chatRouter);

