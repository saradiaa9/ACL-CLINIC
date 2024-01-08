const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contractSchema = new Schema(
  {
    // Doctor, Accepted, Details, Markup
    Doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      unique: true,
    },
    Accepted: {
      type: Boolean,
      required: true,
      default: false,
    },
    Details: {
      type: String,
      required: true,
    },
    Markup: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const contract = mongoose.model("contract", contractSchema);
module.exports = contract;
