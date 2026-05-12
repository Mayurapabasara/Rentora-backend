import express from "express";
import {
    changePasswordViaOTP,
    createUser,
    getUser,
    getUsers,
    googleLogin,
    loginUser,
    sendOTP
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);  
userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", getUser);
userRouter.post("/google-login", googleLogin);
userRouter.get("/send-otp/:email", sendOTP);
userRouter.post("/change-password/", changePasswordViaOTP);

export default userRouter;