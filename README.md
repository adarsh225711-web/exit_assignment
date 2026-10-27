# Personal Expense Tracker

A daily personal expense tracking application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows users to record, organize, edit, and delete their daily expenditures with automatic total calculation.

## Features
- **Add Expense**: Form with Title, Amount, Category (Food, Travel, Bills, Shopping, Other), and Date. Input validation prevents blank or negative values.
- **View Expenses**: Lists all logged expenses with automatic refreshing after additions, modifications, or deletions without reloading the browser.
- **Edit Expense**: Pre-fills the form with current expense details to update in MongoDB and reflect immediately on screen.
- **Delete Expense**: Removes records with a confirmation prompt before deletion.
- **Total Summary**: Live Total Amount Spent displayed prominently at the top of the dashboard.
- **Responsive Interface**: Mobile and desktop friendly table and card layout.

## Project Structure
```
project-root/
├── backend/
│   ├── models/
│   │   └── Expense.js
│   ├── routes/
│   │   └── expenseRoutes.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExpenseForm.jsx
│   │   │   └── ExpenseList.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── package.json
├── render.yaml
└── README.md
```

## Running the Application Locally

### Prerequisites
- Node.js (v18+)
- npm

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
The server will run on `http://localhost:5000`.

### 2. Frontend Setup
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
The client will run on `http://localhost:5173`.

### Or Combined (Production Build)
From the root folder:
```bash
npm run build
npm start
```
Open `http://localhost:5000` to access the full application.

## API Endpoints
- `GET /api/expenses` - Retrieve all expenses (newest first)
- `GET /api/expenses/:id` - Retrieve a single expense by ID
- `POST /api/expenses` - Add a new expense record
- `PUT /api/expenses/:id` - Update an existing expense
- `DELETE /api/expenses/:id` - Delete an expense by ID
- `GET /api/health` - Health check and MongoDB status

## Environment Variables
The `backend/.env` file is included in this repository with test credentials for evaluator review:
```
PORT=5000
MONGO_URI=mongodb+srv://adarsh225711_db_user:FTnAF3_zSFXMXY5@cluster0.jsmtxxj.mongodb.net/expense_tracker?retryWrites=true&w=majority
```

## Deployment on Render
The application includes `render.yaml` and unified build scripts for deployment on Render.
1. Connect this repository on [Render Dashboard](https://dashboard.render.com).
2. Create a Web Service with:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Add environment variable `MONGO_URI`.
