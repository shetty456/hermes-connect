interface Props {
  variant: 'success' | 'error'
  message: string
}

export function StatusMessage({ variant, message }: Props) {
  const classes =
    variant === 'success'
      ? 'bg-green-50 text-green-800 border border-green-200'
      : 'bg-red-50 text-red-800 border border-red-200'

  return <div className={`rounded p-2 text-xs ${classes}`}>{message}</div>
}
