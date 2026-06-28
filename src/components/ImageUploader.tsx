import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, X } from 'lucide-react'

interface Props {
  onImageChange: (base64: string | null) => void
}

export default function ImageUploader({ onImageChange }: Props) {
  const { t } = useTranslation()
  const [preview, setPreview] = useState<string | null>(null)

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        const base64 = dataUrl.split(',')[1]
        setPreview(dataUrl)
        onImageChange(base64)
      }
      reader.readAsDataURL(file)
    },
    [onImageChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const clear = () => {
    setPreview(null)
    onImageChange(null)
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="relative border-2 border-dashed border-primary-300 rounded-xl p-4
                 text-center cursor-pointer hover:bg-primary-50 transition-colors min-h-[120px]
                 flex flex-col items-center justify-center"
    >
      {preview ? (
        <>
          <img
            src={preview}
            alt="preview"
            className="max-h-56 rounded-lg object-contain"
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              clear()
            }}
            className="absolute top-2 end-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X size={14} />
          </button>
        </>
      ) : (
        <>
          <Upload className="text-primary-400 mb-2" size={28} />
          <p className="text-sm text-gray-500">{t('common.uploadImage')}</p>
          <p className="text-xs text-gray-400 mt-1">{t('common.dragOrClick')}</p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) processFile(f)
            }}
          />
        </>
      )}
    </div>
  )
}
