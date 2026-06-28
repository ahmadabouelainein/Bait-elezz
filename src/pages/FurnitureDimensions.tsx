import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/useAppStore'
import { useClaudeCall } from '@/lib/useClaudeCall'
import FeaturePage from '@/components/FeaturePage'

const roomTypes = ['living', 'bedroom', 'kitchen', 'dining', 'office', 'bathroom']
const pieceKeys = ['sofa', 'coffeeTable', 'tvUnit', 'diningTable', 'diningChairs', 'bed', 'wardrobe', 'dresser', 'desk', 'bookshelf']

export default function FurnitureDimensions() {
  const { t } = useTranslation()
  const { hasApiKey } = useAppStore()
  const { call } = useClaudeCall()

  const [roomType, setRoomType] = useState('living')
  const [roomWidth, setRoomWidth] = useState('5')
  const [roomLength, setRoomLength] = useState('4')
  const [ceilingHeight, setCeilingHeight] = useState('2.8')
  const [selected, setSelected] = useState<string[]>([])
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')

  const toggle = (key: string) =>
    setSelected((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])

  const analyze = async () => {
    if (!hasApiKey) { setError(t('common.apiKeyRequired')); return }
    if (selected.length === 0) { setError('Please select at least one furniture piece'); return }
    setError('')
    try {
      const pieces = selected.map((k) => t(`furnitureDimensions.pieces.${k}`)).join(', ')
      const result = await call('furnitureDimensions', { roomType, roomWidth, roomLength, ceilingHeight, furniturePieces: pieces })
      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'

  return (
    <FeaturePage
      titleKey="nav.furnitureDimensions"
      descKey="furnitureDimensions.description"
      response={response}
      error={error}
      onSubmit={analyze}
      disabled={selected.length === 0}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('furnitureDimensions.roomType')}</label>
        <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className={inputCls}>
          {roomTypes.map((r) => <option key={r} value={r}>{t(`wallColors.roomTypes.${r}`)}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          ['furnitureDimensions.roomWidth', roomWidth, setRoomWidth],
          ['furnitureDimensions.roomLength', roomLength, setRoomLength],
          ['furnitureDimensions.ceilingHeight', ceilingHeight, setCeilingHeight],
        ].map(([label, value, setter]) => (
          <div key={label as string}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t(label as string)}</label>
            <input type="number" value={value as string} onChange={(e) => (setter as (v: string) => void)(e.target.value)} className={inputCls} min="1" step="0.1" />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('furnitureDimensions.furniturePieces')}</label>
        <div className="grid grid-cols-2 gap-2">
          {pieceKeys.map((key) => (
            <label key={key} className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors
              ${selected.includes(key) ? 'border-primary-300 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input type="checkbox" checked={selected.includes(key)} onChange={() => toggle(key)} className="accent-primary-500" />
              <span className="text-sm text-gray-700">{t(`furnitureDimensions.pieces.${key}`)}</span>
            </label>
          ))}
        </div>
      </div>
    </FeaturePage>
  )
}
