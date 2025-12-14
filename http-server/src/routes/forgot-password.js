const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const { sendPasswordResetEmail } = require("../functions/sendEmail");

module.exports = ({ pool }) => {
  router.post("/", async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      const result = await pool.query("SELECT * FROM users WHERE email=$1", [
        email,
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Email not found" });
      }

      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 3600000);

      await pool.query(
        "UPDATE users SET reset_token=$1, reset_token_expires=$2 WHERE email=$3",
        [token, expires, email]
      );

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

      await sendPasswordResetEmail(email, resetLink);

      res.json({ message: "Password reset link sent" });
    } catch (err) {
      console.error("💥 ERROR:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });

  return router;
};
