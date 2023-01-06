const express = require("express");
const { registerUser, userLogin, getAllUserData, getUserData, editUserData } = require("../controllers/userController");
const userRouter = express.Router();
const auth = require("../middleware/auth");

userRouter.post("/register", registerUser);
userRouter.post("/login", userLogin);
userRouter.get("/user", getAllUserData);
userRouter.put("/user", editUserData);
userRouter.get("/user?:id", getUserData);
// userRouter.post("/reportBugs", auth, reportBugs);
// userRouter.patch("/resetPassword", auth, resetPassword);

module.exports = userRouter;