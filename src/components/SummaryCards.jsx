import { FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi'
import { useApp } from '../context/AppContext'

function SummaryCards() {
  const { transactions } = useApp()

  const income  = transactions.filter(t => t.type === 'income') .reduce((a, t) => a + t.amount, 0)
  const expense = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
  const balance = income - expense

  const fmt = (n) => '₹ ' + n.toLocaleString('en-IN')

  return (
    <div className="cards-grid">
      <div className="summary-card fade-up fade-up-1">
        <div className="card-icon blue"><FiDollarSign /></div>
        <div>
          <p className="card-label">Total Balance</p>
          <p className={`card-value ${balance >= 0 ? 'blue' : 'red'}`}>{fmt(balance)}</p>
        </div>
      </div>
      <div className="summary-card fade-up fade-up-2">
        <div className="card-icon green"><FiTrendingUp /></div>
        <div>
          <p className="card-label">Total Income</p>
          <p className="card-value green">{fmt(income)}</p>
        </div>
      </div>
      <div className="summary-card fade-up fade-up-3">
        <div className="card-icon red"><FiTrendingDown /></div>
        <div>
          <p className="card-label">Total Expenses</p>
          <p className="card-value red">{fmt(expense)}</p>
        </div>
      </div>
    </div>
  )
}

export default SummaryCards
