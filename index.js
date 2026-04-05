import express from 'express';
import mongoose from 'mongoose'; 
import studentRouter from './routes/studentRouter.js';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import jwt from "jsonwebtoken";

const app = express(); // Create an instance of the Express application, include the another backend

app.use(express.json()); // Middleware to parse JSON request bodies

//create a middleware
app.use((req, res, next) => {

    let token = req.headers.authorization;

    if (token != null) {
        token = token.replace("Bearer ", "");
        console.log("Token received:", token);

        jwt.verify(token, "jwt-secret", (err, decoded) => {

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


const connectionString = "mongodb://admin:2000@ac-xf8xt2x-shard-00-00.jxtu1la.mongodb.net:27017,ac-xf8xt2x-shard-00-01.jxtu1la.mongodb.net:27017,ac-xf8xt2x-shard-00-02.jxtu1la.mongodb.net:27017/?ssl=true&replicaSet=atlas-h7rmqn-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(connectionString)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

//routes
app.use("/students", studentRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);


// Arro function and backend starting
app.listen(5000, () => {
    console.log("Server is running successfully");
});