const QUICK_EMOJIS = ['👍','❤️','😂','😮','😢','🔥','🎉','👀']

interface ReactionPickerProps {
  onSelect: (emoji: string) => void
  onClose: () => void
}

export function ReactionPicker({ onSelect, onClose }: ReactionPickerProps) {
  return (
    <div className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2 shadow-lg flex gap-1">
      {QUICK_EMOJIS.map(e => (
        <button key={e} onClick={() => { onSelect(e); onClose() }}
          className="text-xl hover:scale-125 transition-transform p-0.5">
          {e}
        </button>
      ))}
    </div>
  )
}
