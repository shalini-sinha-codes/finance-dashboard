import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts'
import { useApp } from '../context/AppContext'

const COLORS = ['#6366f1','#22c55e','#f59e0b','#ef4444','#06b6d4','#a78bfa']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '10px 14px', fontSize: 12,
      boxShadow: 'var(--shadow-md)'
    }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 600 }}>
          ₹ {Number(p.value).toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  )
}

function Charts() {
  const { transactions } = useApp()

  // Balance trend over time
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date))
  let running = 0
  const trendData = sorted.map(t => {
    running += t.type === 'income' ? t.amount : -t.amount
    return { date: t.date.slice(5), balance: running }
  })

  // Spending by category (pie)
  const catMap = {}
  transactions.filter(t => t.type === 'expense').forEach(t => {
    catMap[t.category] = (catMap[t.category] || 0) + t.amount
  })
  const pieData = Object.entries(catMap).map(([name, value]) => ({ name, value }))

  const emptyState = (msg) => (
    <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
      {msg}
    </div>
  )

  return (
    <div className="charts-grid">
      <div className="chart-card fade-up fade-up-1">
        <h3>Balance Trend</h3>
        {trendData.length < 2 ? emptyState('Not enough data for trend') : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => '₹'+Math.round(v/1000)+'k'} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="chart-card fade-up fade-up-2">
        <h3>Spending Breakdown</h3>
        {pieData.length === 0 ? emptyState('No expense data') : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend iconSize={10} iconType="circle" />
              <Tooltip formatter={(v) => '₹ ' + v.toLocaleString('en-IN')} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export default Charts
