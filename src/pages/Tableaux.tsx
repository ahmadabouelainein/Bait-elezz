import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/useAppStore'
import { useClaudeCall } from '@/lib/useClaudeCall'
import FeaturePage from '@/components/FeaturePage'
import ImageUploader from '@/components/ImageUploader'
import ColorSwatch from '@/components/ColorSwatch'

const styles = ['modern', 'classic', 'arabic', 'minimalist', 'eclectic']

export default function Tableaux() {
  const { t } = useTranslation()
  const { hasApiKey } = useAppStore()
  const { call } = useClaudeCall()

  const [wallColor, setWallColor] = useState('#e8e0d5')
  const [style, setStyle] = useState('modern')
  const [wallSize, setWallSize] = useState('')
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')

  const analyze = async () => {
    if (!hasApiKey) { setError(t('common.apiKeyRequired')); return }
    if (!wallSize) { setError('Please enter the wall width'); return }
    setError('')
    try {
      const result = await call('tableaux', {
        wallColor,
        style: t(`tableaux.styles.${style}`),
        wallSize,
      }, imageBase64)
      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'

  return (
    <FeaturePage
      titleKey="nav.tableaux"
      descKey="tableaux.description"
      response={response}
      error={error}
      onSubmit={analyze}
      disabled={!wallSize}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('tableaux.wallColor')}</label>
        <div className="flex items-center gap-3">
          <input type="color" value={wallColor} onChange={(e) => setWallColor(e.target.value)} className="h-10 w-16 rounded-lg cursor-pointer border border-gray-200" />
          <input type="text" value={wallColor} onChange={(e) => setWallColor(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500" />
          <ColorSwatch hex={wallColor} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('tableaux.style')}</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {styles.map((s) => (
            <label key={s} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm
              ${style === s ? 'border-primary-300 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input type="radio" name="style" value={s} checked={style === s} onChange={() => setStyle(s)} className="accent-primary-500" />
              {t(`tableaux.styles.${s}`)}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('tableaux.wallSize')}</label>
        <input type="number" value={wallSize} onChange={(e) => setWallSize(e.target.value)} className={inputCls} placeholder="e.g. 3.5" min="1" step="0.1" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('common.uploadImage')}{' '}
          <span className="text-gray-400 font-normal">({t('common.recommended')})</span>
        </label>
        <ImageUploader onImageChange={setImageBase64} />
      </div>
    </FeaturePage>
  )
}
