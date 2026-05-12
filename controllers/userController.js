import e from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import OTP from "../models/otpModel.js";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD,
    },
})


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

// export async function googleLogin(req, res) {
//     const token = req.body.token;
//
//     if(token == null){
//         res.status(401).json({
//             message: "Unauthorized, please login"
//         })
//         return;
//     }
//     try{
//         const googleResponse = await axios.get(
//             "https://www.googleapis.com/oauth2/v3/userinfo",
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 }
//             }
//         );
//         const userData = googleResponse.data;
//         console.log(userData);
//
//         // check existing user
//         let user = await User.findOne({
//             email: userData.email
//         });
//
//         // create user if not exists
//         if (!user) {
//
//             user = new User({
//                 fullname: userData.name,
//                 username: userData.email.split("@")[0],
//                 email: userData.email,
//                 password: "GOOGLE_LOGIN",
//                 type: "user"
//             });
//
//             await user.save();
//         }
//
//         // create jwt token
//         const appToken = jwt.sign(
//             {
//                 fullname: user.fullname,
//                 email: user.email,
//                 role: user.type,
//                 image: user.profilePicture
//             },
//             process.env.JWT_SECRET
//         );
//
//         res.json({
//             message: "Google login successful",
//             token: appToken,
//             user: {
//                 fullname: user.fullname,
//                 email: user.email,
//                 role: user.type,
//                 image: user.profilePicture
//             }
//         });
//
//     }catch(err){
//         console.error(err);
//         res.status(500).json({
//             message: "Failed to login with Google",
//         });
//         return;
//     }
// }


export async function googleLogin(req, res) {

    const token = req.body.token;

    if (!token) {
        return res.status(401).json({
            message: "Token not found"
        });
    }

    try {

        // Get Google user data
        const googleResponse = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        const userData = googleResponse.data;

        console.log(userData);

        // CHECK USER IN DATABASE
        let user = await User.findOne({
            email: userData.email
        });

        // CREATE USER IF NOT EXISTS
        if (!user) {

            user = new User({
                fullname: userData.name,
                username: userData.email.split("@")[0],
                email: userData.email,
                password: bcrypt.hashSync("GOOGLE_LOGIN", 10),
                type: "user",
                image: userData.picture
            });

            let savedUser = await user.save();
            const jwtToken = jwt.sign(
                {
                    email: savedUser.email,
                    username: savedUser.username,
                    role: savedUser.role,
                    image: savedUser.image
                },
                process.env.JWT_SECRET
            );
            res.json({
                message: "Login successfully",
                token: jwtToken,
                user: {
                    email: savedUser.email,
                    username: savedUser.username,
                    role: savedUser.role,
                    image: savedUser.image
                }
            })
            return;
        }
        else {
            const jwtToken = jwt.sign(
                {
                    fullname: user.fullname,
                    email: user.email,
                    role: user.type,
                    image: user.image
                },
                process.env.JWT_SECRET
            );
            res.json({
                message: "Login successfully",
                token: jwtToken,
                user: {
                    fullname: user.fullname,
                    email: user.email,
                    role: user.type,
                    image: user.image
                }
            })
            return;
        }

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Failed to login with Google"
        });
    }
}

export async function sendOTP(req, res) {
    const email = req.params.email;
    if(email == null){
        res.status(401).json({
            message: "Unauthorized, please login"
        });
        return;
    }
    // 100000 - 999999
    const otp = Math.floor(100000 + Math.random() * 9000000);

    try{
        await OTP.deleteMany({
            email: email,
        })

        const newOTP = new OTP({
            email: email,
            otp: otp
        })
        await newOTP.save();

        // OTP send to the user mail
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP for Password reset successfully",
            text: `Your OTP for Password reset is ${otp}. It is valid for 10 minutes.`
        })
        res.json({
            message: "OTP sent to your email",
        })
    }catch(err){
        res.status(500).json({
            message: "Failed to send OTP",
        })
    }
}

export async function changePasswordViaOTP(req, res) {

    const email = req.body.email;
    const otp = req.body.otp;
    const newPassword = req.body.password;

    try{
        const otpRecord = await OTP.findOne({
            email: email,
            otp: otp
        });

        if(otpRecord == null){
            res.status(400).json({
                message: "Invalid OTP"
            });
            return;
        }
        await OTP.deleteMany({
            email: email
        })

        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        await User.updateOne({
            email: email,
        },{
            password: hashedPassword
        })
        res.json({
            message: "passward change successfully",
        })
    }catch(err){
        res.status(500).json({
            message: "Failed to change password",
        })
    }

}