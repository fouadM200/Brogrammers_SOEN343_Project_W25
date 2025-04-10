// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const User = require("./models/User");
const analyticsRoutes = require("./routes/analyticsRoutes");
const messageRoutes = require("./routes/message");
const chatRoutes = require("./routes/chatRoutes");


const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/messages", messageRoutes);

mongoose
  .connect("mongodb+srv://stevengourgy:1234@cluster0.weyt6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB connected");
    await createAdminUser();
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

async function createAdminUser() {
  try {
    const adminEmail = "admin@example.com"; 
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const adminUser = new User({
        name: "Site Administrator",
        email: adminEmail,
        password: "1234", 
        role: "admin",
      });

      await adminUser.save();
      console.log("✅ Admin user created:", adminEmail);
    } else {
      console.log("Admin user already exists. Skipping creation.");
    }
  } catch (err) {
    console.error("Error creating admin user:", err);
  }
}

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chat", chatRoutes);


const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
