import { Link, useLocation } from 'react-router-dom'

const TABS = [
  { path: '/admin/plants', label: 'Plants' },
  { path: '/admin/orders', label: 'Orders' },
  { path: '/admin/messages', label: 'Messages' },
  { path: '/admin/users', label: 'Users' },
]

function AdminNav() {
  const { pathname } = useLocation()

  return (
    <div className="flex gap-1 mb-8 border-b border-pink-light/30 pb-px">
      {TABS.map(tab => {
        const active = pathname === tab.path
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`px-4 py-2.5 text-sm font-medium no-underline transition-colors rounded-t-lg -mb-px ${
              active
                ? 'text-pink-dark border-b-2 border-pink bg-white'
                : 'text-ink-faint hover:text-ink-light'
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}

export default AdminNav
