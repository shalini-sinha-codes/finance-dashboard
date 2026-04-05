import { useState } from 'react'
import { FiSearch, FiEdit2, FiTrash2, FiRefreshCw } from 'react-icons/fi'
import { useApp } from '../context/AppContext'

function TransactionsTable() {
  const { filteredTransactions, filters, updateFilter, resetFilters, categories, role, editTransaction, deleteTransaction } = useApp()
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const startEdit = (t) => { setEditId(t.id); setEditForm({ ...t }) }
  const saveEdit  = () => { editTransaction(editId, editForm); setEditId(null) }
  const cancelEdit = () => setEditId(null)

  const hasActiveFilters = filters.search || filters.type !== 'all' || filters.category !== 'all' || filters.dateFrom || filters.dateTo

  return (
    <div className="table-card fade-up">
      {/* Controls */}
      <div className="table-controls">
        <div style={{ position: 'relative' }}>
          <FiSearch style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 13 }} />
          <input
            style={{ paddingLeft: 28 }}
            placeholder="Search category or type…"
            value={filters.search}
            onChange={e => updateFilter('search', e.target.value)}
          />
        </div>

        <select value={filters.type} onChange={e => updateFilter('type', e.target.value)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select value={filters.category} onChange={e => updateFilter('category', e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <input type="date" value={filters.dateFrom} onChange={e => updateFilter('dateFrom', e.target.value)} title="From date" />
        <input type="date" value={filters.dateTo}   onChange={e => updateFilter('dateTo',   e.target.value)} title="To date"   />

        <select value={filters.sortBy + '_' + filters.sortOrder} onChange={e => {
          const [by, ord] = e.target.value.split('_')
          updateFilter('sortBy', by); updateFilter('sortOrder', ord)
        }}>
          <option value="date_desc">Date: Newest</option>
          <option value="date_asc">Date: Oldest</option>
          <option value="amount_desc">Amount: High→Low</option>
          <option value="amount_asc">Amount: Low→High</option>
        </select>

        {hasActiveFilters && (
          <button className="reset-btn" onClick={resetFilters} title="Clear filters">
            <FiRefreshCw style={{ marginRight: 4 }} />Clear
          </button>
        )}

        <span className="table-count">{filteredTransactions.length} record{filteredTransactions.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="table-wrap">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <FiSearch />
            <p>No transactions match your filters.</p>
            {hasActiveFilters && <button className="reset-btn" style={{ marginTop: 10 }} onClick={resetFilters}>Clear filters</button>}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Type</th>
                {role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(t => (
                <tr key={t.id}>
                  {editId === t.id ? (
                    <>
                      <td><input type="date" value={editForm.date} onChange={e => setEditForm(p => ({ ...p, date: e.target.value }))} style={{ width: '100%', padding: '4px 6px', border: '1px solid var(--border-input)', borderRadius: 6, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 12 }} /></td>
                      <td><input type="number" value={editForm.amount} onChange={e => setEditForm(p => ({ ...p, amount: Number(e.target.value) }))} style={{ width: 90, padding: '4px 6px', border: '1px solid var(--border-input)', borderRadius: 6, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 12 }} /></td>
                      <td><input type="text" value={editForm.category} onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))} style={{ width: '100%', padding: '4px 6px', border: '1px solid var(--border-input)', borderRadius: 6, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 12 }} /></td>
                      <td>
                        <select value={editForm.type} onChange={e => setEditForm(p => ({ ...p, type: e.target.value }))} style={{ padding: '4px 6px', border: '1px solid var(--border-input)', borderRadius: 6, background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 12 }}>
                          <option value="income">Income</option>
                          <option value="expense">Expense</option>
                        </select>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-icon" onClick={saveEdit} title="Save">✓</button>
                          <button className="btn-icon" onClick={cancelEdit} title="Cancel">✕</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{t.date}</td>
                      <td className="amount-cell">₹ {t.amount.toLocaleString('en-IN')}</td>
                      <td>{t.category}</td>
                      <td><span className={`badge ${t.type}`}>{t.type === 'income' ? '↑' : '↓'} {t.type}</span></td>
                      {role === 'admin' && (
                        <td>
                          <div className="action-btns">
                            <button className="btn-icon" onClick={() => startEdit(t)} title="Edit"><FiEdit2 /></button>
                            <button className="btn-icon danger" onClick={() => { if (window.confirm('Delete this transaction?')) deleteTransaction(t.id) }} title="Delete"><FiTrash2 /></button>
                          </div>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default TransactionsTable
