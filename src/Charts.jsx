import React from 'react'
import { MONTHLY_DATA } from './data'

/* ── Sparkline ── */
export function Sparkline({ values, color }) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const w = 80, h = 30
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / (max - min + 1)) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} style={{ overflow: 'visible', flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

/* ── Donut Chart — now theme-aware ── */
export function DonutChart({ data, size = 150, isDark = true }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  let cumulative = 0
  const cx = size / 2, cy = size / 2
  const r = size * 0.37, inner = size * 0.23

  const slices = data.map(d => {
    const pct = d.value / total
    const start = cumulative * 2 * Math.PI - Math.PI / 2
    cumulative += pct
    const end = cumulative * 2 * Math.PI - Math.PI / 2
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end)
    const ix1 = cx + inner * Math.cos(start), iy1 = cy + inner * Math.sin(start)
    const ix2 = cx + inner * Math.cos(end),   iy2 = cy + inner * Math.sin(end)
    const large = pct > 0.5 ? 1 : 0
    return {
      ...d, pct,
      path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${inner} ${inner} 0 ${large} 0 ${ix1} ${iy1} Z`
    }
  })

  // Theme-aware center text colors
  const centerBg   = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
  const textMain   = isDark ? '#ffffff' : '#0f172a'
  const textMuted  = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.5)'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      {/* Center circle background */}
      <circle cx={cx} cy={cy} r={inner - 2} fill={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} />
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} opacity={0.9}>
          <title>{s.label}: {(s.pct * 100).toFixed(1)}%</title>
        </path>
      ))}
      {/* Theme-aware text */}
      <text x={cx} y={cy - 5} textAnchor="middle" fill={textMain} fontSize={15} fontWeight="700">
        {data.length}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill={textMuted} fontSize={9} letterSpacing="0.3">
        categories
      </text>
    </svg>
  )
}

/* ── Monthly Bar Chart — theme-aware ── */
export function BarChart({ isDark, tk }) {
  const maxV = Math.max(...MONTHLY_DATA.flatMap(d => [d.income, d.expense]))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 110, paddingBottom: 0 }}>
      {MONTHLY_DATA.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 0 }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', gap: 2, height: 90 }}>
            <div
              title={`Income: ₹${d.income.toLocaleString()}`}
              style={{
                flex: 1, background: 'linear-gradient(180deg,#10b981,rgba(16,185,129,0.45))',
                borderRadius: '4px 4px 0 0', height: `${(d.income / maxV) * 100}%`,
                minHeight: 4, cursor: 'pointer', transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.65'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            />
            <div
              title={`Expense: ₹${d.expense.toLocaleString()}`}
              style={{
                flex: 1, background: 'linear-gradient(180deg,#f43f5e,rgba(244,63,94,0.45))',
                borderRadius: '4px 4px 0 0', height: `${(d.expense / maxV) * 100}%`,
                minHeight: 4, cursor: 'pointer', transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.65'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            />
          </div>
          <span style={{ fontSize: 10, color: tk ? tk.textFaint : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '100%', textOverflow: 'ellipsis' }}>{d.month}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Trend Line Chart ── */
export function TrendChart({ data, color = '#6366f1', isDark, tk }) {
  const w = 500, h = 80
  const vals = data.map(d => d.income - d.expense)
  const min = Math.min(...vals), max = Math.max(...vals)
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w
    const y = h - ((v - min) / (max - min + 1)) * (h - 10) - 5
    return [x, y]
  })
  const polyPoints = pts.map(p => p.join(',')).join(' ')
  const areaPath = `M ${pts[0][0]} ${h} ` + pts.map(p => `L ${p[0]} ${p[1]}`).join(' ') + ` L ${pts[pts.length - 1][0]} ${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 80 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#trendGrad)" />
      <polyline points={polyPoints} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={3.5} fill={color} opacity={0.9}>
          <title>{data[i].month}: ₹{vals[i].toLocaleString()}</title>
        </circle>
      ))}
    </svg>
  )
}
