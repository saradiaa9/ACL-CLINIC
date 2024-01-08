//Schedule.js
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const scheduleSchema = new Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      
    },
    family:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "familyMember",
      
    }
    ,
    dateFrom: {
      type: Date,
      required: true,
    },
    dateTo: {
      type: Date,
      default: function () {
        const dateFrom = this.dateFrom || new Date(); // Use the provided dateFrom or current date
        return new Date(dateFrom).setHours(new Date(dateFrom).getHours() + 1);
      },
    },

    status: {
      type: String,
      enum: ["Upcoming", "Completed", "Cancelled", "Rescheduled"],
      default: function () {
        return new Date() < this.dateFrom ? "Upcoming" : "Completed";
      },
    },
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
