const mongoose = require("mongoose");

const validCategories = ["Food", "Travel", "Bills", "Shopping", "Other"];

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than zero"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: validCategories,
        message: "Please choose a valid category",
      },
      default: "Other",
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", expenseSchema);
