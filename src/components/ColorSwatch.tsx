interface Props {
  hex: string
  label?: string
}

export default function ColorSwatch({ hex, label }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-lg border border-gray-200 shadow-sm shrink-0"
        style={{ backgroundColor: hex }}
        title={hex}
      />
      {label && <span className="text-xs text-gray-500 font-mono">{label || hex}</span>}
    </div>
  )
}
