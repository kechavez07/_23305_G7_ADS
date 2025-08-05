import { IconFactory } from '../factory/IconFactory'

export type ModalIconType = 'info' | 'error' | 'danger' | 'question' | 'success'

interface ModalIconProps {
  icon: ModalIconType
}

export function ModalIcon({ icon }: ModalIconProps) {
  const baseClass = 'min-w-[28px] min-h-[28px]'
  const icons: Record<ModalIconType, React.ReactElement> = {
    info: <IconFactory name={icon} className={`${baseClass} text-gray-500`} />,
    error: <IconFactory name={icon} className={`${baseClass} text-red-500`} />,
    danger: (
      <IconFactory name={icon} className={`${baseClass} text-yellow-500`} />
    ),
    question: (
      <IconFactory name={icon} className={`${baseClass} text-blue-500`} />
    ),
    success: (
      <IconFactory name={icon} className={`${baseClass} text-green-500`} />
    ),
  }
  return icons[icon] ?? icons.info
}
