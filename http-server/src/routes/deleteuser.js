const express = require("express");
const router = express.Router();
const requireLogin = require("../functions/requirelogin");

module.exports = ({ pool }) => {
  router.post("/", requireLogin, async (req, res) => {
    const { id } = req.body;
    try {
      await pool.query("DELETE FROM users WHERE id = $1", [id]);
      res.redirect("/");
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).send("Database error");
    }
  });
  return router;
};
