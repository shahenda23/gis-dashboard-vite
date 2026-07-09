import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { getUserDashboards, getUserPublicDashboards, deleteDashboardById } from '../services/dashboardService'
import WorkspaceSidebar from '../features/dashboard/components/WorkspaceSidebar'
import WorkspaceTopbar from '../features/dashboard/components/WorkspaceTopbar'
import CollapsibleSection from '../features/dashboard/components/CollapsibleSection'
import DashboardCard from '../features/dashboard/components/DashboardCard'
import ShareModal from '../features/dashboard/components/ShareModal'
import TemplateCard from '../features/templates/components/TemplateCard'
import TEMPLATES from '../features/templates/data/sampleTemplates'
import AppLoader from '../components/AppLoader'

const RECENT_PAGE_SIZE = 3
const SHARED_PAGE_SIZE = 4

function timeAgo(dateStr: string, lang: 'en' | 'ar'): string {
  const diff  = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  < 1)  return lang === 'en' ? 'just now'      : 'الآن'
  if (mins  < 60) return lang === 'en' ? `${mins}m ago`  : `منذ ${mins} د`
  if (hours < 24) return lang === 'en' ? `${hours}h ago` : `منذ ${hours} س`
  return lang === 'en' ? `${days}d ago` : `منذ ${days} ي`
}

function HomePage() {
  const navigate = useNavigate()
  const { lang } = useTheme()
  const { user }  = useAuth()
  const isRTL = lang === 'ar'

  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab: 'workspace' | 'templates' = searchParams.get('tab') === 'templates' ? 'templates' : 'workspace'
  function setActiveTab(tab: 'workspace' | 'templates') {
    setSearchParams(tab === 'templates' ? { tab: 'templates' } : {})
  }
  const [recentDashboards, setRecentDashboards] = useState<any[]>([])
  const [sharedDashboards, setSharedDashboards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [shareModalId, setShareModalId] = useState<string | null>(null)
  const [recentExpanded, setRecentExpanded] = useState(false)
  const [sharedExpanded, setSharedExpanded] = useState(false)

  useEffect(() => {
    if (!user) return
    Promise.all([
      getUserDashboards(user.id),
      getUserPublicDashboards(user.id),
    ]).then(([recent, shared]) => {
      if (recent.data) setRecentDashboards(recent.data)
      if (shared.data) setSharedDashboards(shared.data)
      setLoading(false)
    })
  }, [user])

  async function handleDelete(id: string) {
    await deleteDashboardById(id)
    setRecentDashboards(prev => prev.filter(d => d.id !== id))
  }

  function toCardProps(d: any) {
    return {
      id:           d.id,
      title:        d.title,
      description:  '',
      editedAt:     timeAgo(d.updated_at, lang),
      widgetCount:  d.widgets?.length ?? 0,
      thumbnailUrl: '',
      status:       'live' as const,
      isPublic:     d.is_public,
    }
  }

  const t = {
    en: {
      myWorkspace: 'My Workspace',
      templates:   'Templates',
      filter:      'Filter',
      recent:      'Recent Dashboards',
      shared:      'Shared Dashboards',
      newCard:     'New Dashboard',
      newSub:      'Start from a blank canvas or choose a template',
      showMore:    'Show more',
      showLess:    'Show less',
      noShared:    'No public dashboards shared yet.',
      footerRights:'© 2026 DashBuilder Inc. All rights reserved.',
      privacy:     'Privacy Policy',
      terms:       'Terms of Service',
      contact:     'Contact Support',
    },
    ar: {
      myWorkspace: 'مساحتي',
      templates:   'القوالب',
      filter:      'تصفية',
      recent:      'أحدث اللوحات',
      shared:      'لوحات مشتركة',
      newCard:     'لوحة جديدة',
      newSub:      'ابدأ من لوحة فارغة أو اختر قالباً',
      showMore:    'عرض المزيد',
      showLess:    'عرض أقل',
      noShared:    'لا توجد لوحات عامة مشتركة بعد.',
      footerRights:'© 2026 DashBuilder Inc. جميع الحقوق محفوظة.',
      privacy:     'سياسة الخصوصية',
      terms:       'شروط الخدمة',
      contact:     'الدعم الفني',
    },
  }[lang]

  const visibleRecent = recentExpanded ? recentDashboards : recentDashboards.slice(0, RECENT_PAGE_SIZE)
  const visibleShared = sharedExpanded ? sharedDashboards : sharedDashboards.slice(0, SHARED_PAGE_SIZE)

  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden', background: 'var(--page-bg)' }}>
      <WorkspaceSidebar onTemplatesClick={() => setActiveTab('templates')} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <WorkspaceTopbar />

        {/* Fixed-height workspace container — scrolling happens inside it */}
        <div style={{ flex: 1, overflow: 'hidden', padding: '20px 24px' }}>
          <div style={{
            background:   'var(--surface)',
            border:       '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            height:       '100%',
            display:      'flex',
            flexDirection:'column',
            overflow:     'hidden',
            direction:    isRTL ? 'rtl' : 'ltr',
          }}>

            {/* Tabs + Filter */}
            <div style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              padding:        '16px 24px',
              flexShrink:     0,
            }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                {(['workspace', 'templates'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      background:   'transparent',
                      border:       'none',
                      borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
                      padding:      '6px 2px',
                      fontSize:     '14px',
                      fontWeight:   activeTab === tab ? '700' : '500',
                      color:        activeTab === tab ? 'var(--accent)' : 'var(--text-secondary)',
                      cursor:       'pointer',
                    }}
                  >
                    {tab === 'workspace' ? t.myWorkspace : t.templates}
                  </button>
                ))}
              </div>

              {activeTab === 'workspace' && (
                <button style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          '6px',
                  padding:      '7px 14px',
                  background:   'var(--page-bg)',
                  border:       '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize:     '12px',
                  fontWeight:   '600',
                  color:        'var(--text-secondary)',
                  cursor:       'pointer',
                }}>
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M1 2h12M3.5 7h7M6 12h2"/>
                  </svg>
                  {t.filter}
                </button>
              )}
            </div>

            <div style={{ padding: '20px 24px', flex: 1, overflowY: 'auto', minHeight: 0 }}>
              {loading ? (
                <AppLoader />
              ) : activeTab === 'templates' ? (
                <div style={{
                  display:             'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap:                 '16px',
                }}>
                  {TEMPLATES.map(template => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onSelect={id => navigate(`/builder/${id}`)}
                    />
                  ))}
                </div>
              ) : (
                <>
                  <CollapsibleSection title={t.recent}>
                    <div style={{
                      display:             'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                      gap:                 '16px',
                      marginBottom:        recentDashboards.length > RECENT_PAGE_SIZE ? '14px' : 0,
                    }}>
                      <div
                        onClick={() => setActiveTab('templates')}
                        style={{
                          background:     'rgba(255,255,255,0.7)',
                          border:         '1.5px dashed #cbd5e1',
                          borderRadius:   'var(--radius-xl)',
                          minHeight:      '210px',
                          display:        'flex',
                          flexDirection:  'column',
                          alignItems:     'center',
                          justifyContent: 'center',
                          gap:            '10px',
                          cursor:         'pointer',
                          transition:     'border-color 0.2s, background 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-light)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = 'rgba(255,255,255,0.7)' }}
                      >
                        <div style={{
                          width: '38px', height: '38px', borderRadius: '10px',
                          background: '#fff', border: '1px solid var(--border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8',
                        }}>
                          <svg width="16" height="16" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <path d="M6.5 1v11M1 6.5h11"/>
                          </svg>
                        </div>
                        <div style={{ textAlign: 'center', padding: '0 16px' }}>
                          <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: '0 0 4px' }}>{t.newCard}</p>
                          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>{t.newSub}</p>
                        </div>
                      </div>

                      {visibleRecent.map(d => (
                        <DashboardCard
                          key={d.id}
                          dashboard={toCardProps(d)}
                          onOpen={   id => navigate(`/builder/${id}`)}
                          onEdit={   id => navigate(`/builder/${id}`)}
                          onPreview={id => navigate(`/dashboard/${id}`)}
                          onShare={  id => setShareModalId(id)}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>

                    {recentDashboards.length > RECENT_PAGE_SIZE && (
                      <button
                        onClick={() => setRecentExpanded(v => !v)}
                        style={{
                          background: 'transparent', border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)', padding: '7px 16px',
                          fontSize: '12px', fontWeight: '600', color: 'var(--accent)', cursor: 'pointer',
                        }}
                      >
                        {recentExpanded ? t.showLess : t.showMore}
                      </button>
                    )}
                  </CollapsibleSection>

                  <CollapsibleSection title={t.shared} defaultOpen={false}>
                    {sharedDashboards.length === 0 ? (
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>{t.noShared}</p>
                    ) : (
                      <>
                        <div style={{
                          display:             'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                          gap:                 '16px',
                          marginBottom:        sharedDashboards.length > SHARED_PAGE_SIZE ? '14px' : 0,
                        }}>
                          {visibleShared.map(d => (
                            <DashboardCard
                              key={d.id}
                              dashboard={toCardProps(d)}
                              onOpen={   id => navigate(`/dashboard/${id}`)}
                              onEdit={   id => navigate(`/dashboard/${id}`)}
                              onPreview={id => navigate(`/dashboard/${id}`)}
                              onShare={  id => setShareModalId(id)}
                              onDelete={() => {}}
                            />
                          ))}
                        </div>
                        {sharedDashboards.length > SHARED_PAGE_SIZE && (
                          <button
                            onClick={() => setSharedExpanded(v => !v)}
                            style={{
                              background: 'transparent', border: '1px solid var(--border)',
                              borderRadius: 'var(--radius-md)', padding: '7px 16px',
                              fontSize: '12px', fontWeight: '600', color: 'var(--accent)', cursor: 'pointer',
                            }}
                          >
                            {sharedExpanded ? t.showLess : t.showMore}
                          </button>
                        )}
                      </>
                    )}
                  </CollapsibleSection>
                </>
              )}
            </div>

            {/* Small in-container footer — pinned, never scrolls */}
            <div style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              flexWrap:       'wrap',
              gap:            '10px',
              padding:        '16px 24px',
              borderTop:      '1px solid var(--border)',
              fontSize:       '12px',
              color:          'var(--text-muted)',
              flexShrink:     0,
            }}>
              <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>DashBuilder</span>
              <div style={{ display: 'flex', gap: '18px' }}>
                <span style={{ cursor: 'pointer' }}>{t.privacy}</span>
                <span style={{ cursor: 'pointer' }}>{t.terms}</span>
                <span style={{ cursor: 'pointer' }}>{t.contact}</span>
              </div>
              <span>{t.footerRights}</span>
            </div>
          </div>
        </div>
      </div>

      {shareModalId && (
        <ShareModal dashboardId={shareModalId} onClose={() => setShareModalId(null)} />
      )}
    </div>
  )
}

export default HomePage
