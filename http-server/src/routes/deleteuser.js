const express = require("express");
const router = express.Router();
const requireLogin = require("../functions/requirelogin");

module.exports = ({ pool, redisClient }) => {
  router.post("/", requireLogin, async (req, res) => {
    const { id } = req.body;

    try {
      await pool.query("DELETE FROM users WHERE id = $1", [id]);

      const sessionIDs = await redisClient.sMembers(`user_sessions:${id}`);

      for (const sid of sessionIDs) {
        await redisClient.del(`sess:${sid}`);
      }

      await redisClient.del(`user_sessions:${id}`);

      res.json({ message: "User deleted and all sessions destroyed" });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
};
