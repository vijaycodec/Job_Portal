import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register user Function
// Register user Function
export const signup = async (req, res) => {
    try {
        const { fullname, email, password, phoneNumber, role } = req.body;

        // Basic validation
        if (!fullname || !email || !password || !phoneNumber || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email",
                success: false,
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        await User.create({
            fullname,
            email,
            password: hashedPassword,
            phoneNumber,
            role,
        });

        return res.status(201).json({
            message: "Account created successfully",
            success: true,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
        });
    }
};

// user logged in Function
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something Went Wrong",
                success: false
            });
        };

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect Email or Password ",
                success: false
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Incorrect Email or Password ",
                success: false
            });
        }
        if (user.role !== role) {
            return res.status(403).json({
                message: "Account does not exist for the selected role",
                success: false,
            });
        }

        // JWT payload
        const tokenData = {
            id: user._id,
        };

        // Generate token
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        // Construct user data to return (excluding password)
        const userData = {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        //1*24*60*60*1000 ms = 1 day  secure: process.env.NODE_ENV === 'production' // Only in production

        // return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({

        //     message: `welcome back ${user.fullname}`,
        //     user: userData,
        //     success: true

        // });  // this method store jwt in cookie do not need to share because browser handle Automatically 

        return res.status(200).json({
            message: `welcome back ${user.fullname}`,
            user: userData,
            token,
            success: true
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        });

    }
}

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const userId = req.id; // Set in auth middleware from JWT
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Update only the fields provided
    if (fullname !== undefined) user.fullname = fullname;
    if (email !== undefined) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (bio !== undefined) user.profile.bio = bio;
    if (skills !== undefined) {
      const skillsArray = skills.split(',').map(s => s.trim());
      user.profile.skills = skillsArray;
    }

    const updatedUser = await user.save();

    // Prepare safe response data
    const userData = {
      id: updatedUser._id,
      fullname: updatedUser.fullname,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      role: updatedUser.role,
      profile: updatedUser.profile,
    };

    return res.status(200).json({
      message: "User profile updated successfully",
      user: userData,
      success: true,
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};
