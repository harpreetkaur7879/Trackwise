import { useEffect, useState } from "react";
import axios from "axios";

const ReminderBanner = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/subscriptions/upcoming`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReminders(data.data || []);
    } catch (err) {
      console.error("Failed to load reminders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Split by urgency level
  const urgent = reminders.filter((r) => r.urgency === "urgent");
  const warning = reminders.filter((r) => r.urgency === "warning");

  // Don't render anything while loading OR if nothing urgent/warning
  if (loading || (urgent.length === 0 && warning.length === 0)) {
    return null;
  }

  // Helper for "in X day(s)" text
  const daysText = (n) => {
    if (n === 0) return "today";
    if (n === 1) return "tomorrow";
    return `in ${n} days`;
  };

  return (
    <div className="space-y-3 mb-6">
      {/* URGENT — Red banner (0-3 days) */}
      {urgent.length > 0 && (
        <div className="bg-danger/10 border border-danger/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-danger text-lg">⚠️</span>
            <span className="text-danger font-semibold text-sm uppercase tracking-wider">
              Urgent — Due Soon
            </span>
          </div>
          <div className="space-y-2">
            {urgent.map((sub) => (
              <div
                key={sub._id}
                className="flex items-center justify-between flex-wrap gap-2"
              >
                <div>
                  <span className="text-white font-medium">
                    {sub.serviceName}
                  </span>
                  <span className="text-text-secondary text-sm ml-2">
                    {daysText(sub.daysUntil)}
                  </span>
                </div>
                <span className="text-white font-semibold">
                  {sub.currency} {sub.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WARNING — Yellow banner (4-7 days) */}
      {warning.length > 0 && (
        <div className="bg-warning/10 border border-warning/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-warning text-lg">🔔</span>
            <span className="text-warning font-semibold text-sm uppercase tracking-wider">
              Renewing This Week
            </span>
          </div>
          <div className="space-y-2">
            {warning.map((sub) => (
              <div
                key={sub._id}
                className="flex items-center justify-between flex-wrap gap-2"
              >
                <div>
                  <span className="text-white font-medium">
                    {sub.serviceName}
                  </span>
                  <span className="text-text-secondary text-sm ml-2">
                    {daysText(sub.daysUntil)}
                  </span>
                </div>
                <span className="text-white font-semibold">
                  {sub.currency} {sub.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReminderBanner;