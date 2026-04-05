import React, { useState, useMemo } from 'react'
import { CATEGORY_COLORS, CATEGORY_ICONS } from './data'

const pill = (color) => ({
  fontSize: 11, padding: '3px 9px', borderRadius: 6,
  background: `${color}18`, color, border: `1px solid ${color}28`,
  fontWeight: 600, whiteSpace: 'nowrap',
})

const GROUP_OPTIONS = ['none', 'category', 'month', 'type']

// ✅ FIX: parse date as local time (not UTC) to avoid timezone rollback
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDate()
  const month = d.toLocaleString('en-IN', { month: 'short' })
  const year = String(d.getFullYear()).slice(2)
  return `${day} ${month} '${year}`
}

export default function Transactions({ transactions, isAdmin, onEdit, onDelete, isDark, tk }) {
  const [search,      setSearch]      = useState('')
  const [typeF,       setTypeF]       = useState('all')
  const [catF,        setCatF]        = useState('all')
  const [sort,        setSort]        = useState({ key: 'date', dir: 'desc' })
  const [groupBy,     setGroupBy]     = useState('none')
  const [minAmt,      setMinAmt]      = useState('')
  const [maxAmt,      setMaxAmt]      = useState('')
  const [dateFrom,    setDateFrom]    = useState('')
  const [dateTo,      setDateTo]      = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const categories = [...new Set(transactions.map(t => t.category))].sort()
  const toggleSort = (key) => setSort(s => s.key === key ? { key, dir: s.dir === 'desc' ? 'asc' : 'desc' } : { key, dir: 'desc' })
  const sortIcon   = (key) => sort.key === key ? (sort.dir === 'desc' ? ' ↓' : ' ↑') : ' ↕'
  const activeFiltersCount = [typeF !== 'all', catF !== 'all', search, minAmt, maxAmt, dateFrom, dateTo].filter(Boolean).length
  const clearFilters = () => { setSearch(''); setTypeF('all'); setCatF('all'); setMinAmt(''); setMaxAmt(''); setDateFrom(''); setDateTo('') }

  const filtered = useMemo(() => {
    let r = [...transactions]
    if (typeF  !== 'all') r = r.filter(t => t.type === typeF)
    if (catF   !== 'all') r = r.filter(t => t.category === catF)
    if (search) r = r.filter(t => t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))
    if (minAmt) r = r.filter(t => Math.abs(t.amount) >= parseFloat(minAmt))
    if (maxAmt) r = r.filter(t => Math.abs(t.amount) <= parseFloat(maxAmt))
    if (dateFrom) r = r.filter(t => t.date >= dateFrom)
    if (dateTo)   r = r.filter(t => t.date <= dateTo)
    r.sort((a, b) => {
      const av = sort.key === 'date' ? new Date(a.date + 'T00:00:00') : a.amount
      const bv = sort.key === 'date' ? new Date(b.date + 'T00:00:00') : b.amount
      return sort.dir === 'asc' ? av - bv : bv - av
    })
    return r
  }, [transactions, search, typeF, catF, sort, minAmt, maxAmt, dateFrom, dateTo])

  const grouped = useMemo(() => {
    if (groupBy === 'none') return { '': filtered }
    const map = {}
    filtered.forEach(t => {
      let key
      if (groupBy === 'category') key = t.category
      else if (groupBy === 'type') key = t.type === 'income' ? '💰 Income' : '💸 Expense'
      else if (groupBy === 'month') {
        const d = new Date(t.date + 'T00:00:00')
        key = d.toLocaleString('en-IN', { month: 'long' }) + ' ' + d.getFullYear()
      }
      if (!map[key]) map[key] = []
      map[key].push(t)
    })
    return map
  }, [filtered, groupBy])

  const ctrl = {
    background: isDark ? '#1e2a40' : '#f1f5f9',
    border: `1px solid ${tk.border}`,
    borderRadius: 10, padding: '8px 11px',
    color: isDark ? '#ffffff' : '#0f172a',
    fontSize: 13, cursor: 'pointer', outline: 'none',
    transition: 'border-color 0.15s',
    colorScheme: isDark ? 'dark' : 'light',
  }

  const tableCard = {
    background: isDark
      ? 'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))'
      : 'linear-gradient(135deg,#ffffff,rgba(255,255,255,0.8))',
    border: `1px solid ${tk.border}`,
    borderRadius: 18, overflow: 'hidden',
    boxShadow: isDark
      ? '0 4px 24px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.04) inset'
      : '0 4px 18px rgba(0,0,0,0.07)',
  }

  return (
    <div>
      <style>{`
        .tx-filter-row { display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-bottom:10px; }
        .adv-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
        .tx-table-head { display:grid; padding:12px 20px; }
        .tx-table-row  { display:grid; padding:12px 20px; }
        .tx-cols-admin  { grid-template-columns:90px 1fr 120px 110px 90px; }
        .tx-cols-viewer { grid-template-columns:90px 1fr 120px 110px; }
        .tx-table-row:hover { background:${isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.02)'} !important; }
        @media (max-width:700px) {
          .adv-grid      { grid-template-columns:repeat(2,1fr); }
          .tx-table-head { display:none !important; }
          .tx-table-row  { grid-template-columns:1fr !important; padding:12px 16px; gap:8px; }
        }
        @media (max-width:420px) { .adv-grid { grid-template-columns:1fr; } }
      `}</style>

      {/* Filter bar */}
      <div className="tx-filter-row">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search transactions…" style={{ ...ctrl, flex: '1 1 160px', minWidth: 140 }} />
        <select value={typeF}  onChange={e => setTypeF(e.target.value)}  style={ctrl}>
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={catF}   onChange={e => setCatF(e.target.value)}   style={ctrl}>
          <option value="all">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={groupBy} onChange={e => setGroupBy(e.target.value)} style={{ ...ctrl, color: groupBy !== 'none' ? '#818cf8' : (isDark ? '#ffffff' : '#0f172a') }}>
          {GROUP_OPTIONS.map(g => <option key={g} value={g}>Group: {g === 'none' ? 'None' : g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
        </select>
        <button onClick={() => setShowFilters(f => !f)} style={{ ...ctrl, color: showFilters ? '#818cf8' : (isDark ? 'rgba(255,255,255,0.38)' : 'rgba(15,23,42,0.5)'), borderColor: showFilters ? 'rgba(99,102,241,0.4)' : tk.border, background: showFilters ? 'rgba(99,102,241,0.08)' : (isDark ? '#1e2a40' : '#f1f5f9'), fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
          ⚙ {activeFiltersCount > 0 && <span style={{ background: '#6366f1', color: '#fff', borderRadius: '50%', width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>{activeFiltersCount}</span>}
        </button>
        {activeFiltersCount > 0 && (
          <button onClick={clearFilters} style={{ ...ctrl, color: '#f43f5e', borderColor: 'rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.06)' }}>✕ Clear</button>
        )}
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#fff', border: `1px solid ${tk.border}`, borderRadius: 14, padding: '16px 18px', marginBottom: 12, boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 14px rgba(0,0,0,0.06)', animation: 'fadeUp 0.18s ease' }}>
          <div className="adv-grid">
            {[
              { label: 'MIN AMOUNT (₹)', key: 'minAmt', val: minAmt, set: setMinAmt, type: 'number', ph: '0' },
              { label: 'MAX AMOUNT (₹)', key: 'maxAmt', val: maxAmt, set: setMaxAmt, type: 'number', ph: '99999' },
              { label: 'FROM DATE',      key: 'from',   val: dateFrom, set: setDateFrom, type: 'date' },
              { label: 'TO DATE',        key: 'to',     val: dateTo,   set: setDateTo,   type: 'date' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 10, color: tk.textFaint, display: 'block', marginBottom: 5, fontWeight: 700, letterSpacing: '0.4px' }}>{f.label}</label>
                <input type={f.type} value={f.val} placeholder={f.ph} onChange={e => f.set(e.target.value)} style={{ ...ctrl, width: '100%', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Count + sort */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 12, color: tk.textFaint }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          {filtered.length !== transactions.length && ` of ${transactions.length}`}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {['date', 'amount'].map(key => (
            <button key={key} onClick={() => toggleSort(key)} style={{ ...ctrl, padding: '5px 10px', fontSize: 11, fontWeight: 600, textTransform: 'capitalize', color: sort.key === key ? '#818cf8' : (isDark ? 'rgba(255,255,255,0.38)' : 'rgba(15,23,42,0.5)'), borderColor: sort.key === key ? 'rgba(99,102,241,0.3)' : tk.border, background: sort.key === key ? 'rgba(99,102,241,0.07)' : (isDark ? '#1e2a40' : '#f1f5f9') }}>
              {key}{sortIcon(key)}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ ...tableCard, textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: tk.textMuted, marginBottom: 6 }}>
            {transactions.length === 0 ? 'No transactions yet' : 'No results found'}
          </div>
          <div style={{ fontSize: 13, color: tk.textFaint, marginBottom: activeFiltersCount > 0 ? 16 : 0 }}>
            {transactions.length === 0
              ? isAdmin ? 'Click the + button in the header to add your first transaction.' : 'No transactions have been added yet.'
              : 'Try adjusting your search or clearing the active filters.'}
          </div>
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 9, padding: '7px 16px', color: '#818cf8', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Grouped tables */}
      {Object.entries(grouped).map(([groupLabel, rows]) => (
        <div key={groupLabel} style={{ marginBottom: groupBy !== 'none' ? 20 : 0 }}>
          {groupBy !== 'none' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#818cf8' }}>{groupLabel}</div>
              <div style={{ flex: 1, height: 1, background: tk.border }} />
              <div style={{ fontSize: 11, color: tk.textFaint }}>{rows.length} items</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: rows.reduce((s, t) => s + t.amount, 0) >= 0 ? '#10b981' : '#f43f5e' }}>
                ₹{Math.abs(rows.reduce((s, t) => s + t.amount, 0)).toLocaleString('en-IN')}
              </div>
            </div>
          )}

          <div style={tableCard}>
            {/* Desktop header */}
            <div className={`tx-table-head ${isAdmin ? 'tx-cols-admin' : 'tx-cols-viewer'}`} style={{ borderBottom: `1px solid ${tk.border}`, fontSize: 11, color: tk.textFaint, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
              <span>Date</span><span>Description</span><span>Category</span>
              <span style={{ textAlign: 'right' }}>Amount</span>
              {isAdmin && <span style={{ textAlign: 'center' }}>Actions</span>}
            </div>

            {rows.map((t, i) => {
              const color = CATEGORY_COLORS[t.category] || '#64748b'
              return (
                <div key={t.id}
                  className={`tx-table-row ${isAdmin ? 'tx-cols-admin' : 'tx-cols-viewer'}`}
                  style={{ borderBottom: i < rows.length - 1 ? `1px solid ${tk.border}` : 'none', alignItems: 'center', transition: 'background 0.12s', cursor: 'default' }}
                >
                  <div style={{ display: 'contents' }}>
                    {/* ✅ FIXED: uses formatDate() — no UTC timezone shift, correct year */}
                    <span style={{ fontSize: 12, color: tk.textMuted }}>
                      {formatDate(t.date)}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: `${color}18`, border: `1px solid ${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                        {CATEGORY_ICONS[t.category] || '💳'}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: tk.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</span>
                    </div>
                    <div><span style={pill(color)}>{t.category}</span></div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: t.amount > 0 ? '#10b981' : '#f43f5e' }}>
                        {t.amount > 0 ? '+' : ''}₹{Math.abs(t.amount).toLocaleString('en-IN')}
                      </span>
                    </div>
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button onClick={() => onEdit(t)} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 7, padding: '4px 10px', color: '#818cf8', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                        >Edit</button>
                        <button onClick={() => onDelete(t.id)} style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.22)', borderRadius: 7, padding: '4px 10px', color: '#f43f5e', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.18)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,63,94,0.08)'}
                        >Del</button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
