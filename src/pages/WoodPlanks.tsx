import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/useAppStore'
import { useClaudeCall } from '@/lib/useClaudeCall'
import FeaturePage from '@/components/FeaturePage'

export default function WoodPlanks() {
  const { t } = useTranslation()
  const { hasApiKey } = useAppStore()
  const { call } = useClaudeCall()

  const [totalArea, setTotalArea] = useState('')
  const [colorDistribution, setColorDistribution] = useState('')
  const [plankWidth, setPlankWidth] = useState('12')
  const [plankLength, setPlankLength] = useState('120')
  const [woodDensity, setWoodDensity] = useState('')
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')

  const analyze = async () => {
    if (!hasApiKey) { setError(t('common.apiKeyRequired')); return }
    if (!totalArea || !colorDistribution) { setError('Please fill in all required fields'); return }
    setError('')
    try {
      const result = await call('woodPlanks', { totalArea, colorDistribution, plankWidth, plankLength, woodDensity: woodDensity || '700' })
      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'

  return (
    <FeaturePage
      titleKey="nav.woodPlanks"
      descKey="woodPlanks.description"
      response={response}
      error={error}
      onSubmit={analyze}
      disabled={!totalArea || !colorDistribution}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('woodPlanks.totalArea')}</label>
        <input type="number" value={totalArea} onChange={(e) => setTotalArea(e.target.value)} className={inputCls} placeholder="e.g. 25" min="1" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('woodPlanks.colorDistribution')}</label>
        <textarea
          value={colorDistribution}
          onChange={(e) => setColorDistribution(e.target.value)}
          placeholder={t('woodPlanks.colorDistributionPlaceholder')}
          rows={3}
          className={`${inputCls} resize-none`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('woodPlanks.plankWidth')}</label>
          <input type="number" value={plankWidth} onChange={(e) => setPlankWidth(e.target.value)} className={inputCls} min="5" placeholder="12" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('woodPlanks.plankLength')}</label>
          <input type="number" value={plankLength} onChange={(e) => setPlankLength(e.target.value)} className={inputCls} min="30" placeholder="120" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('woodPlanks.woodDensity')}{' '}
          <span className="text-gray-400 font-normal">({t('common.optional')})</span>
        </label>
        <input type="number" value={woodDensity} onChange={(e) => setWoodDensity(e.target.value)} className={inputCls} placeholder="700" min="300" max="1200" />
      </div>
    </FeaturePage>
  )
}
