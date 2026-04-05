import React, { useState, useCallback, useEffect, useRef } from 'react'
import { ThemeProvider, useTheme, tokens } from './theme'
import { exportCSV, exportJSON } from './exportUtils'
import { useTransactions } from './useTransactions'
import Overview     from './Overview'
import Transactions from './Transactions'
import Insights     from './Insights'
import Modal        from './Modal'

const TABS = ['overview', 'transactions', 'insights']
const TAB_ICONS = { overview: '📊', transactions: '💳', insights: '💡' }

function Toast({ message, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t) }, [])
  const colors = { success: '#10b981', error: '#f43f5e', info: '#6366f1' }
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 999,
      background: '#1a1f2e', border: `1px solid ${colors[type]}40`,
      borderLeft: `3px solid ${colors[type]}`,
      borderRadius: 14, padding: '13px 18px',
      color: '#fff', fontSize: 13, fontWeight: 500,
      boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
      animation: 'slideIn 0.25s ease',
      display: 'flex', alignItems: 'center', gap: 10,
      maxWidth: 'calc(100vw - 48px)',
    }}>
      <span>{type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
      {message}
    </div>
  )
}

function Loader({ tk }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: 16 }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid #6366f1', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ fontSize: 13, color: tk.textFaint }}>Loading your data…</div>
    </div>
  )
}

function Inner() {
  const { isDark, toggle } = useTheme()
  const tk = tokens(isDark)

  const [role,       setRole]       = useState('admin')
  const [activeTab,  setActiveTab]  = useState('overview')
  const [showModal,  setShowModal]  = useState(false)
  const [editTx,     setEditTx]     = useState(null)
  const [toast,      setToast]      = useState(null)
  const [exportOpen, setExportOpen] = useState(false)
  const exportRef = useRef()

  const isAdmin = role === 'admin'
  const notify  = useCallback((message, type = 'success') => setToast({ message, type }), [])

  const { transactions, loading, apiLoading, handleSave, handleDelete, handleReset } = useTransactions(notify)

  useEffect(() => {
    const handler = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) setExportOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const openAdd    = ()    => { setEditTx(null); setShowModal(true) }
  const openEdit   = (tx)  => { setEditTx(tx);   setShowModal(true) }
  const closeModal = ()    => { setShowModal(false); setEditTx(null) }

  const onSave = useCallback(async (tx) => {
    await handleSave(tx, editTx)
    closeModal()
  }, [editTx, handleSave])

  const onReset = async () => { await handleReset(); setExportOpen(false) }

  const handleExport = (format) => {
    if (format === 'csv')  exportCSV(transactions)
    if (format === 'json') exportJSON(transactions)
    setExportOpen(false)
    notify(`Exported as ${format.toUpperCase()}`)
  }

  const dropdownBg = isDark ? '#1a2035' : '#ffffff'

  const btnBase = {
    height: 36, borderRadius: 10, border: `1px solid ${tk.border}`,
    background: isDark ? '#1e2a40' : '#f1f5f9',
    cursor: 'pointer', fontSize: 12, fontWeight: 600,
    color: isDark ? 'rgba(255,255,255,0.38)' : 'rgba(15,23,42,0.5)',
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '0 12px', transition: 'all 0.2s',
    colorScheme: isDark ? 'dark' : 'light',
  }

  return (
    <div style={{ minHeight: '100vh', background: tk.bg, transition: 'background 0.3s', color: tk.text }}>
      <style>{`
        @keyframes spin    { to { transform:rotate(360deg) } }
        @keyframes slideIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .tab-content { animation:fadeUp 0.22s ease }
        .api-bar { position:fixed;top:0;left:0;right:0;height:2px;z-index:9999;
          background:linear-gradient(90deg,#6366f1,#8b5cf6,#10b981,#6366f1);
          background-size:200%;animation:shimmer 1.4s linear infinite; }
        .desk-tabs  { display:flex; }
        .bottom-nav { display:none; }
        .card-hover { transition:transform 0.18s ease,box-shadow 0.18s ease !important; cursor:default; }
        .card-hover:hover { transform:translateY(-3px) !important; }
        @media (max-width:700px) {
          .desk-tabs        { display:none !important; }
          .bottom-nav       { display:flex !important; }
          .export-btn-label { display:none; }
          .add-btn-label    { display:none; }
        }
        @media (max-width:420px) {
          .header-pad { padding:0 14px !important; }
          .main-pad   { padding:16px 12px 80px !important; }
        }
      `}</style>

      {apiLoading && <div className="api-bar" />}

      <header className="header-pad" style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: tk.header, backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${tk.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 62, transition: 'all 0.3s', gap: 10,
        boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, boxShadow: '0 4px 16px rgba(99,102,241,0.5)', flexShrink: 0 }}>₹</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.4px', lineHeight: 1, color: tk.text }}>Fintrek</div>
            <div style={{ fontSize: 9, color: tk.textFaint, letterSpacing: '0.6px', marginTop: 1 }}>FINANCE DASHBOARD</div>
          </div>
        </div>

        <nav className="desk-tabs" style={{ gap: 2, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderRadius: 12, padding: 4 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: '7px 18px', borderRadius: 9, border: 'none', cursor: 'pointer',
              background: activeTab === t ? (isDark ? 'rgba(99,102,241,0.22)' : 'rgba(99,102,241,0.14)') : 'transparent',
              color: activeTab === t ? '#818cf8' : tk.textMuted,
              fontSize: 13, fontWeight: activeTab === t ? 700 : 500,
              textTransform: 'capitalize', transition: 'all 0.15s',
              boxShadow: activeTab === t ? '0 2px 8px rgba(99,102,241,0.2)' : 'none',
            }}>{t}</button>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button onClick={toggle} title="Toggle theme" style={{ ...btnBase, width: 36, padding: 0, justifyContent: 'center', fontSize: 16 }}>
            {isDark ? '☀️' : '🌙'}
          </button>

          <div ref={exportRef} style={{ position: 'relative' }}>
            <button onClick={() => setExportOpen(o => !o)} style={btnBase}>
              <span>⬇</span><span className="export-btn-label">Export</span>
            </button>
            {exportOpen && (
              <div style={{ position: 'absolute', top: 46, right: 0, zIndex: 200, background: dropdownBg, border: `1px solid ${tk.border}`, borderRadius: 14, padding: 6, minWidth: 175, boxShadow: '0 16px 48px rgba(0,0,0,0.3)', animation: 'fadeUp 0.15s ease' }}>
                {[{ fmt: 'csv', icon: '📄', label: 'Export CSV' }, { fmt: 'json', icon: '📦', label: 'Export JSON' }].map(x => (
                  <button key={x.fmt} onClick={() => handleExport(x.fmt)} style={{ width: '100%', padding: '9px 12px', border: 'none', background: 'transparent', color: tk.text, fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'left', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 8 }}
                    onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  ><span>{x.icon}</span>{x.label}</button>
                ))}
                <div style={{ height: 1, background: tk.border, margin: '4px 0' }} />
                <button onClick={onReset} style={{ width: '100%', padding: '9px 12px', border: 'none', background: 'transparent', color: '#f43f5e', fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'left', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 8 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                ><span>🔄</span>Reset data</button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: isAdmin ? '#818cf8' : '#f59e0b', boxShadow: `0 0 8px ${isAdmin ? '#6366f1' : '#f59e0b'}` }} />
            {/* Role select — solid background + colorScheme fix */}
            <select value={role} onChange={e => setRole(e.target.value)} style={{
              background: isDark ? '#1e2a40' : '#f1f5f9',
              border: `1px solid ${tk.border}`,
              borderRadius: 9, padding: '5px 9px',
              color: isAdmin ? '#818cf8' : '#fbbf24',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              colorScheme: isDark ? 'dark' : 'light',
            }}>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          {isAdmin && (
            <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 10, padding: '7px 16px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.45)', transition: 'transform 0.15s,box-shadow 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.55)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.45)' }}
            >
              <span style={{ fontSize: 16 }}>+</span>
              <span className="add-btn-label">Add</span>
            </button>
          )}
        </div>
      </header>

      {!isAdmin && (
        <div style={{ background: 'rgba(251,191,36,0.08)', borderBottom: '1px solid rgba(251,191,36,0.15)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#fbbf24', fontWeight: 500, flexWrap: 'wrap' }}>
          <span>👁</span> Viewer mode — read only.
          <button onClick={() => setRole('admin')} style={{ marginLeft: 'auto', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 7, padding: '4px 12px', color: '#fbbf24', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Switch to Admin</button>
        </div>
      )}

      <main className="main-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px 100px' }}>
        {loading ? <Loader tk={tk} /> : (
          <div className="tab-content" key={activeTab}>
            {activeTab === 'overview'     && <Overview     transactions={transactions} onViewAll={() => setActiveTab('transactions')} isDark={isDark} tk={tk} />}
            {activeTab === 'transactions' && <Transactions transactions={transactions} isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} isDark={isDark} tk={tk} />}
            {activeTab === 'insights'     && <Insights     transactions={transactions} isDark={isDark} tk={tk} />}
          </div>
        )}
      </main>

      <nav className="bottom-nav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 90,
        background: tk.header, backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${tk.border}`,
        display: 'flex', alignItems: 'stretch', height: 62,
      }}>
        {TABS.map(t => {
          const isActive = activeTab === t
          return (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              flex: 1, border: 'none', background: 'transparent', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              color: isActive ? '#818cf8' : tk.textFaint, transition: 'color 0.15s', position: 'relative',
            }}>
              {isActive && <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 2, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: '0 0 4px 4px' }} />}
              <span style={{ fontSize: 19 }}>{TAB_ICONS[t]}</span>
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 400, textTransform: 'capitalize' }}>{t}</span>
            </button>
          )
        })}
        {isAdmin && (
          <button onClick={openAdd} style={{ flex: 1, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, color: '#818cf8' }}>
            <div style={{ width: 34, height: 34, borderRadius: 11, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, boxShadow: '0 4px 14px rgba(99,102,241,0.4)' }}>+</div>
          </button>
        )}
      </nav>

      {showModal && <Modal onClose={closeModal} onSave={onSave} editTx={editTx} isDark={isDark} tk={tk} />}
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  )
}

export default function App() {
  return <ThemeProvider><Inner /></ThemeProvider>
}
