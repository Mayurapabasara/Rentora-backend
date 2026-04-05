import express from "express";
//import Student from "../models/student.js";
import { createStudent, deleteStudent, getStudents, updateStudent } from "../controllers/studentController.js";
import { createUser, getUsers, loginUser } from "../controllers/userController.js";
import { isAdmin } from "../controllers/userController.js";

const studentRouter = express.Router();

studentRouter.get("/", getStudents);

studentRouter.post("/", createStudent);

studentRouter.put("/:id", updateStudent);

studentRouter.delete("/:id", deleteStudent);


export default studentRouter;