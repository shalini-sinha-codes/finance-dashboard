import { createContext, useContext, useState, useEffect } from 'react'
import { initialTransactions } from '../data/transactions'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // ── Transactions (persisted) ──────────────────────────────
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('fd_transactions')
      return saved ? JSON.parse(saved) : initialTransactions
    } catch { return initialTransactions }
  })

  useEffect(() => {
    localStorage.setItem('fd_transactions', JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = (t) =>
    setTransactions(prev => [{ ...t, id: Date.now() }, ...prev])

  const editTransaction = (id, updated) =>
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t))

  const deleteTransaction = (id) =>
    setTransactions(prev => prev.filter(t => t.id !== id))

  // ── Role ─────────────────────────────────────────────────
  const [role, setRole] = useState('viewer')

  // ── Theme ────────────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('fd_theme') === 'dark'
  })
  useEffect(() => {
    localStorage.setItem('fd_theme', darkMode ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  // ── Filters ──────────────────────────────────────────────
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',
    sortOrder: 'desc',
  })

  const updateFilter = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value }))

  const resetFilters = () =>
    setFilters({ search: '', type: 'all', category: 'all', dateFrom: '', dateTo: '', sortBy: 'date', sortOrder: 'desc' })

  // ── Derived filtered list ─────────────────────────────────
  const filteredTransactions = transactions
    .filter(t => {
      const matchSearch =
        t.category.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.type.toLowerCase().includes(filters.search.toLowerCase())
      const matchType   = filters.type === 'all' || t.type === filters.type
      const matchCat    = filters.category === 'all' || t.category === filters.category
      const matchFrom   = !filters.dateFrom || t.date >= filters.dateFrom
      const matchTo     = !filters.dateTo   || t.date <= filters.dateTo
      return matchSearch && matchType && matchCat && matchFrom && matchTo
    })
    .sort((a, b) => {
      let va = filters.sortBy === 'amount' ? a.amount : a.date
      let vb = filters.sortBy === 'amount' ? b.amount : b.date
      if (va < vb) return filters.sortOrder === 'asc' ? -1 : 1
      if (va > vb) return filters.sortOrder === 'asc' ? 1 : -1
      return 0
    })

  const categories = [...new Set(transactions.map(t => t.category))].sort()

  return (
    <AppContext.Provider value={{
      transactions, addTransaction, editTransaction, deleteTransaction,
      role, setRole,
      darkMode, setDarkMode,
      filters, updateFilter, resetFilters,
      filteredTransactions, categories,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
