import nodemailer from "nodemailer";
import { ENV_VARS } from "../config/envVars.js";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV_VARS.EMAIL_USER,
    pass: ENV_VARS.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, verificationToken) => {

  const verificationUrl = `${ENV_VARS.CLIENT_LINK}/api/v1/auth/verify/${verificationToken}`;


  const mailOptions = {
    from: ENV_VARS.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `<p>Please click the following link to verify your email: <a href="${verificationUrl}">Verify Email</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
    
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error; 
  }
};