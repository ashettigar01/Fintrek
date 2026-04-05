export const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Housing: '#6366f1',
  Transport: '#10b981',
  Shopping: '#f43f5e',
  Health: '#06b6d4',
  Entertainment: '#8b5cf6',
  Utilities: '#64748b',
  Travel: '#0ea5e9',
  Salary: '#10b981',
  Freelance: '#22d3ee',
  Investment: '#f59e0b',
}

export const CATEGORY_ICONS = {
  Food: '🍽️',
  Housing: '🏠',
  Transport: '🚗',
  Shopping: '🛍️',
  Health: '💊',
  Entertainment: '🎬',
  Utilities: '⚡',
  Travel: '✈️',
  Salary: '💰',
  Freelance: '💻',
  Investment: '📈',
}

export const ALL_CATEGORIES = Object.keys(CATEGORY_COLORS)

export const INITIAL_TRANSACTIONS = [
  { id: 1,  date: '2025-06-01', description: 'Monthly Salary',     amount: 55000,  category: 'Salary',        type: 'income'  },
  { id: 2,  date: '2025-06-02', description: 'Rent Payment',        amount: -6200, category: 'Housing',       type: 'expense' },
  { id: 3,  date: '2025-06-03', description: 'Freelance Project',   amount: 1200,  category: 'Freelance',     type: 'income'  },
  { id: 4,  date: '2025-06-04', description: 'Grocery Store',       amount: -780,  category: 'Food',          type: 'expense' },
  { id: 5,  date: '2025-06-05', description: 'Uber Ride',           amount: -240,  category: 'Transport',     type: 'expense' },
  { id: 6,  date: '2025-06-06', description: 'Netflix',             amount: -15,   category: 'Entertainment', type: 'expense' },
  { id: 7,  date: '2025-06-07', description: 'Pharmacy',            amount: -45,   category: 'Health',        type: 'expense' },
  { id: 8,  date: '2025-06-08', description: 'Online Shopping',     amount: -320,  category: 'Shopping',      type: 'expense' },
  { id: 9,  date: '2025-06-09', description: 'Electricity Bill',    amount: -95,   category: 'Utilities',     type: 'expense' },
  { id: 10, date: '2025-06-10', description: 'Stock Dividends',     amount: 340,   category: 'Investment',    type: 'income'  },
  { id: 11, date: '2025-06-11', description: 'Restaurant Dinner',   amount: -87,   category: 'Food',          type: 'expense' },
  { id: 12, date: '2025-06-12', description: 'Gym Membership',      amount: -50,   category: 'Health',        type: 'expense' },
  { id: 13, date: '2025-06-13', description: 'Freelance Design',    amount: 850,   category: 'Freelance',     type: 'income'  },
  { id: 14, date: '2025-06-14', description: 'Amazon Purchase',     amount: -1450, category: 'Shopping',      type: 'expense' },
  { id: 15, date: '2025-06-15', description: 'Coffee Shop',         amount: -532,  category: 'Food',          type: 'expense' },
  { id: 16, date: '2025-06-16', description: 'Internet Bill',       amount: -399,  category: 'Utilities',     type: 'expense' },
  { id: 17, date: '2025-06-17', description: 'Movie Tickets',       amount: -389,  category: 'Entertainment', type: 'expense' },
  { id: 18, date: '2025-06-18', description: 'Gas Station',         amount: -255,  category: 'Transport',     type: 'expense' },
  { id: 19, date: '2025-06-19', description: 'Doctor Visit',        amount: -720,  category: 'Health',        type: 'expense' },
  { id: 20, date: '2025-06-20', description: 'Consulting Fee',      amount: 2000,  category: 'Freelance',     type: 'income'  },
  { id: 21, date: '2025-05-01', description: 'Monthly Salary',      amount: 55000, category: 'Salary',        type: 'income'  },
  { id: 22, date: '2025-05-02', description: 'Rent Payment',        amount: -6200, category: 'Housing',       type: 'expense' },
  { id: 23, date: '2025-05-05', description: 'Grocery Store',       amount: -510,  category: 'Food',          type: 'expense' },
  { id: 24, date: '2025-05-10', description: 'Freelance Work',      amount: 900,   category: 'Freelance',     type: 'income'  },
  { id: 25, date: '2025-05-15', description: 'Online Shopping',     amount: -2800, category: 'Shopping',      type: 'expense' },
  { id: 26, date: '2025-05-20', description: 'Stock Dividends',     amount: 290,   category: 'Investment',    type: 'income'  },
  { id: 27, date: '2025-05-22', description: 'Electricity Bill',    amount: -970,  category: 'Utilities',     type: 'expense' },
  { id: 28, date: '2025-05-25', description: 'Dining Out',          amount: -650,  category: 'Food',          type: 'expense' },
  { id: 29, date: '2025-04-01', description: 'Monthly Salary',      amount: 55000, category: 'Salary',        type: 'income'  },
  { id: 30, date: '2025-04-02', description: 'Rent Payment',        amount: -6200, category: 'Housing',       type: 'expense' },
  { id: 31, date: '2025-04-08', description: 'Restaurant',          amount: -950,  category: 'Food',          type: 'expense' },
  { id: 32, date: '2025-04-15', description: 'Freelance',           amount: 1500,  category: 'Freelance',     type: 'income'  },
  { id: 33, date: '2025-04-18', description: 'Transport Pass',      amount: -400,  category: 'Transport',     type: 'expense' },
  { id: 34, date: '2025-04-22', description: 'Gym Membership',      amount: -390,  category: 'Health',        type: 'expense' },
  { id: 35, date: '2025-03-01', description: 'Monthly Salary',      amount: 55000, category: 'Salary',        type: 'income'  },
  { id: 36, date: '2025-03-03', description: 'Rent Payment',        amount: -6200, category: 'Housing',       type: 'expense' },
  { id: 37, date: '2025-03-10', description: 'Investment Returns',  amount: 420,   category: 'Investment',    type: 'income'  },
  { id: 38, date: '2025-03-14', description: 'Shopping Mall',       amount: -3100, category: 'Shopping',      type: 'expense' },
  { id: 39, date: '2025-03-20', description: 'Freelance',           amount: 780,   category: 'Freelance',     type: 'income'  },
  { id: 40, date: '2025-03-25', description: 'Grocery',             amount: -195,  category: 'Food',          type: 'expense' },
]

export const MONTHLY_DATA = [
  { month: "Jan '25", income: 55000, expense: 8400  },  // estimated
  { month: "Feb '25", income: 55200, expense: 9100  },  // estimated
  { month: "Mar '25", income: 56200, expense: 9495  },  // ✅ actual
  { month: "Apr '25", income: 56500, expense: 7940  },  // ✅ actual
  { month: "May '25", income: 56190, expense: 11130 },  // ✅ actual
  { month: "Jun '25", income: 59390, expense: 11577 },  // ✅ actual
  { month: "Jul '25", income: 56000, expense: 10200 },  // estimated
  { month: "Aug '25", income: 57500, expense: 11800 },  // estimated
  { month: "Sep '25", income: 56800, expense: 9600  },  // estimated
  { month: "Oct '25", income: 57200, expense: 10900 },  // estimated
  { month: "Nov '25", income: 58000, expense: 13500 },  // estimated
  { month: "Dec '25", income: 62000, expense: 15200 },  // estimated (holiday spending)
  { month: "Jan '26", income: 57500, expense: 9800  },  // estimated
  { month: "Feb '26", income: 58200, expense: 10400 },  // estimated
  { month: "Mar '26", income: 57800, expense: 9200  },  // estimated
]