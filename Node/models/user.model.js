import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['recruiter', 'student']
    },
    profile: {
        bio: { type: String },
        skills: { type: String },
        resume: { type: String },
        resumeOriginalName: { type: String },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'company' },
        profilePhoto: {
            type: String,
            default: ""

        }
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;

