const express = require("express");
const router = express.Router();
const requireLogin = require("../functions/requirelogin");

module.exports = ({ pool }) => {
  router.post("/", requireLogin, async (req, res) => {
    const { username, password } = req.body;
    try {
      await pool.query(
        "INSERT INTO users (username, password) VALUES ($1, $2)",
        [username, password]
      );
      res.redirect("/");
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).send("Database error");
    }
  });

  return router;
};
