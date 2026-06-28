import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/useAppStore'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const { language, setLanguage } = useAppStore()

  const toggle = () => {
    const next = language === 'ar' ? 'en' : 'ar'
    setLanguage(next)
    i18n.changeLanguage(next)
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800
                 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors w-full"
    >
      <span className="text-base">{language === 'ar' ? '🇬🇧' : '🇸🇦'}</span>
      <span>{language === 'ar' ? 'English' : 'عربي'}</span>
    </button>
  )
}
