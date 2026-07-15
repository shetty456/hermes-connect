interface Props {
  onClick: () => void
  disabled: boolean
  loading: boolean
}

export function CaptureButton({ onClick, disabled, loading }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded
                 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors"
    >
      {loading ? 'Saving…' : 'Capture Contact'}
    </button>
  )
}
