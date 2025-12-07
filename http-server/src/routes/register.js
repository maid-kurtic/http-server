const express = require("express");
const router = express.Router();

module.exports = ({ pool }) => {
  router.post("/", async (req, res) => {
    const { username, password } = req.body;
    try {
      const result = await pool.query("SELECT * FROM users WHERE username=$1", [
        username,
      ]);

      if (result.rows.length > 0) {
        return res.status(400).json({ message: "Username already exists" });
      }

      await pool.query(
        "INSERT INTO users (username, password) VALUES ($1, $2)",
        [username, password]
      );

      res.json({ message: "Registered successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  return router;
};
