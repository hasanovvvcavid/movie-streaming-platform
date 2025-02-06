import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSendCookie } from "../utils/generateToken.js";

export async function signup(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const exsistingUserByEmail = await User.findOne({ email: email });

    if (exsistingUserByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const exsistingUserByUsername = await User.findOne({ username: username });

    if (exsistingUserByUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already in use" });
    }

    const PROFILE_PICS = ["/profile1.png", "/profile2.png", "/profile3.png"];

    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      image,
    });

    generateTokenAndSendCookie(newUser._id, res);
    await newUser.save();
    res
      .status(201)
      .json({ success: true, user: { ...newUser._doc, password: "" } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);  

        if (!isPasswordCorrect){
            return res.status(404).json({ success: false, message: "Invalid credentials" });
        }

        generateTokenAndSendCookie(user._id, res);

        res.status(200).json({ success: true, user: { ...user._doc, password: "" } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie("jwt-netflix");
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function authCheck(req, res) {
  try {
    res.status(200).json({success: true, user: req.user});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
    
  }
}