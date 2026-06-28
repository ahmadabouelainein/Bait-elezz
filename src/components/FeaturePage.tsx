import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/useAppStore'
import AIResponseCard from './AIResponseCard'

interface Props {
  titleKey: string
  descKey: string
  children: ReactNode
  response: string
  error: string
  onSubmit: () => void
  disabled?: boolean
}

export default function FeaturePage({
  titleKey,
  descKey,
  children,
  response,
  error,
  onSubmit,
  disabled,
}: Props) {
  const { t } = useTranslation()
  const { isLoading } = useAppStore()

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t(titleKey)}</h1>
        <p className="text-sm text-gray-500 mt-1">{t(descKey)}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
        {children}

        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          onClick={onSubmit}
          disabled={isLoading || disabled}
          className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50
                     disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl
                     transition-colors text-sm"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              {t('common.loading')}
            </span>
          ) : (
            t('common.analyze')
          )}
        </button>
      </div>

      {response && <AIResponseCard content={response} />}
    </div>
  )
}
