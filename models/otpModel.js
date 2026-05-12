import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    otp: { type: String, required: true },
   // expire: { type: Date, default: Date.now },
})

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;