const express = require("express");
//const { requireAuth } = require("../Middleware/authMiddleware");

const {
    getChat,
    sendPatientChat,
    sendDoctorChat,
} = require("../Controller/chatController");

const chatRouter = express.Router();

chatRouter.get("/Chat/getChat", getChat);
chatRouter.post("/Chat/sendPatientChat", sendPatientChat);
chatRouter.post("/Chat/sendDoctorChat", sendDoctorChat);

module.exports = chatRouter;