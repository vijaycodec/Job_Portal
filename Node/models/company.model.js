import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        unique:true,
        required: true,
    },
    description: {
        type: String,
    },
    website: {
        type: String,
    },
    location: {
        type: String,
    },
    logo:{
        type:String,
    },
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
}, { timestamps: true });

const Company = mongoose.model('Job', companySchema);
export default Company;