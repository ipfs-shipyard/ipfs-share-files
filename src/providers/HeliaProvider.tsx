/* eslint-disable no-console */

import { mfs as _mfs, type MFS } from '@helia/mfs'
import { unixfs as _unixfs, type UnixFS } from '@helia/unixfs'
import { devToolsMetrics } from '@libp2p/devtools-metrics'
import { createHelia, type HeliaLibp2p } from 'helia'
import React, {
  useEffect,
  useState,
  useCallback,
  createContext
} from 'react'

export type HeliaContextType = {
  helia: null
  unixfs: null
  mfs: null
  error: boolean
  starting: true
} | {
  helia: HeliaLibp2p
  unixfs: UnixFS
  mfs: MFS
  error: boolean
  starting: false
}

export const HeliaContext = createContext<HeliaContextType>({
  helia: null,
  unixfs: null,
  mfs: null,
  error: false,
  starting: true
})

export const HeliaProvider = ({ children }): React.JSX.Element => {
  const [helia, setHelia] = useState<HeliaLibp2p | null>(null)
  const [unixfs, setUnixfs] = useState<UnixFS | null>(null)
  const [mfs, setMfs] = useState<MFS | null>(null)
  const [starting, setStarting] = useState(true)
  const [error, setError] = useState(false)

  const startHelia = useCallback(async () => {
    if (helia == null) {
      try {
        console.info('Starting Helia')
        const helia = await createHelia({
          libp2p: {
            metrics: devToolsMetrics()
          }
        }) as HeliaLibp2p
        setHelia(helia)
        setUnixfs(_unixfs(helia))
        setMfs(_mfs(helia))
        setStarting(false)
      } catch (e) {
        console.error(e)
        setError(true)
      }
    }
  }, [])

  useEffect(() => {
    void startHelia()
  }, [])

  // @ts-expect-error - TODO: helia might still be null?
  const value: HeliaContextType = {
    helia,
    unixfs,
    mfs,
    error,
    starting
  }

  return (
    <HeliaContext.Provider value={value}>
      {children}
    </HeliaContext.Provider>
  )
}
