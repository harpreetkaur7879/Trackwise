const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "TrackWise API is running ✅" });
});

// Routes
const authRoutes = require("./routes/authRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
 const parseEmailRoutes = require("./routes/parseEmailRoutes");      
const analyticsRoutes = require("./routes/analyticsRoutes");       

app.use("/api/auth", authRoutes);
app.use("/api/subscriptions", subscriptionRoutes);  
app.use("/api/subscriptions", parseEmailRoutes);     
app.use("/api/analytics", analyticsRoutes);        

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});