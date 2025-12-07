const express = require("express");
const router = express.Router();
const requireLogin = require("../functions/requirelogin");

module.exports = ({ pool }) => {
  router.get("/", requireLogin, async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const result = await pool.query(
        "SELECT id, username FROM users ORDER BY id"
      );
      res.json({ users: result.rows, currentUser: req.session.user });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ message: "Database error" });
    }
  });

  return router;
};
