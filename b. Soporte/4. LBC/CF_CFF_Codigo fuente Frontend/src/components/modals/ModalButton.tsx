import { useMemo } from 'react'

type ModalButtonStyle = 'primary' | 'secondary' | 'danger' | 'error' | 'success'

export interface ModalButtonProps {
  label: string
  style?: ModalButtonStyle
  disabled?: boolean
  onClick?: () => void | Promise<void>
}

export function ModalButton({
  label,
  style = 'primary',
  disabled = false,
  onClick,
}: ModalButtonProps) {
  const styleClassName = useMemo(() => {
    switch (style) {
      case 'secondary':
        return 'bg-blue-500 text-white'

      case 'danger':
        return 'bg-yellow-500 text-white'

      case 'error':
        return 'bg-red-500 text-white'

      case 'success':
        return 'bg-green-500 text-white'

      case 'primary':
      default:
        return 'bg-gray-500 text-white'
    }
  }, [style])

  return (
    <button
      onClick={onClick}
      className={`rounded-md p-2 min-w-[84px] ${styleClassName}`}
      type="button"
      disabled={disabled}
    >
      {label}
    </button>
  )
}
