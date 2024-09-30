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
import { useInterval } from '../hooks/useInterval'
import type { Multiaddr } from '@multiformats/multiaddr'

export interface HeliaNodeInfo {
  peerId?: string
  multiaddrs: Multiaddr[]
}

export type HeliaContextType = {
  helia: null
  unixfs: null
  mfs: null
  error: boolean
  starting: true
  nodeInfo?: HeliaNodeInfo
} | {
  helia: HeliaLibp2p
  unixfs: UnixFS
  mfs: MFS
  error: boolean
  starting: false
  nodeInfo: HeliaNodeInfo
}

export const HeliaContext = createContext<HeliaContextType>({
  helia: null,
  unixfs: null,
  mfs: null,
  error: false,
  starting: true
})

export const HeliaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [helia, setHelia] = useState<HeliaLibp2p | null>(null)
  const [unixfs, setUnixfs] = useState<UnixFS | null>(null)
  const [mfs, setMfs] = useState<MFS | null>(null)
  const [starting, setStarting] = useState(true)
  const [error, setError] = useState(false)
  // const [listeningAddrs, setListeningAddrs] = useState<string[]>([])
  const [nodeInfo, setNodeInfo] = useState<HeliaNodeInfo>()

  const startHelia = useCallback(async () => {
    if (helia == null) {
      try {
        console.info('Starting Helia')
        const helia = await createHelia({
          // datastore: new LevelDatastore('helia'),
          libp2p: {
            // @ts-expect-error - problem with helia/devToolsMetrics types.
            metrics: devToolsMetrics()
          }
        }) as HeliaLibp2p
        setHelia(helia)
        setUnixfs(_unixfs(helia))
        setMfs(_mfs(helia))
        setStarting(false)
        setNodeInfo({
          peerId: helia.libp2p.peerId.toString(),
          multiaddrs: helia.libp2p.getMultiaddrs()
        })
      } catch (e) {
        console.error(e)
        setError(true)
      }
    }
  }, [])

  useEffect(() => {
    void startHelia()
  }, [])

  const updateNodeInfo = useCallback(() => {
    if (helia == null) return
    setNodeInfo({
      ...nodeInfo,
      multiaddrs: helia.libp2p.getMultiaddrs()
    })
  }, [helia, nodeInfo])

  useInterval(updateNodeInfo, 5000)

  // output multiaddrs
  useEffect(() => {
    if (helia == null) return

    (globalThis as any).helia = helia

    helia.libp2p.addEventListener('self:peer:update', updateNodeInfo)
    return () => {
      helia.libp2p.removeEventListener('self:peer:update', updateNodeInfo)
    }
  }, [helia, updateNodeInfo])

  useEffect(() => {
    console.log('helia node info: ', nodeInfo)
  }, [nodeInfo, updateNodeInfo])

  // @ts-expect-error - TODO: helia might still be null?
  const value: HeliaContextType = {
    helia,
    unixfs,
    mfs,
    error,
    starting,
    nodeInfo
  }

  return (
    <HeliaContext.Provider value={value}>
      {children}
    </HeliaContext.Provider>
  )
}
