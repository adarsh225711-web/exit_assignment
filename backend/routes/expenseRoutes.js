const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Expense = require("../models/Expense");

// Fetch all expenses (sorted by date descending)
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1, createdAt: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expenses: " + error.message });
  }
});

// Fetch single expense by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid expense ID" });
    }
    const item = await Expense.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new expense
router.post("/", async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }

    if (!date) {
      return res.status(400).json({ message: "Please select a date" });
    }

    const newExpense = new Expense({
      title: title.trim(),
      amount: numAmount,
      category: category || "Other",
      date: new Date(date),
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: error.message });
  }
});

// Update an existing expense
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid expense ID" });
    }

    const { title, amount, category, date } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      updates.title = title.trim();
    }

    if (amount !== undefined) {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({ message: "Amount must be greater than zero" });
      }
      updates.amount = numAmount;
    }

    if (category) {
      updates.category = category;
    }

    if (date) {
      updates.date = new Date(date);
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: error.message });
  }
});

// Delete an expense
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid expense ID" });
    }

    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
