const express = require("express");
const router = express.Router();
const {
  getSubscriptions,
  getSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getUpcomingRenewals,
} = require("../controllers/subscriptionController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes are protected
router.use(authMiddleware);
router.get("/upcoming", getUpcomingRenewals);

router.route("/")
  .get(getSubscriptions)
  .post(createSubscription);

router.route("/:id")
  .get(getSubscription)
  .put(updateSubscription)
  .delete(deleteSubscription);

module.exports = router;