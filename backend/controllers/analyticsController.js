const Subscription = require("../models/Subscription");

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
const subscriptions = await Subscription.find({ user: userId });

    console.log("All subscriptions:", subscriptions); // debug

    const active = subscriptions.filter(s => s.isActive === true);
    const inactive = subscriptions.filter(s => s.isActive !== true);

    console.log("Active count:", active.length); // debug

    const monthlySpend = active.reduce((sum, sub) => {
      const monthly = sub.billingCycle === "yearly" ? sub.amount / 12 : sub.amount;
      return sum + monthly;
    }, 0);

    const yearlySpend = monthlySpend * 12;

    const categoryMap = {};
    active.forEach(sub => {
      const monthly = sub.billingCycle === "yearly" ? sub.amount / 12 : sub.amount;
      categoryMap[sub.category] = (categoryMap[sub.category] || 0) + monthly;
    });
    const categoryBreakdown = Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount),
        percentage: monthlySpend > 0 ? Math.round((amount / monthlySpend) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    const top5 = [...active]
      .map(sub => ({
        ...sub.toObject(),
        monthlyEquivalent: sub.billingCycle === "yearly" ? sub.amount / 12 : sub.amount
      }))
      .sort((a, b) => b.monthlyEquivalent - a.monthlyEquivalent)
      .slice(0, 5);

    const now = new Date();
    const trend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = d.toLocaleString("default", { month: "short" });
      // removed startDate filter - count all active subs for every month
      const monthTotal = active.reduce((sum, sub) => {
        const monthly = sub.billingCycle === "yearly" ? sub.amount / 12 : sub.amount;
        return sum + monthly;
      }, 0);
      trend.push({ month: monthLabel, amount: Math.round(monthTotal) });
    }

    const prevMonthSpend = trend.length >= 2 ? trend[trend.length - 2].amount : 0;
    const momChange =
      prevMonthSpend > 0
        ? Math.round(((monthlySpend - prevMonthSpend) / prevMonthSpend) * 100)
        : null;

    const inactiveSavings = inactive.reduce((sum, sub) => {
      const monthly = sub.billingCycle === "yearly" ? sub.amount / 12 : sub.amount;
      return sum + monthly;
    }, 0);

    res.json({
      success: true,
      data: {
        monthlySpend: Math.round(monthlySpend),
        yearlySpend: Math.round(yearlySpend),
        activeCount: active.length,
        inactiveCount: inactive.length,
        categoryBreakdown,
        top5,
        trend,
        momChange,
        inactiveSavings: Math.round(inactiveSavings),
        avgPerSubscription:
          active.length > 0 ? Math.round(monthlySpend / active.length) : 0
      }
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};