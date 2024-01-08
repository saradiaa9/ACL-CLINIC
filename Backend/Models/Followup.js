const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followupSchema = new Schema(
    {
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
          },
          patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
          },
          dateFrom: {
            type: Date,
            required: true,
          },
          status: {
            type: String,
            enum: ["Accepted", "Rejected", "Pending"],
            default: "Pending",
            },
        },
        { timestamps: true }
    );
   
const Followup = mongoose.model("Followup", followupSchema);

module.exports = Followup;