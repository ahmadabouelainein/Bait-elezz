import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/useAppStore'
import { useClaudeCall } from '@/lib/useClaudeCall'
import FeaturePage from '@/components/FeaturePage'
import ImageUploader from '@/components/ImageUploader'
import ColorSwatch from '@/components/ColorSwatch'

const roomTypes = ['living', 'bedroom', 'kitchen', 'dining', 'office', 'bathroom']

export default function WallColors() {
  const { t } = useTranslation()
  const { hasApiKey } = useAppStore()
  const { call } = useClaudeCall()

  const [currentColor, setCurrentColor] = useState('#f5f0ea')
  const [roomType, setRoomType] = useState('living')
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')

  const analyze = async () => {
    if (!hasApiKey) { setError(t('common.apiKeyRequired')); return }
    setError('')
    try {
      const result = await call('wallColors', { currentColor, roomType }, imageBase64)
      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    }
  }

  return (
    <FeaturePage
      titleKey="nav.wallColors"
      descKey="wallColors.description"
      response={response}
      error={error}
      onSubmit={analyze}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('wallColors.currentColor')}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="h-10 w-16 rounded-lg cursor-pointer border border-gray-200"
          />
          <input
            type="text"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono
                       focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="#f5f0ea"
          />
          <ColorSwatch hex={currentColor} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('wallColors.roomType')}
        </label>
        <select
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {roomTypes.map((r) => (
            <option key={r} value={r}>{t(`wallColors.roomTypes.${r}`)}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('common.uploadImage')}{' '}
          <span className="text-gray-400 font-normal">({t('common.optional')})</span>
        </label>
        <ImageUploader onImageChange={setImageBase64} />
      </div>
    </FeaturePage>
  )
}
