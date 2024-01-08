const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const packageSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      unique: true,
    },
    AnnualPrice: {
      type: Number,
      required: true,
    },
    DoctorDiscount: {
      type: Number,
      required: true,
    },
    MedicineDiscount: {
      type: Number,
      required: true,
    },
    FamilyDiscount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);
module.exports = Package;
