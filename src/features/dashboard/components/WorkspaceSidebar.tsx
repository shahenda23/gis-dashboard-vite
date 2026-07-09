import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../context/ThemeContext'
import logoUrl from '../../../assets/logo.svg'

interface WorkspaceSidebarProps {
  onTemplatesClick: () => void
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="11" height="11" viewBox="0 0 14 14" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s', flexShrink: 0 }}
    >
      <polyline points="2 5 7 10 12 5" />
    </svg>
  )
}

function WorkspaceSidebar({ onTemplatesClick }: WorkspaceSidebarProps) {
  const navigate = useNavigate()
  const { lang } = useTheme()
  const isRTL = lang === 'ar'
  const [productsOpen, setProductsOpen] = useState(true)
  const [supportOpen, setSupportOpen]   = useState(true)

  const t = {
    en: {
      overview: 'Workspace Overview',
      main:     'MAIN',
      products: 'Products',
      templates:'Templates',
      api:      'API',
      support:  'Support',
      docs:     'Documentation',
      community:'Community',
      help:     'Help Center',
    },
    ar: {
      overview: 'نظرة عامة على المساحة',
      main:     'الرئيسية',
      products: 'المنتجات',
      templates:'القوالب',
      api:      'API',
      support:  'الدعم',
      docs:     'التوثيق',
      community:'المجتمع',
      help:     'مركز المساعدة',
    },
  }[lang]

  const linkStyle = {
    display:      'flex',
    alignItems:   'center',
    width:        '100%',
    padding:      '7px 10px',
    background:   'transparent',
    border:       'none',
    borderRadius: 'var(--radius-md)',
    fontSize:     '13px',
    color:        'var(--text-secondary)',
    cursor:       'pointer',
    textAlign:    isRTL ? 'right' as const : 'left' as const,
    transition:   'background 0.15s, color 0.15s',
  }

  return (
    <aside style={{
      width:         '240px',
      flexShrink:    0,
      height:        '100%',
      display:       'flex',
      flexDirection: 'column',
      background:    '#f8fafc',
      padding:       '18px 14px',
      overflowY:     'auto',
      direction:     isRTL ? 'rtl' : 'ltr',
    }}>

      {/* Brand */}
      <div
        onClick={() => navigate('/home')}
        style={{
          display:      'flex',
          alignItems:   'center',
          gap:          '10px',
          padding:      '4px 6px',
          marginBottom: '18px',
          cursor:       'pointer',
        }}
      >
        <img src={logoUrl} alt="logo" style={{ width: '26px', height: '26px', borderRadius: '6px' }} />
        <span style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '-0.2px' }}>
          <span style={{ color: '#0f172a' }}>Dash</span>
          <span style={{ color: '#0ea5e9' }}>Builder</span>
        </span>
      </div>

      {/* Workspace Overview pill */}
      <button
        onClick={() => navigate('/home')}
        style={{
          display:      'flex',
          alignItems:   'center',
          gap:          '10px',
          width:        '100%',
          padding:      '10px 12px',
          marginBottom: '18px',
          background:   '#334155',
          border:       'none',
          borderRadius: 'var(--radius-md)',
          color:        '#fff',
          fontSize:     '13px',
          fontWeight:   '600',
          cursor:       'pointer',
          textAlign:    isRTL ? 'right' : 'left',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="1" y="1" width="5" height="5" rx="1"/>
          <rect x="8" y="1" width="5" height="5" rx="1"/>
          <rect x="1" y="8" width="5" height="5" rx="1"/>
          <rect x="8" y="8" width="5" height="5" rx="1"/>
        </svg>
        {t.overview}
      </button>

      <span style={{
        fontSize:      '10px',
        fontWeight:    '700',
        color:         'var(--text-muted)',
        letterSpacing: '1px',
        padding:       '0 10px',
        marginBottom:  '8px',
      }}>
        {t.main}
      </span>

      {/* Products group */}
      <button
        onClick={() => setProductsOpen(o => !o)}
        style={{ ...linkStyle, justifyContent: 'space-between', fontWeight: 600, color: 'var(--text-primary)' }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M1 4h12M1 7h12M1 10h8"/>
          </svg>
          {t.products}
        </span>
        <ChevronIcon open={productsOpen} />
      </button>
      {productsOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', paddingInlineStart: '22px' }}>
          <button
            onClick={onTemplatesClick}
            style={linkStyle}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--page-bg)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            {t.templates}
          </button>
          <button
            onClick={() => navigate('/api')}
            style={linkStyle}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--page-bg)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            {t.api}
          </button>
        </div>
      )}

      {/* Support group */}
      <button
        onClick={() => setSupportOpen(o => !o)}
        style={{ ...linkStyle, justifyContent: 'space-between', fontWeight: 600, color: 'var(--text-primary)', marginTop: '6px' }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="7" cy="7" r="6"/>
            <path d="M5.3 5.3a1.7 1.7 0 1 1 2.5 1.5c-.6.35-.8.6-.8 1.2M7 10v.01"/>
          </svg>
          {t.support}
        </span>
        <ChevronIcon open={supportOpen} />
      </button>
      {supportOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', paddingInlineStart: '22px' }}>
          <button
            onClick={() => navigate('/docs')}
            style={linkStyle}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--page-bg)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            {t.docs}
          </button>
          <button
            onClick={() => navigate('/community')}
            style={linkStyle}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--page-bg)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            {t.community}
          </button>
          <button
            onClick={() => navigate('/help-center')}
            style={linkStyle}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--page-bg)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            {t.help}
          </button>
        </div>
      )}
    </aside>
  )
}

export default WorkspaceSidebar
