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
    text: `You are receiving this email because a password reset request was made for your account.

To reset your password, please click the link below or copy and paste it into your browser:

${resetUrl}

If you did not request this change, please ignore this email. Your password will remain unchanged.

For security reasons, this link will expire in 1 hour.`,
    html: `
      <p>You are receiving this email because a password reset request was made for your account.</p>
      <p>To reset your password, please click the link below or copy and paste it into your browser:</p>
      <p><a href="${resetUrl}" style="color: blue; text-decoration: underline;">Reset Your Password</a></p>
      <p>If you did not request this change, please ignore this email. Your password will remain unchanged.</p>
      <p><strong>For security reasons, this link will expire in 1 hour.</strong></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    // res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};
