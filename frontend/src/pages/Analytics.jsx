import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import Card from "../components/Card";
import StatCard from "../components/StatCard";

const COLORS = ["#6C5CE7", "#00D4AA", "#FFB84D", "#FF5C5C", "#8579EF", "#5C6478"];

// ── Custom tooltip (matches dark theme) ──────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-card border border-border rounded-xl p-3 shadow-lg">
      <p className="text-text-secondary text-xs mb-1">{label}</p>
      <p className="text-white font-bold text-sm">
        ₹{payload[0].value.toLocaleString()}
      </p>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/analytics`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-48 bg-bg-card rounded-xl" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-bg-card rounded-2xl" />
            ))}
          </div>
          <div className="h-72 bg-bg-card rounded-2xl" />
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 py-12">
        <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl text-sm">
          {error}
        </div>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!data || data.activeCount === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 py-12 text-center">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-white mb-2">No data yet</h2>
        <p className="text-text-secondary">
          Add at least one active subscription to see your analytics.
        </p>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto p-6 py-12">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-text-secondary">
          Insights into your subscription spending
        </p>
      </div>

      {/* ── Hero stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Monthly Spend"
          value={`₹${data.monthlySpend.toLocaleString()}`}
          change={data.momChange}
          icon="💸"
        />
        <StatCard
          label="Yearly Projection"
          value={`₹${data.yearlySpend.toLocaleString()}`}
          icon="📅"
        />
        <StatCard
          label="Active Subscriptions"
          value={data.activeCount}
          icon="✅"
        />
        <StatCard
          label="Avg per Sub"
          value={`₹${data.avgPerSubscription}`}
          icon="📊"
        />
      </div>

      {/* ── Spending trend chart ── */}
      <Card className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-1">
          Spending Trend
        </p>
        <h2 className="text-2xl font-bold text-white mb-6">Last 6 Months</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2433" />
            <XAxis dataKey="month" stroke="#8B92A7" tick={{ fontSize: 13 }} />
            <YAxis stroke="#8B92A7" tick={{ fontSize: 13 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#6C5CE7"
              strokeWidth={3}
              dot={{ fill: "#6C5CE7", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* ── Category breakdown + Top 5 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Category donut chart */}
        <Card>
          <p className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-1">
            By Category
          </p>
          <h2 className="text-2xl font-bold text-white mb-6">
            Where Your Money Goes
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.categoryBreakdown}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
              >
                {data.categoryBreakdown.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="space-y-2 mt-4">
            {data.categoryBreakdown.map((cat, idx) => (
              <div
                key={cat.category}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-text-secondary">{cat.category}</span>
                </div>
                <div className="text-white">
                  ₹{cat.amount.toLocaleString()}{" "}
                  <span className="text-text-secondary">({cat.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top 5 most expensive */}
        <Card>
          <p className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-1">
            Top 5
          </p>
          <h2 className="text-2xl font-bold text-white mb-6">Most Expensive</h2>
          <div className="space-y-4">
            {data.top5.map((sub, idx) => (
              <div key={sub._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-white font-medium">{sub.serviceName}</div>
                    <div className="text-text-secondary text-xs">{sub.category}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">
                    ₹{Math.round(sub.monthlyEquivalent).toLocaleString()}/mo
                  </div>
                  <div className="text-text-secondary text-xs capitalize">
                    {sub.billingCycle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Insights ── */}
      <div className="space-y-4">

        {/* Inactive savings */}
        {data.inactiveCount > 0 && (
          <Card className="bg-warning/5 border-warning/20">
            <div className="flex items-start gap-4">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="text-white font-semibold mb-1">
                  Savings Opportunity
                </h3>
                <p className="text-text-secondary text-sm">
                  You have{" "}
                  <span className="text-white font-medium">
                    {data.inactiveCount} inactive subscription
                    {data.inactiveCount !== 1 ? "s" : ""}
                  </span>
                  . Cancelling them could save you{" "}
                  <span className="text-white font-medium">
                    ₹{data.inactiveSavings.toLocaleString()}/month
                  </span>{" "}
                  (₹{(data.inactiveSavings * 12).toLocaleString()}/year).
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Biggest spend category */}
        {data.categoryBreakdown.length > 0 && (
          <Card className="bg-accent/5 border-accent/20">
            <div className="flex items-start gap-4">
              <span className="text-2xl">🎯</span>
              <div>
                <h3 className="text-white font-semibold mb-1">
                  Biggest Spend Category
                </h3>
                <p className="text-text-secondary text-sm">
                  You spend the most on{" "}
                  <span className="text-white font-medium">
                    {data.categoryBreakdown[0].category}
                  </span>{" "}
                  — ₹{data.categoryBreakdown[0].amount.toLocaleString()}/mo (
                  {data.categoryBreakdown[0].percentage}% of total).
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Yearly projection */}
        <Card className="bg-success/5 border-success/20">
          <div className="flex items-start gap-4">
            <span className="text-2xl">📅</span>
            <div>
              <h3 className="text-white font-semibold mb-1">
                Yearly Projection
              </h3>
              <p className="text-text-secondary text-sm">
                At this rate you will spend{" "}
                <span className="text-white font-medium">
                  ₹{data.yearlySpend.toLocaleString()}
                </span>{" "}
                on subscriptions this year.
              </p>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default Analytics;