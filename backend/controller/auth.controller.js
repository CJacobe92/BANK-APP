import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../model/user.model.js";


export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({success: false, message: 'Please provide your email and password'});
    };

    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({success: false, message: 'Invalid'})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password) 
        if(!isPasswordValid){
            return res.status(401).json({successs: false, message: 'Invalid password'})
        }

        const accessToken = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET, 
            {expiresIn: '1h'}
        )

        const refreshToken = jwt.sign(
            {id: user._id},
            process.env.JWT_REFRESH_SECRET, 
            {expiresIn: '1d'}
        )
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 1 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({success: true, accessToken, message: `Welcome back, ${user.firstname}!`})

    } catch (error) {
        console.error('Error during login', error.message)
        res.status(500).json({success: false, message: 'Internal Server Error'})
    }
}

export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken; // Extract the refresh token from the cookie
    if (!refreshToken) {
        return res.status(403).json({ success: false, message: "Refresh token not found" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        // Validate the refresh token exists in the user's record
        const validToken = user.refreshTokens.find((t) => t.token === refreshToken);
        if (!validToken) {
            return res.status(403).json({ success: false, message: "Invalid refresh token" });
        }

        // Generate a new access token
        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Optionally remove the used refresh token and add a new one
        user.refreshTokens = user.refreshTokens.filter((t) => t.token !== refreshToken);

        const newRefreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '1d' }
        );
        user.refreshTokens.push({ token: newRefreshToken });
        await user.save();

        // Set the new refresh token in the cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(200).json({ success: true, accessToken });
    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
    }
};