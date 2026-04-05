import React from 'react'
import { CATEGORY_COLORS, MONTHLY_DATA } from './data'
import { TrendChart } from './Charts'

function buildInsights(transactions, categoryData, expense, savings, MONTHLY_DATA) {
  const insights = []

  // ── Find the 2 most recent months that actually have transactions ──
  const monthsWithData = [...new Set(
    transactions.filter(t => t.amount < 0).map(t => t.date.slice(0, 7))
  )].sort().reverse()

  const currentMonth = monthsWithData[0] || ''
  const prevMonth    = monthsWithData[1] || ''

  // Build per-month, per-category totals
  const catByMonth = {}
  transactions.filter(t => t.amount < 0).forEach(t => {
    const mo = t.date.slice(0, 7)
    if (!catByMonth[mo]) catByMonth[mo] = {}
    catByMonth[mo][t.category] = (catByMonth[mo][t.category] || 0) + Math.abs(t.amount)
  })

  const curCats  = catByMonth[currentMonth] || {}
  const prevCats = catByMonth[prevMonth]    || {}

  // ── Insight 1: Biggest single expense transaction ──
  const allExpenses = transactions.filter(t => t.amount < 0).sort((a, b) => a.amount - b.amount)
  if (allExpenses.length > 0) {
    const biggest = allExpenses[0]
    insights.push({
      icon: '🔴',
      text: `Biggest single expense: ${biggest.description} — ₹${Math.abs(biggest.amount).toLocaleString('en-IN')}`,
      color: '#f43f5e',
      bg: 'rgba(244,63,94,0.08)',
      border: 'rgba(244,63,94,0.2)',
    })
  }

  // ── Insight 2: Top spending category in CURRENT month vs PREVIOUS month ──
  if (currentMonth && prevMonth && categoryData.length > 0) {
    // Find the top category specifically in current month
    const curMonthCats = Object.entries(curCats).sort((a, b) => b[1] - a[1])
    if (curMonthCats.length > 0) {
      const [topLabel, topVal] = curMonthCats[0]
      const prevVal = prevCats[topLabel] || 0

      if (prevVal > 0) {
        const pct = ((topVal - prevVal) / prevVal * 100)
        const absPct = Math.abs(pct).toFixed(0)
        const dir = pct >= 0 ? 'more' : 'less'
        const curMonthTotal = Object.values(curCats).reduce((a, b) => a + b, 0)
        const shareOfMonth  = curMonthTotal > 0 ? ((topVal / curMonthTotal) * 100).toFixed(0) : 0

        if (Math.abs(pct) < 5) {
          // ~0% change — it's a fixed recurring cost like rent, show that as an observation
          insights.push({
            icon: '🔁',
            text: `${topLabel} is a fixed recurring cost — ₹${topVal.toLocaleString('en-IN')} every month, making up ${shareOfMonth}% of your monthly expenses.`,
            color: '#6366f1',
            bg: 'rgba(99,102,241,0.08)',
            border: 'rgba(99,102,241,0.2)',
          })
        } else if (Math.abs(pct) <= 200) {
          // Meaningful, believable change
          insights.push({
            icon: pct >= 0 ? '⚠️' : '✅',
            text: `You spent ${absPct}% ${dir} on ${topLabel} this month vs last (₹${topVal.toLocaleString('en-IN')} vs ₹${prevVal.toLocaleString('en-IN')})`,
            color: pct >= 0 ? '#f59e0b' : '#10b981',
            bg: pct >= 0 ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)',
            border: pct >= 0 ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)',
          })
        } else {
          // Unrealistically large spike — show flat observation
          insights.push({
            icon: '📊',
            text: `Top spend this month: ${topLabel} at ₹${topVal.toLocaleString('en-IN')} — ${shareOfMonth}% of this month's total expenses.`,
            color: CATEGORY_COLORS[topLabel] || '#6366f1',
            bg: 'rgba(99,102,241,0.08)',
            border: 'rgba(99,102,241,0.2)',
          })
        }
      } else {
        // No previous month data for this category
        insights.push({
          icon: '📊',
          text: `Top spending category this month: ${topLabel} at ₹${topVal.toLocaleString('en-IN')}`,
          color: CATEGORY_COLORS[topLabel] || '#6366f1',
          bg: 'rgba(99,102,241,0.08)',
          border: 'rgba(99,102,241,0.2)',
        })
      }
    }
  }

  // ── Insight 3: Savings rate ──
  if (savings >= 30) {
    insights.push({
      icon: '🏆',
      text: `Excellent! ${savings.toFixed(1)}% savings rate — well above the recommended 20% threshold.`,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.07)',
      border: 'rgba(16,185,129,0.18)',
    })
  } else if (savings >= 20) {
    insights.push({
      icon: '✅',
      text: `Good savings rate of ${savings.toFixed(1)}% — you're meeting the recommended 20% target.`,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.07)',
      border: 'rgba(16,185,129,0.18)',
    })
  } else if (savings >= 10) {
    insights.push({
      icon: '⚠️',
      text: `Your savings rate is ${savings.toFixed(1)}%. Try to push above 20% for stronger financial health.`,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.07)',
      border: 'rgba(245,158,11,0.18)',
    })
  } else {
    insights.push({
      icon: '🚨',
      text: `Savings rate is only ${savings.toFixed(1)}%. Aim for at least 20% to build financial resilience.`,
      color: '#f43f5e',
      bg: 'rgba(244,63,94,0.07)',
      border: 'rgba(244,63,94,0.18)',
    })
  }

  return insights
}

export default function Insights({ transactions, isDark, tk }) {
  const income  = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
  const savings = income > 0 ? ((income - expense) / income * 100) : 0

  const categoryMap = {}
  transactions.filter(t => t.amount < 0).forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + Math.abs(t.amount)
  })
  const categoryData = Object.entries(categoryMap)
    .map(([label, value]) => ({ label, value, color: CATEGORY_COLORS[label] || '#64748b' }))
    .sort((a, b) => b.value - a.value)

  const topCat  = categoryData[0]
  const lastTwo = MONTHLY_DATA.slice(-2)
  const thisNet = lastTwo[1].income - lastTwo[1].expense
  const prevNet = lastTwo[0].income - lastTwo[0].expense
  const changeP = prevNet ? (((thisNet - prevNet) / prevNet) * 100) : 0
  const isUp    = changeP >= 0

  const savingsColor = savings >= 20 ? '#10b981' : savings >= 10 ? '#f59e0b' : '#f43f5e'
  const savingsLabel = savings >= 30 ? 'Excellent 🎯' : savings >= 20 ? 'Good 👍' : savings >= 10 ? 'Fair ⚠️' : 'Needs work 🔴'

  const smartInsights = buildInsights(transactions, categoryData, expense, savings, MONTHLY_DATA)

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
  const sectionLabel = {
    fontSize: 11, color: tk.textFaint, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14,
  }

  if (transactions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: tk.textFaint }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>💡</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: tk.textMuted, marginBottom: 8 }}>No data yet</div>
        <div style={{ fontSize: 13 }}>Add some transactions to see your spending insights.</div>
      </div>
    )
  }

  return (
    <div>
      <style>{`
        .ins-top-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:16px; }
        .card-hover   { transition:transform 0.18s ease,box-shadow 0.18s ease !important; }
        .card-hover:hover { transform:translateY(-3px) !important;
          box-shadow:0 12px 40px rgba(0,0,0,0.22) !important; }
        @media (max-width:800px) { .ins-top-grid { grid-template-columns:1fr; } }
      `}</style>

      {/* Smart Insights Banner */}
      {smartInsights.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: tk.textFaint, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
            Smart Insights
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {smartInsights.map((ins, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '12px 16px', borderRadius: 14,
                background: ins.bg, border: `1px solid ${ins.border}`,
                animation: `fadeUp 0.2s ease ${i * 0.06}s both`,
              }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{ins.icon}</span>
                <span style={{ fontSize: 13, color: tk.text, lineHeight: 1.6 }}>{ins.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="ins-top-grid">
        {/* Top Category */}
        <div className="card-hover" style={card}>
          <div style={sectionLabel}>Highest Spending</div>
          {topCat ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: `${topCat.color}18`, border: `1px solid ${topCat.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 5, background: topCat.color }} />
                </div>
                <div>
                  <div style={{ fontSize: 19, fontWeight: 800, color: tk.text }}>{topCat.label}</div>
                  <div style={{ fontSize: 12, color: tk.textMuted, marginTop: 2 }}>
                    {expense > 0 ? ((topCat.value / expense) * 100).toFixed(1) : 0}% of total expenses
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: topCat.color, letterSpacing: '-1px' }}>
                ₹{topCat.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
            </>
          ) : (
            <div style={{ color: tk.textFaint, fontSize: 13 }}>No expense data yet</div>
          )}
        </div>

        {/* MoM */}
        <div className="card-hover" style={card}>
          <div style={sectionLabel}>Month-over-Month</div>
          {lastTwo.map((m, i) => {
            const net = m.income - m.expense
            return (
              <div key={m.month} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i === 0 ? `1px solid ${tk.border}` : 'none' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: tk.text }}>{m.month}</div>
                  <div style={{ fontSize: 11, color: tk.textFaint, marginTop: 2 }}>
                    +₹{m.income.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / -₹{m.expense.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: tk.text }}>₹{net.toLocaleString('en-IN')}</div>
                  {i === 1 && (
                    <div style={{ fontSize: 12, fontWeight: 600, color: isUp ? '#10b981' : '#f43f5e', marginTop: 2, background: isUp ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)', padding: '2px 7px', borderRadius: 6, display: 'inline-block' }}>
                      {isUp ? '↑' : '↓'} {Math.abs(changeP).toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Savings Health */}
        <div className="card-hover" style={card}>
          <div style={sectionLabel}>Savings Health</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: savingsColor, letterSpacing: '-1.5px' }}>{savings.toFixed(1)}%</div>
            <div style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 8, background: `${savingsColor}18`, color: savingsColor, border: `1px solid ${savingsColor}30` }}>{savingsLabel}</div>
          </div>
          <div style={{ height: 7, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ height: '100%', width: `${Math.min(savings, 100)}%`, background: `linear-gradient(90deg,${savingsColor},${savingsColor}bb)`, borderRadius: 4, transition: 'width 0.9s ease' }} />
          </div>
          <div style={{ fontSize: 12, color: tk.textMuted, lineHeight: 1.7 }}>
            {savings >= 20 ? 'Above the 20% recommended threshold. Keep it up!' : 'Try to save at least 20% of your income each month.'}
          </div>
        </div>
      </div>

      {/* Trend */}
      <div className="card-hover" style={{ ...card, marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2, color: tk.text }}>Net Savings Trend</div>
        <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 20 }}>Monthly net (income − expenses) · 2025–26</div>
        <TrendChart data={MONTHLY_DATA} color="#6366f1" isDark={isDark} tk={tk} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          {MONTHLY_DATA.map(m => <span key={m.month} style={{ fontSize: 10, color: tk.textFaint }}>{m.month}</span>)}
        </div>
      </div>

      {/* Full breakdown */}
      <div className="card-hover" style={card}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2, color: tk.text }}>Full Spending Breakdown</div>
        <div style={{ fontSize: 12, color: tk.textMuted, marginBottom: 22 }}>All categories ranked by spend</div>
        {categoryData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: tk.textFaint, fontSize: 13 }}>No expense data to show</div>
        ) : categoryData.map((c, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <div style={{ width: 9, height: 9, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: tk.text, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.label}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: tk.textFaint }}>{expense > 0 ? ((c.value / expense) * 100).toFixed(1) : 0}%</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: tk.text }}>₹{c.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
            <div style={{ height: 5, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.07)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(c.value / categoryData[0].value) * 100}%`, background: `linear-gradient(90deg,${c.color},${c.color}99)`, borderRadius: 3, transition: 'width 0.8s ease' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
