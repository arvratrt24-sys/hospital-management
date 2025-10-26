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

app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);
//app.use("/api/payments", paymentRoutes);

// ==========================================================
// 4. SERVE REACT FRONTEND (Optional for local test)
// ==========================================================
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
  });
}

// ==========================================================
// 5. EXPORT APP (Instead of app.listen())
// ==========================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


module.exports = app;