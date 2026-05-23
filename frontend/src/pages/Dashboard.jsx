import { useEffect, useState } from "react";
import axios from "axios";
import StatCard from "../components/StatCard";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import ReminderBanner from "../components/ReminderBanner";

const Dashboard = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/subscriptions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubs(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: filter by status === "Active" (matches your schema)
 const active = subs.filter((s) => s.isActive === true);
  const monthlySpend = active.reduce((sum, s) => {
    const monthly = s.billingCycle === "yearly" ? s.amount / 12 : s.amount;
    return sum + monthly;
  }, 0);
  const yearlySpend = monthlySpend * 12;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 py-12">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 py-12">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-text-secondary">Your subscriptions at a glance</p>
        </div>
        <button
          onClick={() => navigate("/add-subscription")}
          className="bg-accent hover:bg-accent-hover text-white px-5 py-3 rounded-xl font-medium text-sm transition"
        >
          + Add Subscription
        </button>
      </div>

      {/* ✅ Reminder Banner — renders nothing if no urgent/warning renewals */}
      <ReminderBanner />

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Monthly Spend"
          value={`₹${Math.round(monthlySpend).toLocaleString()}`}
          icon="💸"
        />
        <StatCard
          label="Yearly Projection"
          value={`₹${Math.round(yearlySpend).toLocaleString()}`}
          icon="📅"
        />
        <StatCard label="Active Subs" value={active.length} icon="✅" />
      </div>

      {/* Subscription List */}
      <Card>
        <h2 className="text-2xl font-bold text-white mb-6">Your Subscriptions</h2>
        {subs.length === 0 ? (
          <p className="text-text-secondary text-center py-8">
            No subscriptions yet. Add your first one!
          </p>
        ) : (
          <div className="space-y-3">
            {subs.map((sub) => (
              <div
                key={sub._id}
                className="flex items-center justify-between p-4 bg-bg rounded-xl border border-border"
              >
                <div>
                  <div className="text-white font-medium">{sub.serviceName}</div>
                  <div className="text-text-secondary text-xs">
                    {sub.category} • {sub.billingCycle}
                  </div>
                </div>
                <div className="text-white font-semibold">
                  {sub.currency} {sub.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;