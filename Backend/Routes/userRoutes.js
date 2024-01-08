const express = require("express");
const { requireAuth } = require("../Middleware/authMiddleware");
const { localVariables } = require("../Middleware/authMiddleware");

const upload = require("../Upload");

const {
  signup,
  logout,
  login,
  changePassword,
  generateOTP,
  verifyOTP,
  resetPassword,
  getEmail,
} = require("../Controller/userController");

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.get("/logout", logout);
userRouter.put("/changePassword", requireAuth, changePassword);
userRouter.get("/generateOTP", localVariables, generateOTP);
userRouter.get("/verifyOTP", verifyOTP);
userRouter.put("/resetPassword", resetPassword);
userRouter.get("/getEmail", getEmail);

module.exports = userRouter;
