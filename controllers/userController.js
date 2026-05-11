import e from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export function getUsers(req, res){
    User.find()
        .then((users) => res.json(users))  
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                message: err.message || "Error fetching users"
            });
        });
}

export function createUser(req, res){

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);  //npm bcryptjs

    const user = new User(
        {
            fullname: req.body.fullname,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            type: req.body.type || "user"
        }
    )

    user.save().then(
        () => {
            res.json({
                message: "User created successfully"
            })
        }
    ).catch(
        (err)=> {
            res.status(500).json({
                message: err.message || "Error creating user"
            })
        }  
    )
}

export function loginUser(req, res){
    
    User.findOne({ email: req.body.email })
        .then((user) => {

            if (user == null) {
                res.status(404).json({ message: "User not found" });
                return;
            }else {
                const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
                if (isPasswordValid) {

                    //create token
                    const token = jwt.sign({
                        fullname: user.fullname,
                        email: user.email,
                        role: user.type,
                        isBlocked: user.isBlocked,
                        isEmailVerified: user.isEmailVerified,
                        image: user.image
                    }, process.env.JWT_SECRET);


                    res.json({
                        message: "Login successful",
                        token: token,
                        user: {
                            id: user._id,
                            fullname: user.fullname,
                            email: user.email,
                            role: user.type
                        }
                    });

                } else {
                    res.status(401).json({ message: "Invalid password" });
                }
            }
        })
}


export function isAdmin(req, res, next){
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized, please login"
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Forbidden, you don't have permission"
        });
    }

    next();
}




export function updateUser(req, res){
    res.send("Update a user");
}

export function deleteUser(req, res){
    res.send("Delete a user");
} 

export function getUser(req, res){
    if (req.user == null){
        res.status(404).json({
            message: "Unauthorized, please login"
        })
        return;
    }
    else{
        res.json(
            req.user
        )
    }
}