import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";
import Button from "../components/Button";

const EditSubscription = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    serviceName: "",
    amount: "",
    currency: "INR",
    billingCycle: "monthly",
    startDate: "",
    renewalDate: "",
    category: "Other",
    status: "Active",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing subscription on mount
  useEffect(() => {
    const fetchSub = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/subscriptions/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const sub = data.data;
        setForm({
          serviceName: sub.serviceName || "",
          amount: sub.amount ? String(sub.amount) : "",
          currency: sub.currency || "INR",
          billingCycle: sub.billingCycle || "monthly",
          startDate: sub.startDate ? sub.startDate.split("T")[0] : "",
          renewalDate: sub.renewalDate ? sub.renewalDate.split("T")[0] : "",
          category: sub.category || "Other",
          status: sub.status || "Active",
          notes: sub.notes || "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load subscription."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSub();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setError("");
    if (!form.serviceName.trim() || !form.amount || !form.renewalDate) {
      setError("Service name, amount, and renewal date are required.");
      return;
    }
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/subscriptions/${id}`,
        { ...form, amount: Number(form.amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/subscriptions");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 py-12">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Edit Subscription
        </h1>
        <p className="text-text-secondary">Update the details below.</p>
      </div>

      <Card className="mb-6">
        <div className="space-y-5">
          {/* Service Name */}
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-text-secondary block mb-2">
              Service Name
            </label>
            <input
              type="text"
              name="serviceName"
              value={form.serviceName}
              onChange={handleChange}
              className="w-full p-3 bg-bg border border-border rounded-xl text-white focus:outline-none focus:border-accent transition"
            />
          </div>

          {/* Amount + Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-medium uppercase tracking-wider text-text-secondary block mb-2">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full p-3 bg-bg border border-border rounded-xl text-white focus:outline-none focus:border-accent transition"
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
          <div className="grid grid-cols-2 gap-3">
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

          {/* Start Date + Renewal Date */}
          <div className="grid grid-cols-2 gap-3">
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

          {/* Status */}
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-text-secondary block mb-2">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-3 bg-bg border border-border rounded-xl text-white focus:outline-none focus:border-accent transition"
            >
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Cancelled">Cancelled</option>
            </select>
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
              className="w-full p-3 bg-bg border border-border rounded-xl text-white focus:outline-none focus:border-accent transition resize-none"
            />
          </div>
        </div>
      </Card>

      {error && (
        <div className="mb-4 p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving} className="flex-1">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate("/subscriptions")}
          disabled={saving}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditSubscription;