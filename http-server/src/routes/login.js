const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

module.exports = ({ pool, redisClient }) => {
  router.post("/", async (req, res) => {
    const { email, password } = req.body;

    try {
      const result = await pool.query("SELECT * FROM users WHERE email=$1", [
        email,
      ]);

      if (result.rows.length === 0) {
        return res.status(401).json({ message: "Invalid e-mail or password" });
      }

      const user = result.rows[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email and password" });
      }

      req.session.userId = user.id;
      req.session.user = user.username;

      req.session.save(async (err) => {
        if (err) {
          return res.status(500).json({ message: "Session save failed" });
        }

        try {
          await redisClient.sAdd(`user_sessions:${user.id}`, req.sessionID);
        } catch (redisErr) {
          console.error("Error tracking session in Redis:", redisErr);
        }

        res.json({ message: "Logged in", username: user.username });
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
};
