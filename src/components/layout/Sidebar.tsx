import {
  ClipboardList,
  FileText,
  Home,
  Store,
  Users,
  Wallet,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

import nbrGovernmentLogo from '@/assets/nbr-government-logo.png'

const navigation = [
  { label: 'Dashboard', path: '/', icon: Home, end: true },
  { label: 'Retailers', path: '/retailers', icon: Store },
  { label: 'Collect TCS', path: '/collect-tcs', icon: Wallet },
  { label: 'Collections', path: '/collections', icon: ClipboardList },
  { label: 'Challan History', path: '/challan', icon: FileText },
  { label: 'RSO Management', path: '/rso', icon: Users },
]

function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex h-20 items-center px-5">
        <img
          src={nbrGovernmentLogo}
          alt="Government of Bangladesh"
          className="size-60 shrink-0 object-contain"
        />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-muted">
          Main Menu
        </p>

        {navigation.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-control px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-muted hover:bg-background hover:text-foreground'
              }`
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-xl bg-background p-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
            AO
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              Admin Officer
            </p>
            <p className="text-xs text-muted">NBR · TCS Division</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
