import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";
import Button from "../components/Button";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        form
      );
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">TrackWise</h1>
          <p className="text-text-secondary">Welcome back</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-text-secondary block mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 bg-bg border border-border rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-text-secondary block mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-3 bg-bg border border-border rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-sm">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-text-secondary text-sm mt-6">
            New to TrackWise?{" "}
            <Link to="/register" className="text-accent hover:text-accent-light">
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Login;