import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Hide navbar on login/register
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  if (!token) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Helper: is this link the active page?
  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  // Shared link classes — active state highlights with accent purple
  const linkClass = (path) =>
    `px-4 py-2 rounded-xl transition text-sm ${
      isActive(path)
        ? "text-white bg-bg-card"
        : "text-text-secondary hover:text-white hover:bg-bg-card"
    }`;

  return (
    <nav className="border-b border-border bg-bg-card/50 backdrop-blur sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="text-white font-bold text-xl">
          TrackWise
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>
          <Link to="/subscriptions" className={linkClass("/subscriptions")}>
            Subscriptions
          </Link>
          <Link to="/analytics" className={linkClass("/analytics")}>
            📊 Analytics
          </Link>
          <button
            onClick={handleLogout}
            className="text-text-secondary hover:text-white px-4 py-2 rounded-xl hover:bg-bg-card transition text-sm ml-2"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;