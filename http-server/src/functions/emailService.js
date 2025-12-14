const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendWelcomeEmail(toEmail) {
  await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Welcome",
    html: `
      <h2>Welcome!</h2>
      <p>Your account has been successfully created.</p>
      <p>We are glad to have you here</p>
    `,
  });
}

async function sendPasswordResetEmail(toEmail, resetLink) {
  await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Password Reset",
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
}

module.exports = { sendWelcomeEmail, sendPasswordResetEmail };
