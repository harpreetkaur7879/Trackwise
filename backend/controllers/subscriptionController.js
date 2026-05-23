const Subscription = require("../models/Subscription");

// @route   GET /api/subscriptions
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (err) {
    console.error("getSubscriptions error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// @route   GET /api/subscriptions/upcoming
// Returns subscriptions renewing within next 30 days, with urgency level
exports.getUpcomingRenewals = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const subscriptions = await Subscription.find({
      user: req.user.id,
       isActive: true,
      renewalDate: { $gte: today, $lte: thirtyDaysFromNow },
    }).sort({ renewalDate: 1 });

    // Add daysUntil + urgency level to each
    const enriched = subscriptions.map((sub) => {
      const diffMs = new Date(sub.renewalDate) - today;
      const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      let urgency = "normal";
      if (daysUntil <= 3) urgency = "urgent";
      else if (daysUntil <= 7) urgency = "warning";

      return {
        ...sub.toObject(),
        daysUntil,
        urgency,
      };
    });

    return res.status(200).json({ success: true, data: enriched });
  } catch (err) {
    console.error("getUpcomingRenewals error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// @route   GET /api/subscriptions/:id
exports.getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found." });
    }
    // Make sure user owns this subscription
    if (subscription.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }
    return res.status(200).json({ success: true, data: subscription });
  } catch (err) {
    console.error("getSubscription error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// @route   POST /api/subscriptions
exports.createSubscription = async (req, res) => {
  try {
    const {
      serviceName,
      amount,
      currency,
      billingCycle,
      category,
      startDate,
      renewalDate,
      notes,
    } = req.body;
    if (!serviceName || !amount) {
      return res.status(400).json({
        success: false,
        message: "Service name and amount are required.",
      });
    }
    const subscription = await Subscription.create({
      user: req.user.id,
      serviceName,
      amount,
      currency: currency || "INR",
      billingCycle: billingCycle || "monthly",
      category: category || "Other",
      startDate: startDate || Date.now(),
      renewalDate,
      notes,
    });
    return res.status(201).json({ success: true, data: subscription });
  } catch (err) {
    console.error("createSubscription error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// @route   PUT /api/subscriptions/:id
exports.updateSubscription = async (req, res) => {
  try {
    let subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found." });
    }
    // Make sure user owns this subscription
    if (subscription.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }
    subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    return res.status(200).json({ success: true, data: subscription });
  } catch (err) {
    console.error("updateSubscription error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// @route   DELETE /api/subscriptions/:id
exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found." });
    }
    // Make sure user owns this subscription
    if (subscription.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }
    await subscription.deleteOne();
    return res.status(200).json({ success: true, message: "Subscription deleted." });
  } catch (err) {
    console.error("deleteSubscription error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};