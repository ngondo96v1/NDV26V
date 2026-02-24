import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { User, Loan, Notification, System } from "../models";

const app = express();

let isConnected = false;
let dbError: string | null = null;

async function connectDB() {
  if (isConnected) return;
  
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ngondo96:119011@ndv261.n9yuhgn.mongodb.net/ndv261?retryWrites=true&w=majority&appName=NDV261";
  
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    dbError = null;
    console.log("Successfully connected to MongoDB");
    
    // Initialize system settings if not exists
    const system = await System.findOne({ key: "main" });
    if (!system) {
      await System.create({ key: "main", budget: 30000000, rankProfit: 0 });
    }
  } catch (err: any) {
    isConnected = false;
    dbError = err.message || JSON.stringify(err);
    console.error("MongoDB connection error details:", err);
  }
}

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Middleware to connect to DB
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Status endpoint to check DB connection
app.get("/api/db-status", (req, res) => {
  res.json({
    connected: isConnected,
    error: dbError,
    uri_provided: !!process.env.MONGODB_URI,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.get("/api/data", async (req, res) => {
  try {
    const [users, loans, notifications, system] = await Promise.all([
      User.find({}),
      Loan.find({}),
      Notification.find({}).sort({ createdAt: -1 }).limit(200),
      System.findOne({ key: "main" })
    ]);
    
    res.json({
      users,
      loans,
      notifications,
      budget: system?.budget || 30000000,
      rankProfit: system?.rankProfit || 0
    });
  } catch (e) {
    console.error("Lỗi trong /api/data:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const incomingUsers = req.body;
    if (!Array.isArray(incomingUsers)) return res.status(400).json({ error: "Invalid data" });

    for (const u of incomingUsers) {
      await User.findOneAndUpdate({ id: u.id }, u, { upsert: true, new: true });
    }
    
    res.json({ success: true });
  } catch (e) {
    console.error("Lỗi trong POST /api/users:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/loans", async (req, res) => {
  try {
    const incomingLoans = req.body;
    if (!Array.isArray(incomingLoans)) return res.status(400).json({ error: "Invalid data" });

    for (const l of incomingLoans) {
      await Loan.findOneAndUpdate({ id: l.id }, l, { upsert: true, new: true });
    }
    
    res.json({ success: true });
  } catch (e) {
    console.error("Lỗi trong POST /api/loans:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/notifications", async (req, res) => {
  try {
    const incomingNotifs = req.body;
    if (!Array.isArray(incomingNotifs)) return res.status(400).json({ error: "Invalid data" });

    for (const n of incomingNotifs) {
      await Notification.findOneAndUpdate({ id: n.id }, n, { upsert: true, new: true });
    }
    
    res.json({ success: true });
  } catch (e) {
    console.error("Lỗi trong POST /api/notifications:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/budget", async (req, res) => {
  try {
    await System.findOneAndUpdate({ key: "main" }, { budget: req.body.budget }, { upsert: true });
    res.json({ success: true });
  } catch (e) {
    console.error("Lỗi trong POST /api/budget:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/rankProfit", async (req, res) => {
  try {
    await System.findOneAndUpdate({ key: "main" }, { rankProfit: req.body.rankProfit }, { upsert: true });
    res.json({ success: true });
  } catch (e) {
    console.error("Lỗi trong POST /api/rankProfit:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    await Promise.all([
      User.deleteOne({ id: userId }),
      Loan.deleteMany({ userId: userId }),
      Notification.deleteMany({ userId: userId })
    ]);
    res.json({ success: true });
  } catch (e) {
    console.error("Lỗi trong DELETE /api/users/:id:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default app;
