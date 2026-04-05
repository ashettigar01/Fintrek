import { useState, useCallback, useEffect } from 'react'
import { api } from './api'

/**
 * useTransactions — encapsulates all transaction state and CRUD logic.
 * Extracted from App.jsx so the root component stays clean and this
 * logic can be reused or tested independently.
 */
export function useTransactions(notify) {
  const [transactions, setTransactions] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [apiLoading,   setApiLoading]   = useState(false)

  useEffect(() => {
    api.fetchTransactions()
      .then(data => { setTransactions(data); setLoading(false) })
      .catch(() => { setLoading(false); notify('Failed to load data', 'error') })
  }, [])

  const handleSave = useCallback(async (tx, editTx) => {
    setApiLoading(true)
    try {
      if (editTx) {
        await api.updateTransaction(tx)
        setTransactions(prev => prev.map(t => t.id === tx.id ? tx : t))
        notify('Transaction updated')
      } else {
        await api.createTransaction(tx)
        setTransactions(prev => [tx, ...prev])
        notify('Transaction added')
      }
    } catch { notify('Something went wrong', 'error') }
    setApiLoading(false)
  }, [notify])

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Delete this transaction?')) return
    setApiLoading(true)
    try {
      await api.deleteTransaction(id)
      setTransactions(prev => prev.filter(t => t.id !== id))
      notify('Transaction deleted')
    } catch { notify('Delete failed', 'error') }
    setApiLoading(false)
  }, [notify])

  const handleReset = useCallback(async () => {
    if (!window.confirm('Reset all data to defaults?')) return
    setApiLoading(true)
    const data = await api.resetData()
    setTransactions(data)
    setApiLoading(false)
    notify('Data reset to defaults', 'info')
  }, [notify])

  return { transactions, loading, apiLoading, handleSave, handleDelete, handleReset }
}
