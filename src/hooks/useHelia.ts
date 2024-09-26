import { useContext } from 'react'
import { HeliaContext, type HeliaContextType } from '../providers/HeliaProvider'

export const useHelia = (): HeliaContextType => {
  return useContext(HeliaContext)
}
