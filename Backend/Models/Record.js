const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recordSchema = new Schema(
  {
    //record
    Description: {
      type: String,
      required: true,
    },
    DoctorUsername: {
        type: String,
        required: true
    },
    PatientUsername: {
      type: String,
      required: true
    }
  }, { timestamps: true });
  
  const Record = mongoose.model('Record', recordSchema);
  module.exports = Record;
