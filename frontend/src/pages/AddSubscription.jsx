import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";
import Button from "../components/Button";

const AddSubscription = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    serviceName: "",
    amount: "",
    currency: "INR",
    billingCycle: "monthly",
    startDate: "",
    renewalDate: "",
    category: "Other",
    notes: "",
  });

  const [aiPrefilled, setAiPrefilled] = useState(false);
  const [aiConfidence, setAiConfidence] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // AI prefill from AddFromEmail page
  useEffect(() => {
    if (location.state?.prefill && location.state?.source === "ai-email") {
      const data = location.state.prefill;
      setForm((prev) => ({
        ...prev,
        serviceName: data.serviceName || prev.serviceName,
        amount: data.amount ? String(data.amount) : prev.amount,
        currency: data.currency || prev.currency,
        billingCycle: data.billingCycle || prev.billingCycle,
        startDate: data.startDate || prev.startDate,
        renewalDate: data.renewalDate || prev.renewalDate,
        category: data.category || prev.category,
      }));
      setAiPrefilled(true);
      setAiConfidence(data.confidence || "medium");
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.serviceName || !form.amount) {
      setError("Service name and amount are required.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...form,
        amount: Number(form.amount),
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/subscriptions`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        navigate("/dashboard");
      } else {
        setError(data.message || "Could not save subscription.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Add Subscription</h1>
        <p className="text-text-secondary">
  Track a new recurring service
</p>

{/* ADD THIS */}
<button
  onClick={() => navigate("/add-from-email")}
  className="mt-3 text-sm text-accent hover:underline"
>
  ✨ Or paste an email to auto-fill
</button>
      </div>

      {aiPrefilled && (
        <div
          className={`mb-6 p-4 rounded-xl border text-sm ${
            aiConfidence === "low"
              ? "bg-warning/10 border-warning/30 text-warning"
              : "bg-accent/10 border-accent/30 text-accent"
          }`}
        >
          {aiConfidence === "low"
            ? "⚠️ AI filled some fields but isn't fully sure — review carefully."
            : "✨ AI filled the details. Review and save."}
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Service Name */}
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-text-secondary block mb-2">
              Service Name *
            </label>
            <input
              type="text"
              name="serviceName"
              value={form.serviceName}
              onChange={handleChange}
              required
              placeholder="Netflix, Spotify, Adobe..."
              className="w-full p-3 bg-bg border border-border rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition"
            />
          </div>

          {/* Amount + Currency */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider text-text-secondary block mb-2">
                Amount *
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="649"
                className="w-full p-3 bg-bg border border-border rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition"
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-text-secondary block mb-2">
                Currency
              </label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full p-3 bg-bg border border-border rounded-xl text-white focus:outline-none focus:border-accent transition"
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          {/* Billing Cycle + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-text-secondary block mb-2">
                Billing Cycle
              </label>
              <select
                name="billingCycle"
                value={form.billingCycle}
                onChange={handleChange}
                className="w-full p-3 bg-bg border border-border rounded-xl text-white focus:outline-none focus:border-accent transition"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-text-secondary block mb-2">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full p-3 bg-bg border border-border rounded-xl text-white focus:outline-none focus:border-accent transition"
              >
                <option value="Entertainment">Entertainment</option>
                <option value="Productivity">Productivity</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-text-secondary block mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full p-3 bg-bg border border-border rounded-xl text-white focus:outline-none focus:border-accent transition"
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-text-secondary block mb-2">
                Renewal Date
              </label>
              <input
                type="date"
                name="renewalDate"
                value={form.renewalDate}
                onChange={handleChange}
                className="w-full p-3 bg-bg border border-border rounded-xl text-white focus:outline-none focus:border-accent transition"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-text-secondary block mb-2">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any extra details..."
              className="w-full p-3 bg-bg border border-border rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : "Save Subscription"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddSubscription;