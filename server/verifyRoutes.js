const express = require("express");
const router = express.Router();

router.post("/verify-username", (req, res) => {
  const { username } = req.body;

  // Simulate username verification (replace with actual logic if needed)
  if (username) {
    console.log(`Verifying username: ${username}`);
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, error: "Invalid username" });
  }
});

module.exports = router;
