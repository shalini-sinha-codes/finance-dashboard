import { useState } from 'react'
import { FiDownload, FiChevronDown } from 'react-icons/fi'
import { useApp } from '../context/AppContext'

function ExportButton() {
  const { transactions } = useApp()
  const [open, setOpen] = useState(false)

  const exportCSV = () => {
    const header = ['id', 'date', 'amount', 'category', 'type']
    const rows   = transactions.map(t => header.map(k => t[k]).join(','))
    const blob   = new Blob([header.join(',') + '\n' + rows.join('\n')], { type: 'text/csv' })
    download(blob, 'transactions.csv')
    setOpen(false)
  }

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' })
    download(blob, 'transactions.json')
    setOpen(false)
  }

  const download = (blob, name) => {
    const url = URL.createObjectURL(blob)
    const a   = Object.assign(document.createElement('a'), { href: url, download: name })
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button className="export-btn" onClick={() => setOpen(o => !o)}>
        <FiDownload /> Export <FiChevronDown />
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 6px)',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 8, overflow: 'hidden',
          boxShadow: 'var(--shadow-md)', zIndex: 100, minWidth: 130,
        }}>
          <button onClick={exportCSV} style={{ display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 13, cursor: 'pointer' }}
            onMouseEnter={e => e.target.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.target.style.background = 'transparent'}>
            Download CSV
          </button>
          <button onClick={exportJSON} style={{ display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 13, cursor: 'pointer', borderTop: '1px solid var(--border)' }}
            onMouseEnter={e => e.target.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.target.style.background = 'transparent'}>
            Download JSON
          </button>
        </div>
      )}
    </div>
  )
}

export default ExportButton
