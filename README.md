# Fintrek — Finance Dashboard

A premium, dark-themed personal finance dashboard built with React 18 + Vite 5.

---

## Features

- **Overview** — summary cards (balance, income, expenses, savings rate) with sparklines, monthly bar chart, spending donut, recent transactions
- **Transactions** — searchable, filterable (type, category, amount range, date range), sortable, groupable table; add/edit/delete in admin mode
- **Insights** — smart natural-language callouts, top category, month-over-month net, savings health score, full breakdown, trend chart
- **Role-based UI** — Admin (full CRUD) vs Viewer (read-only); toggle in header; viewer banner with quick switch
- **Dark / Light mode** — persisted to localStorage via ThemeContext
- **Mock API + localStorage** — simulated network latency, full CRUD, data reset; survives page refresh
- **Export** — one-click CSV and JSON download
- **Mobile-first responsive** — sticky header, bottom tab bar on small screens, card layout for transactions on mobile
- **Empty states** — all views handle zero-data gracefully with contextual messaging
- **Micro-interactions** — card hover lift, button scale, animated progress bars, tab fade transitions

---

## My Approach

### Architecture decisions

State management is intentionally right-sized for this scope. All transaction CRUD logic is extracted into a custom hook (`useTransactions.js`), keeping `App.jsx` clean and making the logic independently testable. Theme state uses a dedicated `ThemeContext` to avoid prop-drilling across the full tree. If this scaled to a larger app, the custom hook pattern already provides a clean migration path to a service layer or Zustand store — the interface wouldn't change.

### Component structure

Each tab is its own component receiving only the props it needs. Charts are isolated in `Charts.jsx` for reuse and independent testing. Global concerns (modal, toast, loader) live in `App.jsx` because they're tied to app-level CRUD actions. `Modal.jsx` handles its own form validation state.

### Mock API

`api.js` simulates a real backend with 400ms delays per operation, full localStorage persistence, and a factory reset endpoint. This mirrors a real integration pattern and lets the UI demonstrate proper loading states, error handling, and optimistic updates — without needing a server.

### Styling

All styles are CSS-in-JS (inline styles + scoped `<style>` blocks). Zero external styling dependencies keeps the bundle lean. Responsive breakpoints live inside each component's `<style>` block, scoped to that component's class names.

### Design decisions

- Dark surface (`#080c14`) with subtle gradient cards and inset highlights creates product-grade depth without heavy decoration
- Coloured top accent bars on stat cards create visual hierarchy at a glance
- Hover lift (`translateY(-3px)`) on all cards gives the interface tactile feel
- All charts are custom SVG — no chart library — to show rendering fundamentals and keep the bundle minimal
- Smart Insights section generates natural-language callouts ("You spent 40% more on Food this month") rather than raw numbers
- Savings health score uses the standard 20% threshold as a benchmark

### Assumptions

- All amounts in Indian Rupees (₹), `en-IN` locale formatting
- "Savings rate" = `(income − expenses) / income × 100`
- Role switching is frontend-only (no auth server) — appropriate for a demo context
- Month-over-month comparison uses the two most recent months in `MONTHLY_DATA`

---

## Setup & Run

### Prerequisites

- Node.js v18 or higher → https://nodejs.org

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

### Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
  App.jsx             ← Root component, tab routing, header, modal/toast orchestration
  useTransactions.js  ← Custom hook: all CRUD state and API calls
  theme.jsx           ← ThemeContext + design token generator (dark/light)
  api.js              ← Mock API with localStorage persistence and simulated latency
  data.js             ← Seed transactions, monthly data, category colors & icons
  exportUtils.js      ← CSV and JSON export helpers
  Charts.jsx          ← Sparkline, DonutChart, BarChart, TrendChart (all custom SVG)
  Overview.jsx        ← Dashboard summary: stat cards, charts, recent transactions
  Transactions.jsx    ← Filterable, sortable, groupable transaction table
  Insights.jsx        ← Smart analytics, savings health, spending breakdown
  Modal.jsx           ← Add / Edit transaction modal with validation
  main.jsx            ← React entry point
```

---

## Tech Stack

| Layer       | Choice                          | Why                                               |
|-------------|----------------------------------|---------------------------------------------------|
| Framework   | React 18                        | Industry standard, hooks-first                    |
| Build tool  | Vite 5                          | Fast HMR, minimal config                         |
| Styling     | CSS-in-JS (inline + style tags) | Zero deps, co-located, scoped                    |
| Charts      | Custom SVG                      | No library overhead, full design control          |
| State       | useState + custom hook + Context | Right-sized; clean migration path if scale grows |
| Persistence | localStorage via mock API       | Simulates real API; data survives refresh         |

---

## Optional Enhancements Included

- Dark/light mode with persistence
- localStorage data persistence (mock API layer)
- Simulated async API with loading and error states
- Smart natural-language insights (not just raw numbers)
- Smooth animations, card hover effects, micro-interactions
- Export functionality (CSV and JSON)
- Advanced filtering (amount range, date range, grouping by category/month/type)
- Mobile bottom navigation bar
- Toast notifications for all CRUD operations
- Custom savings health score metric
