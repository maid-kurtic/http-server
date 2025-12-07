const express = require("express");
const router = express.Router();

module.exports = () => {
  router.get("/", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.send("Error logging out");
      res.redirect("/login");
    });
  });
  return router;
};
