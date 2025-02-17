import { User } from "../models/user.model.js";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateTokenAndSendCookie } from "../utils/generateToken.js";
import { ENV_VARS } from "../config/envVars.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { sendResetEmail } from "../utils/sendResetEmail.js";

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

    //Nodemmailer
    const verificationToken = jwt.sign({ email }, ENV_VARS.JWT_SECRET, {
      expiresIn: "1h",
    });

    let imageUrl;
    if (req.file) {
      const { filename } = req.file;
      imageUrl = `images/${filename}`.replace(/\\/g, "/");
    } else {
      const PROFILE_PICS = ["/profile1.png", "/profile2.png", "/profile3.png"];
      imageUrl = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];
    }

    const exsistingUserByUsername = await User.findOne({ username: username });

    if (exsistingUserByUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already in use" });
    }

    // const PROFILE_PICS = ["/profile1.png", "/profile2.png", "/profile3.png"];

    // const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const newUser = new User({
      email,
      username,
      isVerified: false, // nodemailer
      verificationToken, // nodemailer
      password: hashedPassword,
      image: imageUrl,
    });

    await sendVerificationEmail(email, verificationToken); //nodemailer

    // generateTokenAndSendCookie(newUser._id, res);
    await newUser.save();

    res
      .status(201)
      .json({ success: true, user: { ...newUser._doc, password: "" } });
  } catch (error) {
    console.error("Signup Error:", error); // Log'a bakın
    res.status(500).json({
      success: false,
      message: error.message || "Signup failed due to server error",
    });
  }

  console.log("File:", req.file);
  // console.log("Body:", req.body);
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email first." });

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSendCookie(user._id, res);

    res
      .status(200)
      .json({ success: true, user: { ...user._doc, password: "" } });
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
    console.log("Authenticated User:", req.user);
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(401).json({ message: "Access Denied" });
    }

    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);

    if (!decoded) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(400).json({ message: "Invalid token" });

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Invalid or expired token" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("+password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const makeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin } = req.body;

    const user = await User.findByIdAndUpdate(id, { admin }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating admin status" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const file = req.file;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateData = {
      username: updates.username || user.username,
      email: updates.email || user.email,
    };

    if (updates.password && updates.password.trim() !== "") {
      const salt = await bcryptjs.genSalt(10);
      updateData.password = await bcryptjs.hash(updates.password, salt);
    }

    if (file) {
      if (user.image) {
        fs.unlinkSync(path.join("../frontend/public/", user.image));
      }
      updateData.image = `images/${file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({
      error: error.message || "User update failed",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const file = req.file;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const updateData = {
      username: updates.username || user.username,
      email: updates.email || user.email,
    };

    if (updates.password) {
      const salt = await bcryptjs.genSalt(10);
      updateData.password = await bcryptjs.hash(updates.password, salt);
    }

    if (file) {
      if (user.image) {
        fs.unlinkSync(path.join("../frontend/public/", user.image));
      }
      updateData.image = `images/${file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: "Email not verified" });
    }

    // Reset token oluştur
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // Email gönder

    await sendResetEmail(email, resetToken);
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetToken = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Token süresi dolmamışsa
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Yeni şifreyi hash'le ve kaydet
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
