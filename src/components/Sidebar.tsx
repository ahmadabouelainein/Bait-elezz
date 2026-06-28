import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import {
  Home,
  Paintbrush,
  Sofa,
  Wind,
  Ruler,
  TreePine,
  Layers,
  Grid2X2,
  MoveHorizontal,
  Image,
  Settings,
  Building2,
} from 'lucide-react'

const navItems = [
  { to: '/', key: 'home', icon: Home },
  { to: '/room', key: 'room', icon: Building2 },
  { to: '/wall-colors', key: 'wallColors', icon: Paintbrush },
  { to: '/furniture-placement', key: 'furniturePlacement', icon: Sofa },
  { to: '/curtain-color', key: 'curtainColor', icon: Wind },
  { to: '/furniture-dimensions', key: 'furnitureDimensions', icon: Ruler },
  { to: '/wood-planks', key: 'woodPlanks', icon: TreePine },
  { to: '/upholstery-fabric', key: 'upholsteryFabric', icon: Layers },
  { to: '/carpet-selection', key: 'carpetSelection', icon: Grid2X2 },
  { to: '/runners', key: 'runners', icon: MoveHorizontal },
  { to: '/tableaux', key: 'tableaux', icon: Image },
]

export default function Sidebar() {
  const { t } = useTranslation()

  return (
    <aside className="w-60 bg-white border-e border-gray-200 flex flex-col shrink-0 shadow-sm">
      <div className="px-4 py-5 border-b border-gray-100">
        <h1 className="text-lg font-bold text-primary-900">{t('app.title')}</h1>
        <p className="text-xs text-gray-400 mt-0.5">{t('app.subtitle')}</p>
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map(({ to, key, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
               ${
                 isActive
                   ? 'bg-primary-50 text-primary-700 font-semibold border-e-2 border-primary-500'
                   : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
               }`
            }
          >
            <Icon size={17} className="shrink-0" />
            {t(`nav.${key}`)}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-100 space-y-1">
        <LanguageSwitcher />
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg transition-colors w-full
             ${isActive ? 'text-primary-700 bg-primary-50' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`
          }
        >
          <Settings size={16} />
          {t('nav.settings')}
        </NavLink>
      </div>
    </aside>
  )
}
