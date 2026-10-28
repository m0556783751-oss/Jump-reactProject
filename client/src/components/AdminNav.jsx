import { Link, useLocation } from 'react-router-dom'
import './AdminNav.css'

const TABS = [
  { path: '/admin/plants', label: 'Plants' },
  { path: '/admin/orders', label: 'Orders' },
  { path: '/admin/messages', label: 'Messages' },
  { path: '/admin/users', label: 'Users' },
]

function AdminNav() {
  const { pathname } = useLocation()

  return (
    <div className="admin-nav">
      {TABS.map(tab => {
        const active = pathname === tab.path
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`admin-nav-tab ${
              active ? 'admin-nav-tab--active' : 'admin-nav-tab--inactive'
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
