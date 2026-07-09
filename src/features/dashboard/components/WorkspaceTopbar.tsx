import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../context/ThemeContext'
import UserMenu from './UserMenu'

function WorkspaceTopbar() {
  const navigate = useNavigate()
  const { lang, toggleLang } = useTheme()
  const isRTL = lang === 'ar'

  const t = {
    en: { title: 'Workspace', create: 'Create' },
    ar: { title: 'مساحة العمل', create: 'إنشاء' },
  }[lang]

  const iconBtnStyle = {
    width:          '36px',
    height:         '36px',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    background:     'transparent',
    border:         'none',
    borderRadius:   '50%',
    cursor:         'pointer',
    color:          '#64748b',
    transition:     'background 0.15s, color 0.15s',
    flexShrink:     0,
  }

  function hoverOn(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.style.background = 'var(--page-bg)'
    e.currentTarget.style.color = 'var(--text-primary)'
  }
  function hoverOff(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.style.background = 'transparent'
    e.currentTarget.style.color = '#64748b'
  }

  return (
    <header style={{
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      padding:        '16px 24px',
      background:     '#f8fafc',
      flexShrink:     0,
      direction:      isRTL ? 'rtl' : 'ltr',
    }}>
      <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
        {t.title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={() => navigate('/home?tab=templates')}
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          '6px',
            padding:      '9px 16px',
            background:   'var(--accent)',
            border:       'none',
            borderRadius: 'var(--radius-md)',
            color:        '#fff',
            fontSize:     '13px',
            fontWeight:   '600',
            cursor:       'pointer',
            marginInlineEnd: '6px',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6.5 1v11M1 6.5h11"/>
          </svg>
          {t.create}
        </button>

        <button style={iconBtnStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff} title="Search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>

        <button
          onClick={toggleLang}
          style={iconBtnStyle}
          onMouseEnter={hoverOn}
          onMouseLeave={hoverOff}
          title={lang === 'en' ? 'عربي' : 'English'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </button>

        <button style={iconBtnStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff} title="Messages">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </button>

        <div style={{ width: '1px', height: '18px', background: '#e2e8f0', margin: '0 6px', flexShrink: 0 }} />

        <UserMenu />
      </div>
    </header>
  )
}

export default WorkspaceTopbar
