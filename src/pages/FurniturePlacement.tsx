import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/useAppStore'
import { useClaudeCall } from '@/lib/useClaudeCall'
import FeaturePage from '@/components/FeaturePage'
import ImageUploader from '@/components/ImageUploader'

const roomTypes = ['living', 'bedroom', 'kitchen', 'dining', 'office', 'bathroom']

export default function FurniturePlacement() {
  const { t } = useTranslation()
  const { hasApiKey } = useAppStore()
  const { call } = useClaudeCall()

  const [roomWidth, setRoomWidth] = useState('5')
  const [roomLength, setRoomLength] = useState('4')
  const [ceilingHeight, setCeilingHeight] = useState('2.8')
  const [roomType, setRoomType] = useState('living')
  const [furnitureList, setFurnitureList] = useState('')
  const [doorsWindows, setDoorsWindows] = useState('')
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')

  const analyze = async () => {
    if (!hasApiKey) { setError(t('common.apiKeyRequired')); return }
    if (!furnitureList.trim()) { setError('Please list the furniture pieces'); return }
    setError('')
    try {
      const result = await call(
        'furniturePlacement',
        { roomWidth, roomLength, ceilingHeight, roomType, furnitureList, doorsWindows },
        imageBase64
      )
      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'

  return (
    <FeaturePage
      titleKey="nav.furniturePlacement"
      descKey="furniturePlacement.description"
      response={response}
      error={error}
      onSubmit={analyze}
      disabled={!furnitureList.trim()}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('furniturePlacement.roomType')}</label>
        <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className={inputCls}>
          {roomTypes.map((r) => (
            <option key={r} value={r}>{t(`wallColors.roomTypes.${r}`)}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('furniturePlacement.roomWidth')}</label>
          <input type="number" value={roomWidth} onChange={(e) => setRoomWidth(e.target.value)} className={inputCls} min="1" step="0.1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('furniturePlacement.roomLength')}</label>
          <input type="number" value={roomLength} onChange={(e) => setRoomLength(e.target.value)} className={inputCls} min="1" step="0.1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('furniturePlacement.ceilingHeight')}</label>
          <input type="number" value={ceilingHeight} onChange={(e) => setCeilingHeight(e.target.value)} className={inputCls} min="2" step="0.1" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('furniturePlacement.furnitureList')}</label>
        <textarea
          value={furnitureList}
          onChange={(e) => setFurnitureList(e.target.value)}
          placeholder={t('furniturePlacement.furnitureListPlaceholder')}
          rows={3}
          className={`${inputCls} resize-none`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('furniturePlacement.doorsWindows')}{' '}
          <span className="text-gray-400 font-normal">({t('common.optional')})</span>
        </label>
        <textarea
          value={doorsWindows}
          onChange={(e) => setDoorsWindows(e.target.value)}
          placeholder={t('furniturePlacement.doorsWindowsPlaceholder')}
          rows={2}
          className={`${inputCls} resize-none`}
        />
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
