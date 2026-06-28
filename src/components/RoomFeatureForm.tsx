import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { FeatureKey, RoomSection } from '@/types/room'
import ImageUploader from './ImageUploader'
import ColorSwatch from './ColorSwatch'

const cls =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'

interface Props {
  feature: FeatureKey
  section: RoomSection | undefined
  onChange: (key: string, value: unknown) => void
  onImageChange: (base64: string | null) => void
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-600">{label}</label>
      {children}
    </div>
  )
}

function Num({
  value,
  onChange,
  placeholder,
}: {
  value: unknown
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="number"
      value={(value as string) ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cls}
      min="0"
      step="0.1"
    />
  )
}

function ColorRow({
  value,
  onChange,
  defaultColor = '#ffffff',
}: {
  value: unknown
  onChange: (v: string) => void
  defaultColor?: string
}) {
  const hex = (value as string) || defaultColor
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={hex}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-14 rounded-lg cursor-pointer border border-gray-200"
      />
      <input
        type="text"
        value={hex}
        onChange={(e) => onChange(e.target.value)}
        className={`flex-1 ${cls} font-mono`}
      />
      <ColorSwatch hex={hex} />
    </div>
  )
}

const roomTypes = ['living', 'bedroom', 'kitchen', 'dining', 'office', 'bathroom']

export default function RoomFeatureForm({ feature, section, onChange, onImageChange }: Props) {
  const { t } = useTranslation()
  const inp = section?.inputs ?? {}
  const g = (k: string, d: unknown = '') => inp[k] ?? d

  switch (feature) {
    case 'wallColors':
      return (
        <div className="space-y-3">
          <Field label={t('wallColors.currentColor')}>
            <ColorRow value={g('currentColor', '#f5f0ea')} onChange={(v) => onChange('currentColor', v)} defaultColor="#f5f0ea" />
          </Field>
          <Field label={t('wallColors.roomType')}>
            <select value={(g('roomType') as string) || 'living'} onChange={(e) => onChange('roomType', e.target.value)} className={cls}>
              {roomTypes.map((r) => <option key={r} value={r}>{t(`wallColors.roomTypes.${r}`)}</option>)}
            </select>
          </Field>
          <Field label={`${t('common.uploadImage')} (${t('common.optional')})`}>
            <ImageUploader onImageChange={onImageChange} />
          </Field>
        </div>
      )

    case 'furniturePlacement':
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <Field label={t('furniturePlacement.roomWidth')}>
              <Num value={g('roomWidth')} onChange={(v) => onChange('roomWidth', v)} placeholder="5" />
            </Field>
            <Field label={t('furniturePlacement.roomLength')}>
              <Num value={g('roomLength')} onChange={(v) => onChange('roomLength', v)} placeholder="7" />
            </Field>
            <Field label={t('furniturePlacement.ceilingHeight')}>
              <Num value={g('ceilingHeight')} onChange={(v) => onChange('ceilingHeight', v)} placeholder="3" />
            </Field>
          </div>
          <Field label={t('furniturePlacement.roomType')}>
            <select value={(g('roomType') as string) || 'living'} onChange={(e) => onChange('roomType', e.target.value)} className={cls}>
              {roomTypes.map((r) => <option key={r} value={r}>{t(`wallColors.roomTypes.${r}`)}</option>)}
            </select>
          </Field>
          <Field label={t('furniturePlacement.furnitureList')}>
            <textarea value={(g('furnitureList') as string) || ''} onChange={(e) => onChange('furnitureList', e.target.value)} placeholder={t('furniturePlacement.furnitureListPlaceholder')} rows={2} className={cls} />
          </Field>
          <Field label={`${t('furniturePlacement.doorsWindows')} (${t('common.optional')})`}>
            <input type="text" value={(g('doorsWindows') as string) || ''} onChange={(e) => onChange('doorsWindows', e.target.value)} placeholder={t('furniturePlacement.doorsWindowsPlaceholder')} className={cls} />
          </Field>
          <Field label={`${t('common.uploadImage')} (${t('common.optional')})`}>
            <ImageUploader onImageChange={onImageChange} />
          </Field>
        </div>
      )

    case 'curtainColor':
      return (
        <div className="space-y-3">
          <Field label={t('curtainColor.wallColor')}>
            <ColorRow value={g('wallColor', '#ffffff')} onChange={(v) => onChange('wallColor', v)} />
          </Field>
          <Field label={t('curtainColor.mainFurnitureColor')}>
            <ColorRow value={g('mainFurnitureColor', '#8b6914')} onChange={(v) => onChange('mainFurnitureColor', v)} defaultColor="#8b6914" />
          </Field>
          <Field label={t('curtainColor.windowSize')}>
            <select value={(g('windowSize') as string) || 'medium'} onChange={(e) => onChange('windowSize', e.target.value)} className={cls}>
              {['small', 'medium', 'large', 'floor'].map((s) => <option key={s} value={s}>{t(`curtainColor.windowSizes.${s}`)}</option>)}
            </select>
          </Field>
          <Field label={`${t('common.uploadImage')} (${t('common.optional')})`}>
            <ImageUploader onImageChange={onImageChange} />
          </Field>
        </div>
      )

    case 'furnitureDimensions': {
      const pieceKeys = ['sofa', 'coffeeTable', 'tvUnit', 'diningTable', 'diningChairs', 'bed', 'wardrobe', 'dresser', 'desk', 'bookshelf']
      const storedPieces = ((g('furniturePieces') as string) || '').split(',').map((s) => s.trim()).filter(Boolean)
      const togglePiece = (key: string) => {
        const label = t(`furnitureDimensions.pieces.${key}`)
        const next = storedPieces.includes(label)
          ? storedPieces.filter((p) => p !== label)
          : [...storedPieces, label]
        onChange('furniturePieces', next.join(', '))
      }
      return (
        <div className="space-y-3">
          <Field label={t('furnitureDimensions.roomType')}>
            <select value={(g('roomType') as string) || 'living'} onChange={(e) => onChange('roomType', e.target.value)} className={cls}>
              {roomTypes.map((r) => <option key={r} value={r}>{t(`wallColors.roomTypes.${r}`)}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-3 gap-2">
            <Field label={t('furnitureDimensions.roomWidth')}>
              <Num value={g('roomWidth')} onChange={(v) => onChange('roomWidth', v)} placeholder="5" />
            </Field>
            <Field label={t('furnitureDimensions.roomLength')}>
              <Num value={g('roomLength')} onChange={(v) => onChange('roomLength', v)} placeholder="7" />
            </Field>
            <Field label={t('furnitureDimensions.ceilingHeight')}>
              <Num value={g('ceilingHeight')} onChange={(v) => onChange('ceilingHeight', v)} placeholder="3" />
            </Field>
          </div>
          <Field label={t('furnitureDimensions.furniturePieces')}>
            <div className="grid grid-cols-2 gap-1.5">
              {pieceKeys.map((key) => {
                const label = t(`furnitureDimensions.pieces.${key}`)
                const checked = storedPieces.includes(label)
                return (
                  <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${checked ? 'border-primary-300 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="checkbox" checked={checked} onChange={() => togglePiece(key)} className="accent-primary-500" />
                    <span className="text-xs text-gray-700">{label}</span>
                  </label>
                )
              })}
            </div>
          </Field>
        </div>
      )
    }

    case 'woodPlanks':
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Field label={t('woodPlanks.totalArea')}>
              <Num value={g('totalArea')} onChange={(v) => onChange('totalArea', v)} placeholder="30" />
            </Field>
            <Field label={t('woodPlanks.woodDensity')}>
              <Num value={g('woodDensity')} onChange={(v) => onChange('woodDensity', v)} placeholder="700" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label={t('woodPlanks.plankWidth')}>
              <Num value={g('plankWidth')} onChange={(v) => onChange('plankWidth', v)} placeholder="12" />
            </Field>
            <Field label={t('woodPlanks.plankLength')}>
              <Num value={g('plankLength')} onChange={(v) => onChange('plankLength', v)} placeholder="120" />
            </Field>
          </div>
          <Field label={t('woodPlanks.colorDistribution')}>
            <textarea value={(g('colorDistribution') as string) || ''} onChange={(e) => onChange('colorDistribution', e.target.value)} placeholder={t('woodPlanks.colorDistributionPlaceholder')} rows={2} className={cls} />
          </Field>
        </div>
      )

    case 'upholsteryFabric':
      return (
        <div className="space-y-3">
          <Field label={t('upholsteryFabric.furnitureType')}>
            <select value={(g('furnitureType') as string) || 'sofa'} onChange={(e) => onChange('furnitureType', e.target.value)} className={cls}>
              {['sofa', 'armchair', 'diningChairs', 'bedHeadboard', 'ottoman', 'other'].map((f) => (
                <option key={f} value={f}>{t(`upholsteryFabric.furnitureTypes.${f}`)}</option>
              ))}
            </select>
          </Field>
          <Field label={t('upholsteryFabric.usage')}>
            <select value={(g('usage') as string) || 'medium'} onChange={(e) => onChange('usage', e.target.value)} className={cls}>
              {['light', 'medium', 'heavy'].map((u) => (
                <option key={u} value={u}>{t(`upholsteryFabric.usageLevels.${u}`)}</option>
              ))}
            </select>
          </Field>
          <Field label={`${t('upholsteryFabric.currentColor')} (${t('common.optional')})`}>
            <input type="text" value={(g('currentColor') as string) || ''} onChange={(e) => onChange('currentColor', e.target.value)} placeholder="#c9a96e" className={`${cls} font-mono`} />
          </Field>
          <Field label={`${t('common.uploadImage')} (${t('common.recommended')})`}>
            <ImageUploader onImageChange={onImageChange} />
          </Field>
        </div>
      )

    case 'carpetSelection':
      return (
        <div className="space-y-3">
          <Field label={t('carpetSelection.roomType')}>
            <select value={(g('roomType') as string) || 'living'} onChange={(e) => onChange('roomType', e.target.value)} className={cls}>
              {roomTypes.map((r) => <option key={r} value={r}>{t(`wallColors.roomTypes.${r}`)}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label={t('carpetSelection.area')}>
              <Num value={g('area')} onChange={(v) => onChange('area', v)} placeholder="20" />
            </Field>
            <Field label={t('carpetSelection.occupants')}>
              <Num value={g('occupants')} onChange={(v) => onChange('occupants', v)} placeholder="4" />
            </Field>
          </div>
          <Field label={t('carpetSelection.hasKidsOrPets')}>
            <select value={(g('hasKidsOrPets') as string) || 'no'} onChange={(e) => onChange('hasKidsOrPets', e.target.value)} className={cls}>
              <option value="yes">{t('common.yes')}</option>
              <option value="no">{t('common.no')}</option>
            </select>
          </Field>
          <Field label={`${t('common.uploadImage')} (${t('common.optional')})`}>
            <ImageUploader onImageChange={onImageChange} />
          </Field>
        </div>
      )

    case 'runners':
      return (
        <div className="space-y-3">
          <Field label={t('runners.areaType')}>
            <select value={(g('areaType') as string) || 'hallway'} onChange={(e) => onChange('areaType', e.target.value)} className={cls}>
              {['hallway', 'entryway', 'kitchen', 'stairs', 'bedroom'].map((a) => (
                <option key={a} value={a}>{t(`runners.areaTypes.${a}`)}</option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label={t('runners.length')}>
              <Num value={g('length')} onChange={(v) => onChange('length', v)} placeholder="3" />
            </Field>
            <Field label={t('runners.width')}>
              <Num value={g('width')} onChange={(v) => onChange('width', v)} placeholder="1" />
            </Field>
          </div>
          <Field label={t('runners.decorStyle')}>
            <select value={(g('decorStyle') as string) || 'modern'} onChange={(e) => onChange('decorStyle', e.target.value)} className={cls}>
              {['modern', 'classic', 'arabic', 'scandinavian', 'bohemian'].map((s) => (
                <option key={s} value={s}>{t(`runners.decorStyles.${s}`)}</option>
              ))}
            </select>
          </Field>
          <Field label={`${t('common.uploadImage')} (${t('common.optional')})`}>
            <ImageUploader onImageChange={onImageChange} />
          </Field>
        </div>
      )

    case 'tableaux':
      return (
        <div className="space-y-3">
          <Field label={t('tableaux.wallColor')}>
            <ColorRow value={g('wallColor', '#ffffff')} onChange={(v) => onChange('wallColor', v)} />
          </Field>
          <Field label={t('tableaux.style')}>
            <select value={(g('style') as string) || 'modern'} onChange={(e) => onChange('style', e.target.value)} className={cls}>
              {['modern', 'classic', 'arabic', 'minimalist', 'eclectic'].map((s) => (
                <option key={s} value={s}>{t(`tableaux.styles.${s}`)}</option>
              ))}
            </select>
          </Field>
          <Field label={t('tableaux.wallSize')}>
            <Num value={g('wallSize')} onChange={(v) => onChange('wallSize', v)} placeholder="4" />
          </Field>
          <Field label={`${t('common.uploadImage')} (${t('common.recommended')})`}>
            <ImageUploader onImageChange={onImageChange} />
          </Field>
        </div>
      )

    default:
      return null
  }
}
