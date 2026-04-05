# Finance Dashboard

A clean, interactive finance dashboard built with **React + Vite** for tracking and understanding financial activity.

**Live Demo:** [https://finance-dashboard-dusky-phi.vercel.app](https://finance-dashboard-dusky-phi.vercel.app)

**GitHub:** [https://github.com/shalini-sinha-codes/finance-dashboard](https://github.com/shalini-sinha-codes/finance-dashboard)

---

## Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/shalini-sinha-codes/finance-dashboard.git
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

App runs at `http://localhost:5173`

**Requirements:** Node.js 18+

---

## Project Structure

```
finance-dashboard/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx               # Entry point
    ├── App.jsx                # Root layout + scroll-spy
    ├── App.css                # All component styles
    ├── index.css              # CSS variables (light/dark themes)
    ├── context/
    │   └── AppContext.jsx     # Central state management (Context API)
    ├── data/
    │   └── transactions.js    # Mock seed data (2 months of transactions)
    └── components/
        ├── Sidebar.jsx        # Navigation with active scroll-spy
        ├── SummaryCards.jsx   # Balance / Income / Expense cards
        ├── Charts.jsx         # Line chart + Pie chart (Recharts)
        ├── AddTransaction.jsx # Admin-only add form with validation
        ├── TransactionsTable.jsx  # Filterable, searchable, sortable table
        ├── Insights.jsx       # Key metrics + monthly comparison table
        └── ExportButton.jsx   # CSV / JSON export dropdown
```

---

## How It Meets the Requirements

### 1. Dashboard Overview
- **Summary cards** showing Total Balance, Total Income, and Total Expenses with color-coded icons
- **Balance trend** (line chart) — running balance plotted over time across all transactions
- **Spending breakdown** (pie chart) — expenses grouped by category with percentage labels
- Cards animate in on load with fade-up transitions

### 2. Transactions Section
- Full table with **Date, Amount, Category, Type** columns
- **Search** — live search across category and type fields
- **Filter** — by type (income/expense), by category (dynamic dropdown), by date range
- **Sort** — by date (newest/oldest) or amount (high/low)
- Live **record count** shows how many results match current filters
- **Clear filters** button appears when any filter is active
- Empty state message when no results match

### 3. Role-Based UI
Roles are switched via a dropdown in the top-right corner of the topbar.

| Action | Viewer | Admin |
|---|---|---|
| View dashboard, charts, insights | ✅ | ✅ |
| View and filter transactions | ✅ | ✅ |
| Add new transaction | ❌ | ✅ |
| Edit existing transaction inline | ❌ | ✅ |
| Delete transaction (with confirmation) | ❌ | ✅ |

The Add Transaction form only renders for Admin. The Actions column in the table only appears for Admin.

### 4. Insights Section
- **Highest spending category** with total amount
- **Monthly comparison table** — Income vs Expenses vs Net for each month side by side
- **Savings rate** percentage
- **Financial status** — "On Track" or "Overspending" based on income vs expenses
- **Average transaction value** across all records
- Empty state when no transactions exist

### 5. State Management
All state is centralized in `AppContext.jsx` using React's built-in **Context API** — no external library needed.

| State | Description |
|---|---|
| `transactions` | Full list, supports add / edit / delete, persisted to localStorage |
| `filters` | search, type, category, dateFrom, dateTo, sortBy, sortOrder |
| `filteredTransactions` | Derived — computed from transactions + filters inside context |
| `categories` | Derived — unique sorted list of categories for filter dropdown |
| `role` | 'viewer' or 'admin' — controls UI permissions |
| `darkMode` | Boolean — persisted to localStorage, sets `data-theme` on `<html>` |

### 6. UI & UX
- **Responsive** — sidebar collapses to horizontal nav on mobile, grids go single-column below 768px
- **Dark mode** — full CSS variable theming system, persists across browser sessions
- **Scroll-spy sidebar** — active nav item highlights automatically as you scroll
- **Sticky topbar** — page title updates to match the currently visible section
- **Empty states** — every component handles zero-data gracefully with icon + message
- **Form validation** — add transaction form prevents empty fields and negative amounts
- **Fade-up animations** on all cards and sections

---

## Optional Enhancements Implemented

| Enhancement | Details |
|---|---|
| Dark mode | CSS variable theming, persists via localStorage |
| Data persistence | Transactions and theme saved to localStorage |
| Export to CSV | Downloads all transactions as a `.csv` file |
| Export to JSON | Downloads all transactions as a `.json` file |
| Animations / transitions | Fade-up keyframe animations on cards and sections |

---

## Design Decisions

- **CSS Variables** power the entire theming system. Switching dark/light mode sets a single `data-theme` attribute on `<html>` — no JavaScript style toggling, no flash.
- **Context API** was chosen over Redux/Zustand because the app's state is simple and doesn't need middleware or time-travel debugging. All state fits cleanly in one context with derived values computed inline.
- **Recharts** was used for visualizations with custom tooltips styled to respect the active theme.
- **Mock data spans two months** (March + April 2026) so the monthly comparison insight is populated immediately on first load without needing to add data.
- **IntersectionObserver** powers scroll-spy — a clean native API with no library needed.
- **Inline edit in table** — admin can edit any row in place without a modal, keeping the workflow fast.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 5 | Build tool and dev server |
| Recharts | Data visualizations |
| React Icons | Icon library |
| CSS Custom Properties | Theming (no external UI library) |
| Context API | State management |

---

## Screenshots

> *(Add screenshots here after deployment)*
>
> Light mode — Dashboard overview  
> Dark mode — Transactions table  
> Admin role — Add transaction form  
> Insights — Monthly comparison  
