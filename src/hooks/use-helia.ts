import { useContext } from 'react'
import { HeliaContext, type HeliaContextType } from '../providers/helia-provider'

export const useHelia = (): HeliaContextType => {
  return useContext(HeliaContext)
}
