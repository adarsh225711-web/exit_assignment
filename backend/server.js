const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/expenses", expenseRoutes);

// Status check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Serve frontend in production / Render
const frontendDist = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDist));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  const indexHtml = path.join(frontendDist, "index.html");
  res.sendFile(indexHtml, (err) => {
    if (err) {
      res.send("Personal Expense Tracker Backend API is running");
    }
  });
});

const PORT = process.env.PORT || 5000;
const DB_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://adarsh225711_db_user:FTnAF3_zSFXMXY5@cluster0.jsmtxxj.mongodb.net/expense_tracker?retryWrites=true&w=majority";

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas successfully");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Atlas connection error:", err.message);
    process.exit(1);
  });
