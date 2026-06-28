import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/useAppStore'
import { useClaudeCall } from '@/lib/useClaudeCall'
import FeaturePage from '@/components/FeaturePage'
import ImageUploader from '@/components/ImageUploader'

const roomTypes = ['living', 'bedroom', 'kitchen', 'dining', 'office', 'bathroom']

export default function CarpetSelection() {
  const { t } = useTranslation()
  const { hasApiKey } = useAppStore()
  const { call } = useClaudeCall()

  const [roomType, setRoomType] = useState('living')
  const [area, setArea] = useState('')
  const [occupants, setOccupants] = useState('3')
  const [hasKidsOrPets, setHasKidsOrPets] = useState('no')
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')

  const analyze = async () => {
    if (!hasApiKey) { setError(t('common.apiKeyRequired')); return }
    if (!area) { setError('Please enter the room area'); return }
    setError('')
    try {
      const result = await call('carpetSelection', { roomType: t(`wallColors.roomTypes.${roomType}`), area, occupants, hasKidsOrPets }, imageBase64)
      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'

  return (
    <FeaturePage
      titleKey="nav.carpetSelection"
      descKey="carpetSelection.description"
      response={response}
      error={error}
      onSubmit={analyze}
      disabled={!area}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('carpetSelection.roomType')}</label>
        <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className={inputCls}>
          {roomTypes.map((r) => <option key={r} value={r}>{t(`wallColors.roomTypes.${r}`)}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('carpetSelection.area')}</label>
          <input type="number" value={area} onChange={(e) => setArea(e.target.value)} className={inputCls} placeholder="e.g. 20" min="1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('carpetSelection.occupants')}</label>
          <input type="number" value={occupants} onChange={(e) => setOccupants(e.target.value)} className={inputCls} min="1" max="20" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">{t('carpetSelection.hasKidsOrPets')}</label>
        <div className="flex gap-3">
          {['yes', 'no'].map((val) => (
            <label key={val} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors
              ${hasKidsOrPets === val ? 'border-primary-300 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input type="radio" name="kidsOrPets" value={val} checked={hasKidsOrPets === val} onChange={() => setHasKidsOrPets(val)} className="accent-primary-500" />
              <span className="text-sm text-gray-700">{t(`common.${val}`)}</span>
            </label>
          ))}
        </div>
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
