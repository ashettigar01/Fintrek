import React, { useState } from 'react'
import { ALL_CATEGORIES } from './data'

export default function Modal({ onClose, onSave, editTx, isDark, tk }) {
  const [form, setForm] = useState(
    editTx
      ? { ...editTx, amount: Math.abs(editTx.amount) }
      : { date: '', description: '', amount: '', category: 'Food', type: 'expense' }
  )
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.description.trim()) e.description = 'Required'
    if (!form.date)               e.date        = 'Required'
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount'
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    const amt = parseFloat(form.amount)
    onSave({ ...form, amount: form.type === 'expense' ? -Math.abs(amt) : Math.abs(amt), id: editTx?.id || Date.now() })
  }

  const bg      = isDark ? '#151b2b' : '#ffffff'
  const overlay = isDark ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.4)'

  // Use solid backgrounds and colorScheme to fix native browser controls in both themes
  const inputStyle = {
    width: '100%',
    background: isDark ? '#1e2a40' : '#f1f5f9',
    border: `1px solid ${tk.border}`,
    borderRadius: 10,
    padding: '10px 14px',
    color: isDark ? '#ffffff' : '#0f172a',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    colorScheme: isDark ? 'dark' : 'light',
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: overlay, backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      animation: 'fadeIn 0.15s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: bg, border: `1px solid ${tk.border}`,
        borderRadius: 20, padding: '32px 32px 28px',
        width: '100%', maxWidth: 440,
        boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
        animation: 'fadeUp 0.2s ease',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: tk.text, margin: 0 }}>
              {editTx ? 'Edit Transaction' : 'New Transaction'}
            </h3>
            <p style={{ fontSize: 13, color: tk.textMuted, margin: '4px 0 0' }}>
              {editTx ? 'Update the details below' : 'Add a new entry to your ledger'}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, border: `1px solid ${tk.border}`,
            background: 'transparent', color: tk.textMuted, cursor: 'pointer', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        {/* Type toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', borderRadius: 12, padding: 4 }}>
          {['expense', 'income'].map(t => (
            <button key={t} onClick={() => set('type', t)} style={{
              flex: 1, padding: '9px', borderRadius: 9, border: 'none',
              background: form.type === t ? (t === 'income' ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)') : 'transparent',
              color: form.type === t ? (t === 'income' ? '#10b981' : '#f43f5e') : tk.textMuted,
              fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s',
            }}>{t === 'income' ? '↑ Income' : '↓ Expense'}</button>
          ))}
        </div>

        {/* Fields */}
        {[
          { label: 'Description', key: 'description', type: 'text',   placeholder: 'e.g. Grocery, Salary…' },
          { label: 'Date',        key: 'date',        type: 'date' },
          { label: 'Amount (₹)',  key: 'amount',      type: 'number', placeholder: '0.00' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: tk.textMuted, display: 'block', marginBottom: 5, fontWeight: 600 }}>{f.label}</label>
            <input
              type={f.type} value={form[f.key]} placeholder={f.placeholder}
              onChange={e => { set(f.key, e.target.value); setErrors(er => ({ ...er, [f.key]: null })) }}
              style={{ ...inputStyle, borderColor: errors[f.key] ? 'rgba(244,63,94,0.5)' : tk.border }}
            />
            {errors[f.key] && <p style={{ fontSize: 11, color: '#f43f5e', margin: '4px 0 0' }}>{errors[f.key]}</p>}
          </div>
        ))}

        {/* Category */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, color: tk.textMuted, display: 'block', marginBottom: 5, fontWeight: 600 }}>Category</label>
          <select value={form.category} onChange={e => set('category', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px', borderRadius: 11, border: `1px solid ${tk.border}`,
            background: 'transparent', color: tk.textMuted, cursor: 'pointer', fontSize: 14, fontWeight: 500,
          }}>Cancel</button>
          <button onClick={handleSave} style={{
            flex: 2, padding: '11px', borderRadius: 11, border: 'none',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700,
            boxShadow: '0 4px 20px rgba(99,102,241,0.35)', transition: 'transform 0.1s, box-shadow 0.1s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(99,102,241,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.35)' }}
          >
            {editTx ? 'Save Changes' : '+ Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  )
}
