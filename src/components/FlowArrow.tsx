import { ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight } from 'lucide-react'
import { usePreferences } from '../preferences/context'
export function FlowArrow({
  size = 18,
  back = false,
  diagonal = false,
}: {
  size?: number
  back?: boolean
  diagonal?: boolean
}) {
  const { language } = usePreferences()
  const pointsLeft = (language === 'ar') !== back
  const Icon = diagonal
    ? pointsLeft
      ? ArrowUpLeft
      : ArrowUpRight
    : pointsLeft
      ? ArrowLeft
      : ArrowRight
  return <Icon size={size} className="flow-arrow" aria-hidden="true" />
}
