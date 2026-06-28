import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Paintbrush,
  Sofa,
  Wind,
  Ruler,
  TreePine,
  Layers,
  Grid2X2,
  MoveHorizontal,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Download,
  Plus,
  CheckCircle2,
  Building2,
} from 'lucide-react'
import { useRoomStore } from '@/store/useRoomStore'
import { useAppStore } from '@/store/useAppStore'
import { useClaudeCall } from '@/lib/useClaudeCall'
import type { FeatureKey } from '@/types/room'
import RoomFeatureForm from '@/components/RoomFeatureForm'
import AIResponseCard from '@/components/AIResponseCard'

type SectionDef = {
  key: FeatureKey
  icon: React.ComponentType<{ size?: number; className?: string }>
}

const SECTIONS: SectionDef[] = [
  { key: 'wallColors', icon: Paintbrush },
  { key: 'furniturePlacement', icon: Sofa },
  { key: 'curtainColor', icon: Wind },
  { key: 'furnitureDimensions', icon: Ruler },
  { key: 'woodPlanks', icon: TreePine },
  { key: 'upholsteryFabric', icon: Layers },
  { key: 'carpetSelection', icon: Grid2X2 },
  { key: 'runners', icon: MoveHorizontal },
  { key: 'tableaux', icon: ImageIcon },
]

export default function Room() {
  const { t } = useTranslation()
  const { project, createProject, updateSection, clearProject, setProjectName } = useRoomStore()
  const { hasApiKey } = useAppStore()
  const { call } = useClaudeCall()

  const [roomName, setRoomName] = useState('')
  const [expanded, setExpanded] = useState<FeatureKey | null>(null)
  const [loadingSection, setLoadingSection] = useState<FeatureKey | null>(null)
  const [errors, setErrors] = useState<Partial<Record<FeatureKey, string>>>({})
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')

  if (!project) {
    return (
      <div className="max-w-md mx-auto mt-16 space-y-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mx-auto">
            <Building2 size={28} className="text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t('room.title')}</h1>
          <p className="text-sm text-gray-500">{t('room.description')}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('room.projectName')}
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder={t('room.projectNamePlaceholder')}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && roomName.trim()) createProject(roomName.trim())
              }}
            />
          </div>
          <button
            onClick={() => { if (roomName.trim()) createProject(roomName.trim()) }}
            disabled={!roomName.trim()}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-40 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
          >
            {t('room.startProject')}
          </button>
        </div>
      </div>
    )
  }

  const analyzed = Object.values(project.sections).filter((s) => s?.response).length

  const handleExport = () => {
    const json = JSON.stringify(project, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.name.replace(/\s+/g, '-')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleNewRoom = () => {
    if (window.confirm(t('room.confirmNew'))) {
      clearProject()
    }
  }

  const handleAnalyze = async (key: FeatureKey) => {
    if (!hasApiKey) {
      setErrors((e) => ({ ...e, [key]: t('common.apiKeyRequired') }))
      return
    }
    const section = project.sections[key] ?? { inputs: {} }
    setLoadingSection(key)
    setErrors((e) => ({ ...e, [key]: '' }))
    try {
      const result = await call(key, section.inputs, section.imageBase64 ?? null)
      updateSection(key, { response: result })
    } catch (err) {
      setErrors((e) => ({
        ...e,
        [key]: err instanceof Error ? err.message : t('common.error'),
      }))
    } finally {
      setLoadingSection(null)
    }
  }

  const handleChange = (key: FeatureKey, field: string, value: unknown) => {
    const existing = project.sections[key]?.inputs ?? {}
    updateSection(key, { inputs: { ...existing, [field]: value } })
  }

  const handleImageChange = (key: FeatureKey, base64: string | null) => {
    updateSection(key, { imageBase64: base64 ?? undefined })
  }

  const saveName = () => {
    if (nameInput.trim()) setProjectName(nameInput.trim())
    setEditingName(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {editingName ? (
            <input
              autoFocus
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveName()
                if (e.key === 'Escape') setEditingName(false)
              }}
              className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-primary-400 outline-none w-full"
            />
          ) : (
            <h1
              className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-primary-700 transition-colors truncate"
              onClick={() => { setNameInput(project.name); setEditingName(true) }}
              title={t('room.clickToRename')}
            >
              {project.name}
            </h1>
          )}
          <p className="text-sm text-gray-400 mt-0.5">
            {t('room.analyzed', { count: analyzed, total: 9 })} · {t('room.autoSaved')}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-1.5 transition-colors"
          >
            <Download size={14} />
            {t('room.export')}
          </button>
          <button
            onClick={handleNewRoom}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-lg px-3 py-1.5 transition-colors"
          >
            <Plus size={14} />
            {t('room.newRoom')}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {SECTIONS.map(({ key, icon: Icon }) => {
          const section = project.sections[key]
          const isExpanded = expanded === key
          const isLoading = loadingSection === key
          const hasResponse = Boolean(section?.response)

          return (
            <div key={key} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-start hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : key)}
              >
                <div
                  className={`p-1.5 rounded-lg ${hasResponse ? 'bg-green-100' : 'bg-gray-100'}`}
                >
                  <Icon
                    size={16}
                    className={hasResponse ? 'text-green-600' : 'text-gray-500'}
                  />
                </div>
                <span className="flex-1 text-sm font-medium text-gray-800">
                  {t(`nav.${key}`)}
                </span>
                {hasResponse && (
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                )}
                {isExpanded ? (
                  <ChevronUp size={16} className="text-gray-400 shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-gray-400 shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 p-4 space-y-4">
                  <RoomFeatureForm
                    feature={key}
                    section={section}
                    onChange={(field, value) => handleChange(key, field, value)}
                    onImageChange={(base64) => handleImageChange(key, base64)}
                  />

                  {errors[key] && (
                    <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
                      {errors[key]}
                    </p>
                  )}

                  <button
                    onClick={() => handleAnalyze(key)}
                    disabled={isLoading}
                    className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-medium transition-colors"
                  >
                    {isLoading ? t('common.loading') : t('common.analyze')}
                  </button>

                  {hasResponse && <AIResponseCard content={section!.response!} />}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
