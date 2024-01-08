const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema(
  {
    //medicine, dosage
    Medicine: [
      {
        Name: {
          type: String,
          required: true,
        },
        Dosage: {
          type: Number,
          required: true,
        },
      },
    ],
    Paid:{
      type:Boolean,
      default:false,
    },
    Price:{
      type:Number,
      
      
    },
    
    DoctorUsername: {
      type: String,
      required: true,
    },
    PatientUsername: {
      type: String,
      required: true,
    },
    DateP: {
      type: Date,
      required: true,
    },
    Filled: {
      type: Boolean,
      default: false,
    },
    Submitted: {
      type: Boolean,
      default: false,
    },

    
    

    
  },
  
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = Prescription;
