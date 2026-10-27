import { useState, useEffect } from "react";

const CATEGORY_LIST = ["Food", "Travel", "Bills", "Shopping", "Other"];

export default function ExpenseForm({ selectedExpense, onSubmitExpense, onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedExpense) {
      setTitle(selectedExpense.title || "");
      setAmount(selectedExpense.amount !== undefined ? String(selectedExpense.amount) : "");
      setCategory(selectedExpense.category || "Food");
      if (selectedExpense.date) {
        setDate(new Date(selectedExpense.date).toISOString().split("T")[0]);
      }
      setErrorMessage("");
    } else {
      resetForm();
    }
  }, [selectedExpense]);

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategory("Food");
    setDate(new Date().toISOString().split("T")[0]);
    setErrorMessage("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage("Please enter an expense title");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Please enter a valid amount greater than 0");
      return;
    }

    if (!date) {
      setErrorMessage("Please pick a date");
      return;
    }

    setErrorMessage("");
    setSaving(true);

    const ok = await onSubmitExpense({
      title: title.trim(),
      amount: parsedAmount,
      category,
      date,
    });

    setSaving(false);

    if (ok && !selectedExpense) {
      resetForm();
    }
  };

  return (
    <div className={`expense-panel ${selectedExpense ? "panel-editing" : ""}`}>
      <div className="panel-title">
        <h3>{selectedExpense ? "Edit Expense" : "Add New Expense"}</h3>
        {selectedExpense && <span className="mode-tag">Editing</span>}
      </div>

      {errorMessage && <div className="form-error-box">{errorMessage}</div>}

      <form onSubmit={handleFormSubmit}>
        <div className="input-field">
          <label htmlFor="expense-title">Title *</label>
          <input
            id="expense-title"
            type="text"
            placeholder="e.g. Grocery items"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errorMessage) setErrorMessage("");
            }}
          />
        </div>

        <div className="input-field">
          <label htmlFor="expense-amount">Amount (₹) *</label>
          <input
            id="expense-amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (errorMessage) setErrorMessage("");
            }}
          />
        </div>

        <div className="input-field">
          <label htmlFor="expense-category">Category *</label>
          <select
            id="expense-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORY_LIST.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="input-field">
          <label htmlFor="expense-date">Date *</label>
          <input
            id="expense-date"
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              if (errorMessage) setErrorMessage("");
            }}
          />
        </div>

        <div className="form-btn-row">
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? "Saving..." : selectedExpense ? "Update Expense" : "Add Expense"}
          </button>
          {selectedExpense && (
            <button
              type="button"
              className="btn-cancel"
              onClick={onCancelEdit}
              disabled={saving}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
