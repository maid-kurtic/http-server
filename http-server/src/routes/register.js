const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { sendWelcomeEmail } = require("../functions/sendEmail");

module.exports = ({ pool }) => {
  router.post("/", async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (username.length <= 3 || password.length <= 3) {
      return res
        .status(400)
        .json({ message: "Username or password is too short" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    try {
      const result = await pool.query("SELECT * FROM users WHERE username=$1", [
        username,
      ]);

      if (result.rows.length > 0) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      await pool.query(
        "INSERT INTO users (username, password,email) VALUES ($1, $2,$3)",
        [username, hashedPassword, email]
      );
      sendWelcomeEmail(email, username).catch(console.error);

      res.json({ message: "Registered successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  return router;
};
