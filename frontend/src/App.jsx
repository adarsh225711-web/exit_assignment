import { useState, useEffect, useMemo, useRef } from "react";
import ExpenseForm from "./components/ExpenseForm.jsx";
import ExpenseList from "./components/ExpenseList.jsx";
import {
  getAllExpenses,
  createExpense,
  editExpense,
  removeExpense,
} from "./api.js";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const formSectionRef = useRef(null);
  const messageTimerRef = useRef(null);

  const displayMessage = (type, text) => {
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }
    setStatusMessage({ type, text });
    messageTimerRef.current = setTimeout(() => {
      setStatusMessage(null);
    }, 3500);
  };

  const fetchExpensesList = async () => {
    try {
      const data = await getAllExpenses();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      displayMessage("error", err.message || "Failed to load expenses from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpensesList();
    return () => {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, []);

  // Calculate total amount spent whenever expenses state updates
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [expenses]);

  const handleSave = async (expenseData) => {
    try {
      if (selectedExpense) {
        await editExpense(selectedExpense._id, expenseData);
        displayMessage("success", "Expense updated successfully");
        setSelectedExpense(null);
      } else {
        await createExpense(expenseData);
        displayMessage("success", "New expense recorded successfully");
      }
      // Auto-refresh expenses list without page reload
      await fetchExpensesList();
      return true;
    } catch (err) {
      displayMessage("error", err.message || "Failed to save expense");
      return false;
    }
  };

  const handleStartEdit = (item) => {
    setSelectedExpense(item);
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDelete = async (item) => {
    const shouldDelete = window.confirm(
      `Delete expense "${item.title}" of ₹${Number(item.amount).toFixed(2)}?`
    );
    if (!shouldDelete) return;

    try {
      await removeExpense(item._id);
      if (selectedExpense?._id === item._id) {
        setSelectedExpense(null);
      }
      displayMessage("success", "Expense removed successfully");
      // Auto-refresh expenses list without page reload
      await fetchExpensesList();
    } catch (err) {
      displayMessage("error", err.message || "Failed to delete expense");
    }
  };

  return (
    <div className="page-wrapper">
      <header className="site-header">
        <div className="header-inner">
          <div className="site-title-group">
            <h1>Personal Expense Tracker</h1>
            <p>Track your daily spending and manage your budget</p>
          </div>
          <div className="db-badge">
            <span className="dot"></span> MongoDB Atlas Connected
          </div>
        </div>
      </header>

      <main className="page-container">
        {/* Total Amount Spent Summary at the top */}
        <section className="summary-banner">
          <div className="summary-box primary-stat">
            <span className="stat-caption">Total Amount Spent</span>
            <div className="stat-number">₹{totalSpent.toFixed(2)}</div>
            <span className="stat-sub">Updated automatically on every change</span>
          </div>

          <div className="summary-box">
            <span className="stat-caption">Total Transactions</span>
            <div className="stat-number-sm">{expenses.length}</div>
            <span className="stat-sub">Entries in database</span>
          </div>

          <div className="summary-box">
            <span className="stat-caption">Average Expense</span>
            <div className="stat-number-sm">
              ₹{expenses.length > 0 ? (totalSpent / expenses.length).toFixed(2) : "0.00"}
            </div>
            <span className="stat-sub">Per transaction</span>
          </div>
        </section>

        {/* Status Alert Notification */}
        {statusMessage && (
          <div className={`notification-banner ${statusMessage.type}`}>
            <span>{statusMessage.text}</span>
            <button
              type="button"
              className="close-notification"
              onClick={() => setStatusMessage(null)}
            >
              ×
            </button>
          </div>
        )}

        {/* Content Layout */}
        <div className="workspace-grid">
          <div ref={formSectionRef} className="form-side">
            <ExpenseForm
              selectedExpense={selectedExpense}
              onSubmitExpense={handleSave}
              onCancelEdit={() => setSelectedExpense(null)}
            />
          </div>

          <div className="list-side">
            <ExpenseList
              expenses={expenses}
              loading={loading}
              activeEditId={selectedExpense?._id}
              onEditClick={handleStartEdit}
              onDeleteClick={handleDelete}
            />
          </div>
        </div>
      </main>

      <footer className="site-footer">
        Personal Expense Tracker • MERN Stack (Node.js, Express, React, MongoDB Atlas)
      </footer>
    </div>
  );
}
