// ── Mock API + localStorage persistence ──────────────────────────────────────
// Simulates real API calls with network delay. Data persists in localStorage.

import { INITIAL_TRANSACTIONS } from './data'

const STORAGE_KEY = 'fintrek_transactions'
const THEME_KEY   = 'fintrek_theme'
const DELAY       = 400 // ms — simulates network latency

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

// ── Seed localStorage on first load ──
function getStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function persist(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

// ── Public API ────────────────────────────────────────────────────────────────

export const api = {
  /** GET /transactions */
  async fetchTransactions() {
    await sleep(DELAY)
    const stored = getStored()
    if (stored) return stored
    // First visit — seed with mock data
    persist(INITIAL_TRANSACTIONS)
    return INITIAL_TRANSACTIONS
  },

  /** POST /transactions */
  async createTransaction(tx) {
    await sleep(DELAY)
    const all = getStored() || []
    const next = [tx, ...all]
    persist(next)
    return tx
  },

  /** PUT /transactions/:id */
  async updateTransaction(tx) {
    await sleep(DELAY)
    const all = getStored() || []
    const next = all.map(t => t.id === tx.id ? tx : t)
    persist(next)
    return tx
  },

  /** DELETE /transactions/:id */
  async deleteTransaction(id) {
    await sleep(DELAY)
    const all = getStored() || []
    const next = all.filter(t => t.id !== id)
    persist(next)
    return id
  },

  /** Reset to factory data */
  async resetData() {
    await sleep(DELAY)
    persist(INITIAL_TRANSACTIONS)
    return INITIAL_TRANSACTIONS
  },
}

// ── Theme persistence ─────────────────────────────────────────────────────────
export function getStoredTheme() {
  try { return localStorage.getItem(THEME_KEY) || 'dark' } catch { return 'dark' }
}
export function saveTheme(theme) {
  try { localStorage.setItem(THEME_KEY, theme) } catch {}
}
