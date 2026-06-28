import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { Copy, Check } from 'lucide-react'

interface Props {
  content: string
}

export default function AIResponseCard({ content }: Props) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {t('common.aiResponse')}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors"
        >
          {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
          {copied ? t('common.copied') : t('common.copy')}
        </button>
      </div>
      <div
        className="p-5 prose prose-sm max-w-none
                   prose-headings:font-semibold prose-headings:text-gray-800
                   prose-li:my-0.5 prose-p:leading-relaxed prose-strong:text-gray-800"
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  )
}
