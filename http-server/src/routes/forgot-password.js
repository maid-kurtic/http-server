const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const { sendPasswordResetEmail } = require("../functions/sendEmail");
const validateRequest = require("../middleware/validate");
const { forgotPasswordSchema } = require("../schemas");

module.exports = ({ pool }) => {
  router.post("/", validateRequest(forgotPasswordSchema), async (req, res) => {
    const { email } = req.body;

    try {
      const result = await pool.query("SELECT * FROM users WHERE email=$1", [
        email,
      ]);

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "User with this email doesn't exist" });
      }

      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 3600000);

      await pool.query(
        "UPDATE users SET reset_token=$1, reset_token_expires=$2 WHERE email=$3",
        [token, expires, email]
      );

      const resetLink = `http://18.215.64.181:30081//reset-password?token=${token}`;
      await sendPasswordResetEmail(email, resetLink);

      res.json({ message: "Password reset link sent" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });

  return router;
};
