import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CATEGORIES = ["Entertainment", "Productivity", "Health", "Education", "Shopping", "Other"];
const BILLING_CYCLES = ["monthly", "yearly"];
const CURRENCIES = ["INR", "USD", "EUR", "GBP"];

const inputClass = "w-full p-3 bg-bg border border-border rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition text-sm";
const labelClass = "text-xs font-medium uppercase tracking-wider text-text-secondary block mb-2";

export default function AddFromEmail() {
  const navigate = useNavigate();
  const [step, setStep] = useState("input");
  const [emailText, setEmailText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");
  const [parsed, setParsed] = useState(null);
  const [form, setForm] = useState({});

  const handleParse = async () => {
    if (emailText.trim().length < 20) return setError("Please paste a longer email or SMS text.");
    setError("");
    setParsing(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/subscriptions/parse-email`,
        { emailText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setParsed(data.data);
      setForm({
        serviceName: data.data.serviceName || "",
        amount: data.data.amount || "",
        currency: data.data.currency || "INR",
        billingCycle: data.data.billingCycle || "monthly",
        category: data.data.category || "Other",
        startDate: data.data.startDate || "",
        renewalDate: data.data.renewalDate || "",
        notes: "",
      });
      setStep("review");
    } catch (err) {
      setError(err.response?.data?.message || "Could not parse email. Try adding manually.");
    } finally {
      setParsing(false);
    }
  };

  const handleSave = async () => {
    setError("");
    setStep("saving");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/subscriptions`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/subscriptions");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save.");
      setStep("review");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="max-w-2xl mx-auto p-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="text-text-secondary hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors">
          ← Back
        </button>
        <h1 className="text-4xl font-bold text-white mb-2">Add from Email</h1>
        <p className="text-text-secondary">Paste your subscription email or SMS — AI will extract the details</p>
      </div>

      {/* Step 1 — Paste Email */}
      {step === "input" && (
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-7 h-7 bg-accent rounded-full flex items-center justify-center text-xs font-bold text-white">1</span>
            <span className="font-semibold text-white">Paste your email or SMS</span>
          </div>

          {error && (
            <div className="p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-sm">{error}</div>
          )}

          <textarea
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            rows={10}
            placeholder={`Example:\n\nYour Netflix subscription has been renewed.\nAmount charged: ₹649\nBilling cycle: Monthly\nNext renewal: June 20, 2026`}
            className="w-full p-4 bg-bg border border-border rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition text-sm font-mono leading-relaxed resize-none"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-text-secondary text-xs">{emailText.length} / 10,000 characters</span>
            <button
              onClick={handleParse}
              disabled={parsing || emailText.trim().length < 20}
              className="bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-medium text-sm transition"
            >
              {parsing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : "✨ Extract Details"}
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Review & Edit */}
      {(step === "review" || step === "saving") && parsed && (
        <div className="space-y-5">
          {/* Confidence badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${
            parsed.confidence === "high" ? "bg-success/10 text-success border-success/20" :
            parsed.confidence === "medium" ? "bg-warning/10 text-warning border-warning/20" :
            "bg-danger/10 text-danger border-danger/20"
          }`}>
            {parsed.confidence === "high" ? "✅ High confidence — looks good!" :
             parsed.confidence === "medium" ? "⚠️ Medium confidence — please review" :
             "❓ Low confidence — check carefully"}
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 bg-accent rounded-full flex items-center justify-center text-xs font-bold text-white">2</span>
              <span className="font-semibold text-white">Review & confirm details</span>
            </div>

            {error && (
              <div className="p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-sm">{error}</div>
            )}

            {/* Service Name */}
            <div>
              <label className={labelClass}>Service Name</label>
              <input name="serviceName" value={form.serviceName} onChange={handleChange} className={inputClass} />
            </div>

            {/* Amount + Currency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Amount</label>
                <input name="amount" type="number" value={form.amount} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Currency</label>
                <select name="currency" value={form.currency} onChange={handleChange} className={inputClass}>
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Billing + Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Billing Cycle</label>
                <select name="billingCycle" value={form.billingCycle} onChange={handleChange} className={inputClass}>
                  {BILLING_CYCLES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Start Date</label>
                <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Renewal Date</label>
                <input name="renewalDate" type="date" value={form.renewalDate} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className={labelClass}>Notes (optional)</label>
              <input name="notes" value={form.notes} onChange={handleChange} placeholder="Any extra notes..." className={inputClass} />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep("input")} className="px-5 py-2.5 bg-surface border border-border hover:border-accent text-white rounded-xl text-sm font-medium transition">
                ← Try Again
              </button>
              <button
                onClick={handleSave}
                disabled={step === "saving"}
                className="flex-1 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white py-2.5 rounded-xl font-medium text-sm transition"
              >
                {step === "saving" ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : "Save Subscription"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}