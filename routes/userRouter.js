import express from "express";
import { createUser, getUsers, loginUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);  
userRouter.post("/", createUser);
userRouter.post("/login", loginUser);

export default userRouter;