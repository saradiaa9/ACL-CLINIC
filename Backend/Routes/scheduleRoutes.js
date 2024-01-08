const express = require("express");
const { requireAuth } = require("../Middleware/authMiddleware");

const {
  getSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  cancelAppointment
} = require("../Controller/scheduleController");

const scheduleRouter = express.Router();

// Schedule routes
scheduleRouter.get("/Schedule/getAll", getSchedules);
scheduleRouter.post("/Schedule/add", addSchedule);
scheduleRouter.put("/Schedule/update", updateSchedule);
scheduleRouter.delete("/Schedule/delete", deleteSchedule);
scheduleRouter.put("/Schedule/cancel", cancelAppointment);

module.exports = scheduleRouter;
