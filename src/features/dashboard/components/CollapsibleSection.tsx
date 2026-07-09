import { useState } from 'react'
import type { ReactNode } from 'react'

interface CollapsibleSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

function CollapsibleSection({ title, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div style={{
      background:   '#f8fafc',
      border:       '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding:      '18px 20px',
      marginBottom: '20px',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width:          '100%',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          background:     'transparent',
          border:         'none',
          padding:        0,
          marginBottom:   open ? '16px' : 0,
          cursor:         'pointer',
        }}
      >
        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
          {title}
        </span>
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.15s' }}
        >
          <polyline points="2 5 7 10 12 5" />
        </svg>
      </button>

      {open && children}
    </div>
  )
}

export default CollapsibleSection
