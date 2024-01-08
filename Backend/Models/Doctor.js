const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema(
  {
    //username, name, email, password, date of birth, hourly rate, affiliation (hospital), educational background
    Username: {
      type: String,
      required: true,
      unique: true,
    },
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
    },
    Password: {
      type: String,
      required: true,
    },
    DateOfBirth: {
      type: Date,
      required: true,
    },
    HourlyRate: {
      type: Number,
      required: true,
    },
    Affiliation: {
      type: String,
      required: true,
    },
    EducationalBackground: {
      type: String,
      required: true,
    },
    Specialty: {
      type: String,
      required: true,
    },
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
    Accepted: {
      type: String,
      default: "not decided",
      enum: ["accepted", "rejected", "not decided"],
    },
    
    Wallet : {
      type: Number,
      default: 0,
    },
    Docs: {
      type: [String],
      required: true,
      default: [],
    },
    TimeSlots: [
      {
        type: Date,
      },
    ],
  },
  { timestamps: true }

);

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;