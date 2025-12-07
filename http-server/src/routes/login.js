const express = require("express");
const router = express.Router();

module.exports = ({ pool }) => {
  router.post("/", async (req, res) => {
    const { username, password } = req.body;
    try {
      const result = await pool.query("SELECT * FROM users WHERE username=$1", [
        username,
      ]);

      if (result.rows.length === 0 || result.rows[0].password !== password) {
        return res
          .status(401)
          .json({ message: "Invaliiiiiiiiiid username or password" });
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
