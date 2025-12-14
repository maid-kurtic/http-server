const nodemailer = require("nodemailer");

console.log("=== EMAIL SERVICE LOADING ===");
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✓ Set" : "✗ Missing");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✓ Set" : "✗ Missing");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendWelcomeEmail(toEmail, username) {
  console.log("📧 Sending welcome email to:", toEmail);

  await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Welcome",
    html: `
      <h2>Welcome ${username}!</h2>
      <p>Your account has been successfully created.</p>
      <p>We are glad to have you here</p>
    `,
  });

  console.log("✅ Welcome email sent");
}

async function sendPasswordResetEmail(toEmail, resetLink) {
  console.log("📧 sendPasswordResetEmail called");
  console.log("To:", toEmail);
  console.log("Link:", resetLink);

  try {
    const info = await transporter.sendMail({
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

    console.log("✅ Password reset email sent");
    console.log("Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to send password reset email:", error);
    throw error;
  }
}

module.exports = { sendWelcomeEmail, sendPasswordResetEmail };
