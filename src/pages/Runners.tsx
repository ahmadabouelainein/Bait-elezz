import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/useAppStore'
import { useClaudeCall } from '@/lib/useClaudeCall'
import FeaturePage from '@/components/FeaturePage'
import ImageUploader from '@/components/ImageUploader'

const areaTypes = ['hallway', 'entryway', 'kitchen', 'stairs', 'bedroom']
const decorStyles = ['modern', 'classic', 'arabic', 'scandinavian', 'bohemian']

export default function Runners() {
  const { t } = useTranslation()
  const { hasApiKey } = useAppStore()
  const { call } = useClaudeCall()

  const [areaType, setAreaType] = useState('hallway')
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [decorStyle, setDecorStyle] = useState('modern')
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')

  const analyze = async () => {
    if (!hasApiKey) { setError(t('common.apiKeyRequired')); return }
    if (!length || !width) { setError('Please enter the area dimensions'); return }
    setError('')
    try {
      const result = await call('runners', {
        areaType: t(`runners.areaTypes.${areaType}`),
        length,
        width,
        decorStyle: t(`runners.decorStyles.${decorStyle}`),
      }, imageBase64)
      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'

  return (
    <FeaturePage
      titleKey="nav.runners"
      descKey="runners.description"
      response={response}
      error={error}
      onSubmit={analyze}
      disabled={!length || !width}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('runners.areaType')}</label>
        <select value={areaType} onChange={(e) => setAreaType(e.target.value)} className={inputCls}>
          {areaTypes.map((a) => <option key={a} value={a}>{t(`runners.areaTypes.${a}`)}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('runners.length')}</label>
          <input type="number" value={length} onChange={(e) => setLength(e.target.value)} className={inputCls} placeholder="e.g. 3" min="0.5" step="0.1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('runners.width')}</label>
          <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className={inputCls} placeholder="e.g. 0.8" min="0.3" step="0.05" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('runners.decorStyle')}</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {decorStyles.map((s) => (
            <label key={s} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors text-sm
              ${decorStyle === s ? 'border-primary-300 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input type="radio" name="decorStyle" value={s} checked={decorStyle === s} onChange={() => setDecorStyle(s)} className="accent-primary-500" />
              {t(`runners.decorStyles.${s}`)}
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
