const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

module.exports = ({ pool }) => {
  router.post("/", async (req, res) => {
    const { username, password } = req.body;
    try {
      const result = await pool.query("SELECT * FROM users WHERE username=$1", [
        username,
      ]);

      if (result.rows.length === 0) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Invalid username and password" });
      }
      req.session.user = username;
      res.json({ message: "Logged in" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
};
