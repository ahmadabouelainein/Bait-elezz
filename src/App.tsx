import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/useAppStore'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import WallColors from '@/pages/WallColors'
import FurniturePlacement from '@/pages/FurniturePlacement'
import CurtainColor from '@/pages/CurtainColor'
import FurnitureDimensions from '@/pages/FurnitureDimensions'
import WoodPlanks from '@/pages/WoodPlanks'
import UpholsteryFabric from '@/pages/UpholsteryFabric'
import CarpetSelection from '@/pages/CarpetSelection'
import Runners from '@/pages/Runners'
import Tableaux from '@/pages/Tableaux'
import Settings from '@/pages/Settings'

export default function App() {
  const { i18n } = useTranslation()
  const { language } = useAppStore()

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  useEffect(() => {
    const isAr = i18n.language === 'ar'
    document.documentElement.dir = isAr ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="wall-colors" element={<WallColors />} />
          <Route path="furniture-placement" element={<FurniturePlacement />} />
          <Route path="curtain-color" element={<CurtainColor />} />
          <Route path="furniture-dimensions" element={<FurnitureDimensions />} />
          <Route path="wood-planks" element={<WoodPlanks />} />
          <Route path="upholstery-fabric" element={<UpholsteryFabric />} />
          <Route path="carpet-selection" element={<CarpetSelection />} />
          <Route path="runners" element={<Runners />} />
          <Route path="tableaux" element={<Tableaux />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
