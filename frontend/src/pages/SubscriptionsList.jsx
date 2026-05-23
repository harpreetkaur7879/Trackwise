import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";
import Button from "../components/Button";
import ConfirmDialog from "../components/ConfirmDialog";

// Category → emoji mapping for visual flair
const CATEGORY_ICONS = {
  Entertainment: "🎬",
  Productivity: "💼",
  Health: "💪",
  Education: "📚",
  Shopping: "🛍️",
  Other: "📦",
};

// Category → tailwind color class for the badge
const CATEGORY_COLORS = {
  Entertainment: "bg-accent/10 text-accent",
  Productivity: "bg-success/10 text-success",
  Health: "bg-danger/10 text-danger",
  Education: "bg-warning/10 text-warning",
  Shopping: "bg-accent-light/10 text-accent-light",
  Other: "bg-text-muted/10 text-text-secondary",
};

const SubscriptionsList = () => {
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Filter state
  const [filter, setFilter] = useState("All"); // All | Active | Paused | Cancelled

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/subscriptions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubscriptions(data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not load subscriptions."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/subscriptions/${deleteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubscriptions((prev) => prev.filter((s) => s._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete.");
    } finally {
      setDeleting(false);
    }
  };

  // Filtered list
  const filteredSubs =
    filter === "All"
      ? subscriptions
      : subscriptions.filter((s) => s.status === filter);

  // Find the subscription being deleted (for modal message)
  const subToDelete = subscriptions.find((s) => s._id === deleteId);

  // Format date as "May 13, 2026"
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 py-12">
        <p className="text-text-secondary">Loading subscriptions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            All Subscriptions
          </h1>
          <p className="text-text-secondary">
            {subscriptions.length} subscription
            {subscriptions.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate("/add-from-email")}
          >
            ✨ Add from Email
          </Button>
          <Button onClick={() => navigate("/add-subscription")}>
            + Add Subscription
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["All", "Active", "Paused", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
              filter === tab
                ? "bg-accent text-white"
                : "bg-bg-card text-text-secondary hover:text-white hover:bg-bg-hover"
            }`}
          >
            {tab}
            {tab !== "All" && (
              <span className="ml-2 text-xs opacity-70">
                {subscriptions.filter((s) => s.status === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Empty States */}
      {!error && subscriptions.length === 0 && (
        <Card className="text-center py-16">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            No subscriptions yet
          </h2>
          <p className="text-text-secondary mb-6">
            Start tracking your recurring expenses to see them here.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/add-subscription")}>
              Add Your First
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/add-from-email")}
            >
              ✨ Add from Email
            </Button>
          </div>
        </Card>
      )}

      {!error &&
        subscriptions.length > 0 &&
        filteredSubs.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-text-secondary">
              No {filter.toLowerCase()} subscriptions.
            </p>
          </Card>
        )}

      {/* List */}
      {filteredSubs.length > 0 && (
        <div className="space-y-3">
          {filteredSubs.map((sub) => (
            <Card key={sub._id} hover className="!p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Left: Icon + Name + Category */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                      CATEGORY_COLORS[sub.category] || CATEGORY_COLORS.Other
                    }`}
                  >
                    {CATEGORY_ICONS[sub.category] || CATEGORY_ICONS.Other}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-semibold truncate">
                        {sub.serviceName}
                      </h3>
                      {sub.status !== "Active" && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md ${
                            sub.status === "Paused"
                              ? "bg-warning/10 text-warning"
                              : "bg-danger/10 text-danger"
                          }`}
                        >
                          {sub.status}
                        </span>
                      )}
                    </div>
                    <div className="text-text-secondary text-sm">
                      {sub.category} · Renews {formatDate(sub.renewalDate)}
                    </div>
                  </div>
                </div>

                {/* Middle: Amount */}
                <div className="text-left md:text-right">
                  <div className="text-white font-bold text-lg">
                    {sub.currency} {sub.amount}
                  </div>
                  <div className="text-text-secondary text-xs">
                    {sub.billingCycle}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/edit-subscription/${sub._id}`}
                    className="px-3 py-2 text-sm bg-bg-hover hover:bg-border-light text-text-secondary hover:text-white rounded-lg transition"
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => setDeleteId(sub._id)}
                    className="px-3 py-2 text-sm bg-danger/10 hover:bg-danger/20 text-danger rounded-lg transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={!!deleteId}
        title="Delete subscription?"
        message={
          subToDelete
            ? `"${subToDelete.serviceName}" will be permanently removed. This can't be undone.`
            : "This can't be undone."
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
};

export default SubscriptionsList;