import { usePreferences } from '../preferences/context'
import { translate } from './messages'
export function useCopy() {
  return translate(usePreferences().language)
}
