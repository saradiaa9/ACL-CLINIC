const express = require('express')

const { createNotification, getNotifications } = require("../Controller/notificationController")

const NotificationRouter = express.Router();

// Notification routes
NotificationRouter.post("/Notification/create", createNotification);
NotificationRouter.get("/Notification/get", getNotifications);

module.exports = NotificationRouter;