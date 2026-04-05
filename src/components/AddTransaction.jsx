import { useState } from 'react'
import { FiPlusCircle } from 'react-icons/fi'
import { useApp } from '../context/AppContext'

const empty = { date: '', amount: '', category: '', type: 'expense' }

function AddTransaction() {
  const { role, addTransaction } = useApp()
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')

  if (role !== 'admin') return null

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.date || !form.amount || !form.category.trim()) {
      setError('All fields are required.')
      return
    }
    if (Number(form.amount) <= 0) {
      setError('Amount must be greater than 0.')
      return
    }
    addTransaction({ ...form, amount: Number(form.amount), category: form.category.trim() })
    setForm(empty)
    setError('')
  }

  return (
    <div className="add-card fade-up">
      <div className="add-card-title">
        <FiPlusCircle /> Add New Transaction
      </div>
      {error && (
        <p style={{ color: 'var(--red-ic)', fontSize: 12, marginBottom: 10 }}>{error}</p>
      )}
      <form className="add-form" onSubmit={handleSubmit}>
        <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
        <input type="number" placeholder="Amount (₹)" value={form.amount} onChange={e => set('amount', e.target.value)} min="1" />
        <input type="text"   placeholder="Category"   value={form.category} onChange={e => set('category', e.target.value)} />
        <select value={form.type} onChange={e => set('type', e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button type="submit" className="btn-primary"><FiPlusCircle /> Add</button>
      </form>
    </div>
  )
}

export default AddTransaction
