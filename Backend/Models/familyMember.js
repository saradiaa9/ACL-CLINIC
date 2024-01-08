const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const familySchema = new Schema(
  {
    //name, National ID, age, gender and relation to the patient
    Name: {
      type: String,
      required: true,
    },
    Username: {
      type: String,
      unique: true,
    },
    NationalID: {
      type: Number,
      required: true,
      unique: true,
    },
    Age: {
      type: Number,
      required: true,
    },
    Gender: {
      type: String,
      required: true,
    },
    Relation: {
      type: String,
      required: true,
      // validate relation to be only 1 of these 6: Husband, Wife , Son , Daughter
      enum: ["Husband", "Wife", "Son", "Daughter"],
      // match: /^(Husband|Wife|Son|Daughter)$/,
    },
    records: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Record",
      },
    ],
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
  },
  { timestamps: true }
);

const Family = mongoose.model("Family", familySchema);
module.exports = Family;
