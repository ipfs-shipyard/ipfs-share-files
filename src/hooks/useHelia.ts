import { useContext } from 'react'
import { HeliaContext } from '../providers/HeliaProvider'

export const useHelia = () => {
  return useContext(HeliaContext)
}
