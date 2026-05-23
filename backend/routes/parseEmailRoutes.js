const express = require("express");
const router = express.Router();
const { parseSubscriptionEmail } = require("../controllers/parseEmailController");
const authMiddleware = require("../middleware/authMiddleware");
 
router.post("/parse-email", authMiddleware, parseSubscriptionEmail);
 
module.exports = router;
 