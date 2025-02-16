import nodemailer from "nodemailer";
import { ENV_VARS } from "../config/envVars.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV_VARS.EMAIL_USER,
    pass: ENV_VARS.EMAIL_PASS,
  },
});

export const sendResetEmail = async (email, resetToken) => {
  const resetUrl = `${ENV_VARS.CLIENT_LINK}/reset-password/${resetToken}`;
  const mailOptions = {
    from: ENV_VARS.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            ${resetUrl}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};
