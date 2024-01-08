const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
    //Patient chatting with pharmacist using both their usernames
    {
        Patient: {
            type: String,
            ref: "Patient",
            required: true,
            unique: true,
        },
        Doctor: {
            type: String,
            ref: "Pharmacist",
            required: true,
            unique: true,
        },
        Messages: [
            {
            // the sender could be either the patient or the pharmacist
                Sender: {
                    type: String,
                    //required: true,
                },
                Message: {
                    type: String,
                    //required: true,
                },
                Time: {
                    type: Date,
                    //required: true,
                },
            },
        ],
    },
    { timestamps: true }
    );

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;