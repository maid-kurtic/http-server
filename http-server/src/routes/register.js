const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
module.exports = ({ pool }) => {
  router.post("/", async (req, res) => {
    const { username, password } = req.body;
    if (username.length <= 3 || password.length <= 3) {
      return res
        .status(400)
        .json({ message: "Username or password is too short" });
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
        "INSERT INTO users (username, password) VALUES ($1, $2)",
        [username, hashedPassword]
      );

      res.json({ message: "Registered successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  return router;
};
