import express from 'express';
import mongoose from 'mongoose'; 
import studentRouter from './routes/studentRouter.js';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import orderRouter from "./routes/orderRouter.js";

dotenv.config(); // .env file eke thiyn data me file ekt load kirima sidu karai

const app = express(); // Create an instance of the Express application, include the another backend
app.use(cors());

app.use(express.json()); // Middleware to parse JSON request bodies

//create a middleware
app.use(

    (req, res, next) => {

        // ✅ Skip authentication for login & register
        if (req.path === "/api/users/login" || req.path === "/api/users") {
            return next();
        }

        let token = req.headers.authorization;

        if (token != null) {
            token = token.replace("Bearer ", "");
            console.log("Token received:", token);

            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

                if (err) {
                    return res.status(401).json({
                        message: "Invalid token, please login again"
                    });
                }

                req.user = decoded;
                next();   //ove inside
            });

        } else {
            next(); // no token → continue
        }
    });


const connectionString = process.env.MONGO_URL;

mongoose.connect(connectionString)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

//routes
app.use("/api/students", studentRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);


// Arro function and backend starting
app.listen(5000, () => {
    console.log("Server is running successfully");
});