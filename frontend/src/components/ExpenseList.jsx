import { useState } from "react";

const CATEGORIES = ["All", "Food", "Travel", "Bills", "Shopping", "Other"];

export default function ExpenseList({
  expenses,
  loading,
  activeEditId,
  onEditClick,
  onDeleteClick,
}) {
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const formatDisplayDate = (d) => {
    if (!d) return "";
    try {
      const dateObj = new Date(d);
      return dateObj.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return d;
    }
  };

  const filteredItems = expenses.filter((item) => {
    const matchesCategory =
      filterCategory === "All" || item.category === filterCategory;
    const matchesSearch =
      !searchTerm.trim() ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="expense-panel">
        <div className="status-note">Loading expenses...</div>
      </div>
    );
  }

  return (
    <div className="expense-panel">
      <div className="list-top-bar">
        <h3>Expense Records ({filteredItems.length})</h3>

        <div className="controls-row">
          <input
            type="text"
            className="search-input"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-message">No expenses logged yet. Add your first expense on the left!</div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-message">No expenses match your search or filter.</div>
      ) : (
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr
                  key={item._id}
                  className={activeEditId === item._id ? "selected-row" : ""}
                >
                  <td data-label="Title" className="td-title">
                    {item.title}
                  </td>
                  <td data-label="Amount" className="td-amount">
                    ₹{Number(item.amount).toFixed(2)}
                  </td>
                  <td data-label="Category" className="td-category">
                    <span className={`cat-pill cat-${item.category.toLowerCase()}`}>
                      {item.category}
                    </span>
                  </td>
                  <td data-label="Date" className="td-date">
                    {formatDisplayDate(item.date)}
                  </td>
                  <td data-label="Actions" className="td-actions">
                    <button
                      type="button"
                      className="action-btn edit-btn"
                      onClick={() => onEditClick(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="action-btn delete-btn"
                      onClick={() => onDeleteClick(item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
