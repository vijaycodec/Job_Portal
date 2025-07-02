import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from './utils/db.js'; // include .js!
import apiRoutes from "./routes/mainRoutes.js"


const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOption = {
    origin: 'http//localhost:5173',
    credentials: true
}

app.use(cors(corsOption));
app.use('/api/v1', apiRoutes); // Final path: /api/auth/signup, etc.

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is Running at Port: http://localhost:${PORT}`);
})