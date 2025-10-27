const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const app = express();

// ==========================================================
// 1. MIDDLEWARE
// ==========================================================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3001",
      "https://your-frontend-url.vercel.app", // ⭐ ADD YOUR DEPLOYED FRONTEND URL HERE
    ],
    credentials: true,
  })
);
app.use(express.json());

// ==========================================================
// 2. DATABASE CONNECTION
// ==========================================================
const connectDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Exit on connection failure
  }
};
connectDB();

// ==========================================================
// 3. ROUTES
// ==========================================================
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const authRoutes = require("./routes/authRoutes");
//const paymentRoutes = require("./routes/paymentRoutes");

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "Hospital Management System API is running",
    status: "active",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);
//app.use("/api/payments", paymentRoutes);

// ==========================================================
// 4. REMOVED FRONTEND SERVING (Deploy separately)
// ==========================================================
// ✅ Frontend is deployed separately on Vercel/Netlify
// ❌ No need to serve static files from backend

// ==========================================================
// 5. START SERVER
// ==========================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;