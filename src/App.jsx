import { useState, useEffect } from 'react'
import { FiSun, FiMoon, FiUser } from 'react-icons/fi'
import { useApp } from './context/AppContext'
import Sidebar        from './components/Sidebar'
import SummaryCards   from './components/SummaryCards'
import Charts         from './components/Charts'
import TransactionsTable from './components/TransactionsTable'
import AddTransaction from './components/AddTransaction'
import Insights       from './components/Insights'
import ExportButton   from './components/ExportButton'
import './App.css'

const SECTIONS = ['dashboard', 'analytics', 'transactions', 'insights']

function App() {
  const { darkMode, setDarkMode, role, setRole } = useApp()
  const [activeSection, setActiveSection] = useState('dashboard')

  // Scroll-spy: highlight active sidebar item
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) })
      },
      { threshold: 0.3, rootMargin: '-60px 0px 0px 0px' }
    )
    SECTIONS.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const sectionTitle = {
    dashboard: 'Dashboard Overview',
    analytics: 'Analytics',
    transactions: 'Transactions',
    insights: 'Insights',
  }

  return (
    <div className="app-shell">
      <Sidebar activeSection={activeSection} />

      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <span className="greeting">Welcome back !</span>
            <span className="page-title">{sectionTitle[activeSection]}</span>
          </div>

          <div className="topbar-right">
            <ExportButton />

            <div className="role-pill">
              <FiUser />
              <select value={role} onChange={e => setRole(e.target.value)} className="role-select">
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <FiSun /> : <FiMoon />}
              {darkMode ? 'Light' : 'Dark'}
            </button>
          </div>
        </header>

        {/* Page body */}
        <main className="page-body">

          {/* Dashboard */}
          <section id="dashboard" style={{ scrollMarginTop: 70 }}>
            <div className="section-header">
              <h2 className="section-title">Overview</h2>
              <p className="section-sub">Your complete financial summary</p>
            </div>
            <SummaryCards />
            <div style={{ marginTop: 16 }}>
              <AddTransaction />
            </div>
          </section>

          {/* Analytics */}
          <section id="analytics" style={{ scrollMarginTop: 70 }}>
            <div className="section-header">
              <h2 className="section-title">Analytics</h2>
              <p className="section-sub">Balance trend and spending breakdown</p>
            </div>
            <Charts />
          </section>

          {/* Transactions */}
          <section id="transactions" style={{ scrollMarginTop: 70 }}>
            <div className="section-header">
              <h2 className="section-title">Transactions</h2>
              <p className="section-sub">Filter, search, sort, and manage your records</p>
            </div>
            <TransactionsTable />
          </section>

          {/* Insights */}
          <section id="insights" style={{ scrollMarginTop: 70 }}>
            <div className="section-header">
              <h2 className="section-title">Insights</h2>
              <p className="section-sub">Smart observations and monthly comparison</p>
            </div>
            <Insights />
          </section>

        </main>
      </div>
    </div>
  )
}

export default App
