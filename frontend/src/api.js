const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api/expenses" : "/api/expenses");

async function apiCall(endpoint = "", options = {}) {
  const url = endpoint ? `${BASE_URL}/${endpoint}` : BASE_URL;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = result.message || "Request failed with status " + response.status;
    throw new Error(errorMsg);
  }

  return result;
}

export const getAllExpenses = () => apiCall();
export const createExpense = (expenseData) =>
  apiCall("", {
    method: "POST",
    body: JSON.stringify(expenseData),
  });
export const editExpense = (id, expenseData) =>
  apiCall(id, {
    method: "PUT",
    body: JSON.stringify(expenseData),
  });
export const removeExpense = (id) =>
  apiCall(id, {
    method: "DELETE",
  });
