const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema(
  {
    //username, name, email, password, date of birth, gender, mobile number, emergency contact ( full name , mobile number)
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
    },
    Password: {
      type: String,
      required: true,
    },
    NationalID: { 
      type: Number,
      required: true,
      unique: true,
    },
    DateOfBirth: {
      type: Date,
      required: true,
    },
    Gender: {
      type: String,
      required: true,
    },
    MobileNumber: {
      type: Number,
      required: true,
    },
    Package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
    },
    PackageStatus: {
      Status: {
        type: String,
        enum: ["Subscribed", "Unsubscribed", "Cancelled"],
        default: "Unsubscribed",
      },
      StartDate: {
        type: Date,
      },
      EndDate: {
        type: Date,
      },
        Activated: {
        type: String,
           enum: ["Activated", "Not Activated"],
        default: "Not Activated",
      },
    },
    EmergencyContact: {
      Name: {
        type: String,
        required: true,
      },
      MobileNumber: {
        type: String,
        required: true,
      },
    },
    family: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "familyMember",
      },
    ],
    records: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Record",
      },
    ],
    prescription: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prescription",
      },
    ],
    Wallet : {
      type: Number,
      default: 0,
    },
    Docs: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;