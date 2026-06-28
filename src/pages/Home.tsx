import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  Paintbrush, Sofa, Wind, Ruler, TreePine,
  Layers, Grid2X2, MoveHorizontal, Image,
} from 'lucide-react'

const features = [
  { to: '/wall-colors', key: 'wallColors', icon: Paintbrush, color: 'bg-rose-50 text-rose-500' },
  { to: '/furniture-placement', key: 'furniturePlacement', icon: Sofa, color: 'bg-blue-50 text-blue-500' },
  { to: '/curtain-color', key: 'curtainColor', icon: Wind, color: 'bg-purple-50 text-purple-500' },
  { to: '/furniture-dimensions', key: 'furnitureDimensions', icon: Ruler, color: 'bg-green-50 text-green-500' },
  { to: '/wood-planks', key: 'woodPlanks', icon: TreePine, color: 'bg-amber-50 text-amber-600' },
  { to: '/upholstery-fabric', key: 'upholsteryFabric', icon: Layers, color: 'bg-teal-50 text-teal-500' },
  { to: '/carpet-selection', key: 'carpetSelection', icon: Grid2X2, color: 'bg-indigo-50 text-indigo-500' },
  { to: '/runners', key: 'runners', icon: MoveHorizontal, color: 'bg-orange-50 text-orange-500' },
  { to: '/tableaux', key: 'tableaux', icon: Image, color: 'bg-pink-50 text-pink-500' },
]

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <div className="text-center pt-4">
        <div className="text-5xl mb-4">🏡</div>
        <h1 className="text-3xl font-bold text-gray-900">{t('home.welcome')}</h1>
        <p className="text-gray-500 mt-3 text-base leading-relaxed max-w-xl mx-auto">
          {t('home.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map(({ to, key, icon: Icon, color }) => (
          <Link
            key={to}
            to={to}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md
                       hover:border-primary-200 transition-all group"
          >
            <div className={`inline-flex p-2.5 rounded-lg ${color} mb-3`}>
              <Icon size={20} />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm group-hover:text-primary-700 transition-colors">
              {t(`nav.${key}`)}
            </h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              {t(`${key}.description`)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
