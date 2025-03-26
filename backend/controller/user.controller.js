import mongoose, { Mongoose } from "mongoose";
import User from "../model/user.model.js";
import bcrypt from "bcrypt"

// Login

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({success: false, message: "Please provide your email and password"});
    };

    try {
        const user = await User.findOne(email)
        if (!user) {
            return res.status(404).json({success: false, message: "Invalid username"})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password) 
        if(!isPasswordValid){
            return res.status(401).json({successs: false, message: "Invalid password"})
        }
    } catch (error) {
        
    }
}


// CRUD Operations
export const createUser = async(req, res) => {
    const user = req.body

    if (!user.firstname || !user.lastname || !user.email || !user.password){
        return res.status(400).json({success: false, message: "Please provide all fields!"})
    }

    const newUser = new User(user);

    try {
        await newUser.save();
        res.status(201).json({success: true, message: `User ${newUser.email} created successfully!`})
    } catch (error) {
        console.error("Error creating user:", error.message)
        res.status(500).json({success: false, message: "Internal Server Error!"})
    }
}

export const getUsers = async(req, res) => {
    try {
        const users = await User.find({},"id firstname lastname email createdAt updatedAt");
        res.status(200).json({success: true, data: users})
    } catch (error) {
        console.error("Error fetching users", error.message)
        res.status(500).json({success: failed, message: "Internal Server Error"})
    }
}

export const getUser = async(req, res) => {

    const { id } = req.params;

    try {
        const users = await User.findById(id, "id firstname lastname email createdAt updatedAt");
        res.status(200).json({success: true, data: users})
    } catch (error) {
        console.error("Error fetching users", error.message)
        res.status(500).json({success: failed, message: "Internal Server Error"})
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;

    const user = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: failed, message: "User not found"});
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, user, {new: true}, ).select("id firstname lastname email createdAt updatedAt")
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: failed, message: "User not found"});
    }

    try {
        await User.findByIdAndDelete(id)
        res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};