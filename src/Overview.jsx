import React from 'react'
import { CATEGORY_COLORS, CATEGORY_ICONS, MONTHLY_DATA } from './data'
import { Sparkline, DonutChart, BarChart } from './Charts'

function StatCard({ label, value, prefix = '', suffix = '', color, sparkValues, sub, gradient, tk, isDark }) {
  return (
    <div
      className="card-hover"
      style={{
        background: isDark
          ? `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)`
          : `linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)`,
        border: `1px solid ${tk.border}`,
        borderRadius: 20, padding: '22px 24px',
        position: 'relative', overflow: 'hidden',
        boxShadow: isDark
          ? '0 4px 24px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.05) inset'
          : '0 4px 20px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.9) inset',
      }}
    >
      {/* Top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: gradient || `linear-gradient(90deg,${color},${color}66)`, borderRadius: '20px 20px 0 0' }} />
      {/* Subtle glow circle */}
      <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: `${color}12`, pointerEvents: 'none' }} />

      <div style={{ fontSize: 11, color: tk.textMuted, marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.8px', color: tk.text, marginBottom: 8 }}>
        {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : value}{suffix}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: tk.textFaint }}>{sub}</span>
        {sparkValues && <Sparkline values={sparkValues} color={color} />}
      </div>
    </div>
  )
}

export default function Overview({ transactions, onViewAll, isDark, tk }) {
  const income  = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
  const balance = income - expense
  const savings = income > 0 ? ((income - expense) / income * 100).toFixed(1) : '0.0'

  const categoryMap = {}
  transactions.filter(t => t.amount < 0).forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + Math.abs(t.amount)
  })
  const categoryData = Object.entries(categoryMap)
    .map(([label, value]) => ({ label, value, color: CATEGORY_COLORS[label] || '#64748b' }))
    .sort((a, b) => b.value - a.value)

  const sparkValues = MONTHLY_DATA.map(m => m.income - m.expense)

  const card = {
    background: isDark
      ? 'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))'
      : 'linear-gradient(135deg,#ffffff,rgba(255,255,255,0.8))',
    border: `1px solid ${tk.border}`,
    borderRadius: 20, padding: '22px 24px',
    boxShadow: isDark
      ? '0 4px 24px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.05) inset'
      : '0 4px 20px rgba(0,0,0,0.07)',
  }

  return (
    <div>
      <style>{`
        .stat-grid   { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px; }
        .charts-row  { display:grid; grid-template-columns:1fr 310px; gap:16px; margin-bottom:16px; }
        .donut-inner { display:flex; align-items:center; gap:16px; }
        .card-hover  { transition:transform 0.18s ease,box-shadow 0.18s ease !important; }
        .card-hover:hover { transform:translateY(-3px) !important;
          box-shadow:0 12px 40px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.07) inset !important; }

        @media (max-width:900px) {
          .stat-grid  { grid-template-columns:repeat(2,1fr); }
          .charts-row { grid-template-columns:1fr; }
        }
        @media (max-width:520px) {
          .stat-grid   { grid-template-columns:repeat(2,1fr); gap:10px; }
          .donut-inner { flex-direction:column; align-items:flex-start; }
        }
      `}</style>

      <div className="stat-grid">
        <StatCard label="Total Balance"  value={balance}             prefix="₹" color="#6366f1" gradient="linear-gradient(90deg,#6366f1,#8b5cf6)" sparkValues={sparkValues} sub="Net all time" tk={tk} isDark={isDark} />
        <StatCard label="Total Income"   value={income}              prefix="₹" color="#10b981" gradient="linear-gradient(90deg,#10b981,#34d399)" sub="All time earned" tk={tk} isDark={isDark} />
        <StatCard label="Total Expenses" value={expense}             prefix="₹" color="#f43f5e" gradient="linear-gradient(90deg,#f43f5e,#fb7185)" sub="All time spent"  tk={tk} isDark={isDark} />
        <StatCard label="Savings Rate"   value={parseFloat(savings)} suffix="%" color="#f59e0b" gradient="linear-gradient(90deg,#f59e0b,#fbbf24)" sub="of income saved" tk={tk} isDark={isDark} />
      </div>

      <div className="charts-row">
        <div className="card-hover" style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: tk.text }}>Monthly Overview</div>
              <div style={{ fontSize: 12, color: tk.textMuted, marginTop: 2 }}>Income vs Expenses · 2025–26</div>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              {[{ l: 'Income', c: '#10b981' }, { l: 'Expense', c: '#f43f5e' }].map(x => (
                <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: x.c }} />
                  <span style={{ fontSize: 11, color: tk.textMuted }}>{x.l}</span>
                </div>
              ))}
            </div>
          </div>
          <BarChart isDark={isDark} tk={tk} />
        </div>

        <div className="card-hover" style={card}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2, color: tk.text }}>Spending Breakdown</div>
          <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 16 }}>By category</div>
          {categoryData.length === 0 ? (
            <div style={{ textAlign: 'center', color: tk.textFaint, fontSize: 13, padding: '30px 0' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🥧</div>
              No expense data yet
            </div>
          ) : (
            <div className="donut-inner">
              <DonutChart data={categoryData.slice(0, 6)} size={130} isDark={isDark} />
              <div style={{ flex: 1, minWidth: 0 }}>
                {categoryData.slice(0, 5).map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: tk.textMuted, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: tk.text, flexShrink: 0 }}>
                      ₹{c.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card-hover" style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: tk.text }}>Recent Transactions</div>
            <div style={{ fontSize: 12, color: tk.textMuted, marginTop: 2 }}>Latest 6 entries</div>
          </div>
          <button onClick={onViewAll} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 9, padding: '6px 14px', color: '#818cf8', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.18)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.transform = 'none' }}
          >View all →</button>
        </div>

        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', color: tk.textFaint, padding: '40px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>💳</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: tk.textMuted, marginBottom: 6 }}>No transactions yet</div>
            <div style={{ fontSize: 12 }}>Your recent activity will appear here.</div>
          </div>
        ) : transactions.slice(0, 6).map((t, i) => {
          const color = CATEGORY_COLORS[t.category] || '#64748b'
          return (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '11px 0', borderBottom: i < Math.min(transactions.length, 6) - 1 ? `1px solid ${tk.border}` : 'none',
              gap: 8, transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: `${color}18`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {CATEGORY_ICONS[t.category] || '💳'}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: tk.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</div>
                  <div style={{ fontSize: 11, color: tk.textFaint, marginTop: 2 }}>
                    {t.category} · {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.amount > 0 ? '#10b981' : '#f43f5e', flexShrink: 0 }}>
                {t.amount > 0 ? '+' : ''}₹{Math.abs(t.amount).toLocaleString('en-IN')}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
