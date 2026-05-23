import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddSubscription from "./pages/AddSubscription";
import Navbar from "./components/Navbar";
import SubscriptionsList from "./pages/SubscriptionsList";
import EditSubscription from "./pages/EditSubscription";
import AddFromEmail from "./pages/AddFromEmail";
import Analytics from "./pages/Analytics";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/subscriptions" element={<SubscriptionsList />} />
<Route path="/edit-subscription/:id" element={<EditSubscription />} />
<Route
  path="/add-from-email"
  element={<PrivateRoute><AddFromEmail /></PrivateRoute>}
/>
<Route
  path="/analytics"
  element={<PrivateRoute><Analytics /></PrivateRoute>}
/>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-subscription"
          element={
            <PrivateRoute>
              <AddSubscription />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;