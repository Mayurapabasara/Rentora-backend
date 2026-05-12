import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'admin']
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        default: "/user.png"
    }  


});

const User = mongoose.model("User", userSchema);
export default User;