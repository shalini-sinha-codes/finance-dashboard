import { FiPieChart, FiTrendingUp, FiTrendingDown, FiCheckCircle, FiActivity, FiCalendar } from 'react-icons/fi'
import { useApp } from '../context/AppContext'

function Insights() {
  const { transactions } = useApp()

  if (transactions.length === 0) {
    return (
      <div className="table-card fade-up" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <FiActivity style={{ fontSize: 28, marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
        <p>Add some transactions to see insights.</p>
      </div>
    )
  }

  const expenses   = transactions.filter(t => t.type === 'expense')
  const incomes    = transactions.filter(t => t.type === 'income')
  const totalIncome  = incomes.reduce((a, t) => a + t.amount, 0)
  const totalExpense = expenses.reduce((a, t) => a + t.amount, 0)
  const savingsRate  = totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0
  const avgTx = transactions.length > 0 ? Math.round(transactions.reduce((a, t) => a + t.amount, 0) / transactions.length) : 0

  // Highest spending category
  const catMap = {}
  expenses.forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount })
  const highestCat = Object.keys(catMap).length > 0
    ? Object.entries(catMap).sort((a, b) => b[1] - a[1])[0]
    : null

  // Monthly comparison
  const monthMap = {}
  transactions.forEach(t => {
    const month = t.date.slice(0, 7) // "2026-03"
    if (!monthMap[month]) monthMap[month] = { income: 0, expense: 0 }
    if (t.type === 'income')  monthMap[month].income  += t.amount
    else                      monthMap[month].expense += t.amount
  })
  const months = Object.entries(monthMap).sort((a, b) => a[0].localeCompare(b[0]))

  const fmt = (n) => '₹ ' + n.toLocaleString('en-IN')
  const fmtMonth = (m) => new Date(m + '-01').toLocaleString('default', { month: 'short', year: '2-digit' })

  const status = totalIncome >= totalExpense
    ? { label: 'On Track', color: 'var(--green-ic)', bg: 'var(--green-bg)' }
    : { label: 'Overspending', color: 'var(--red-ic)', bg: 'var(--red-bg)' }

  const cards = [
    {
      icon: <FiPieChart />, cls: 'purple',
      label: 'Highest Spending Category',
      value: highestCat ? highestCat[0] : 'N/A',
      sub: highestCat ? fmt(highestCat[1]) + ' total' : '',
    },
    {
      icon: <FiTrendingUp />, cls: 'green',
      label: 'Total Income',
      value: fmt(totalIncome),
      sub: `${incomes.length} transactions`,
    },
    {
      icon: <FiTrendingDown />, cls: 'red',
      label: 'Total Expenses',
      value: fmt(totalExpense),
      sub: `${expenses.length} transactions`,
    },
    {
      icon: <FiCheckCircle />, cls: 'blue',
      label: 'Financial Status',
      value: status.label,
      sub: `Savings rate: ${savingsRate}%`,
    },
    {
      icon: <FiActivity />, cls: 'orange',
      label: 'Avg Transaction Value',
      value: fmt(avgTx),
      sub: `Across ${transactions.length} records`,
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="insights-grid">
        {cards.map((c, i) => (
          <div key={i} className={`insight-card fade-up fade-up-${i + 1}`}>
            <div className={`insight-icon ${c.cls}`}>{c.icon}</div>
            <div>
              <p className="insight-label">{c.label}</p>
              <p className="insight-value">{c.value}</p>
              {c.sub && <p className="insight-sub">{c.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Monthly comparison */}
      {months.length >= 1 && (
        <div className="insight-card fade-up" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div className="insight-icon teal"><FiCalendar /></div>
            <div>
              <p className="insight-label">Monthly Comparison</p>
              <p className="insight-value" style={{ fontSize: 14 }}>Income vs Expenses by month</p>
            </div>
          </div>
          <table className="monthly-table">
            <thead>
              <tr>
                <th>Month</th>
                <th style={{ textAlign: 'right' }}>Income</th>
                <th style={{ textAlign: 'right' }}>Expenses</th>
                <th style={{ textAlign: 'right' }}>Net</th>
              </tr>
            </thead>
            <tbody>
              {months.map(([month, data]) => {
                const net = data.income - data.expense
                return (
                  <tr key={month}>
                    <td>{fmtMonth(month)}</td>
                    <td style={{ textAlign: 'right', color: 'var(--green-ic)', fontWeight: 600 }}>{fmt(data.income)}</td>
                    <td style={{ textAlign: 'right', color: 'var(--red-ic)',   fontWeight: 600 }}>{fmt(data.expense)}</td>
                    <td style={{ textAlign: 'right', color: net >= 0 ? 'var(--green-ic)' : 'var(--red-ic)', fontWeight: 700 }}>
                      {net >= 0 ? '+' : ''}{fmt(net)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Insights
