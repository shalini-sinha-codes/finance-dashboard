import { FiGrid, FiBarChart2, FiList, FiZap } from 'react-icons/fi'
import { RiMoneyDollarCircleLine } from 'react-icons/ri'
import { useApp } from '../context/AppContext'

const NAV = [
  { label: 'Dashboard',    icon: <FiGrid />,     id: 'dashboard'    },
  { label: 'Analytics',   icon: <FiBarChart2 />, id: 'analytics'   },
  { label: 'Transactions',icon: <FiList />,      id: 'transactions' },
  { label: 'Insights',    icon: <FiZap />,       id: 'insights'     },
]

function Sidebar({ activeSection }) {
  const { role } = useApp()

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-logo"><RiMoneyDollarCircleLine /></div>
        <span className="sb-name">FinanceDash</span>
      </div>

      <nav className="sb-nav">
        <p className="nav-section-label">MENU</p>
        {NAV.map(item => (
          <button
            key={item.id}
            className={`nav-btn ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => scrollTo(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sb-footer">
        <div className="sb-user">
          <div className="user-avatar">U</div>
          <div>
            <div className="user-name">User</div>
            <div className="user-role-tag">{role === 'admin' ? '🔑 Admin' : '👁 Viewer'}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
