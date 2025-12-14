const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

module.exports = ({ pool }) => {
  router.post("/", async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }

    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE reset_token=$1 AND reset_token_expires > NOW()",
        [token]
      );

      if (result.rows.length === 0) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await pool.query(
        "UPDATE users SET password=$1, reset_token=NULL, reset_token_expires=NULL WHERE reset_token=$2",
        [hashedPassword, token]
      );

      res.json({ message: "Password updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
};
