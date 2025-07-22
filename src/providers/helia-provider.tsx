/* eslint-disable no-console */

import { mfs as _mfs, type MFS } from '@helia/mfs'
import { unixfs as _unixfs, type UnixFS } from '@helia/unixfs'
import { inspectorMetrics } from '@ipshipyard/libp2p-inspector-metrics'
import { type Connection } from '@libp2p/interface'
import { IDBBlockstore } from 'blockstore-idb'
import { IDBDatastore } from 'datastore-idb'
import { createHelia, type HeliaLibp2p } from 'helia'
import React, {
  useEffect,
  useState,
  useCallback,
  createContext
} from 'react'
import { useInterval } from '../hooks/use-interval.js'
import type { Multiaddr } from '@multiformats/multiaddr'
import type { Blockstore } from 'interface-blockstore'
import type { Datastore } from 'interface-datastore'

export interface HeliaNodeInfo {
  peerId?: string
  multiaddrs: Multiaddr[]
  connections?: Connection[]
}

export type HeliaContextType = {
  helia: null
  unixfs: null
  mfs: null
  error: null
  starting: true
  nodeInfo?: HeliaNodeInfo
} | {
  helia: HeliaLibp2p
  unixfs: UnixFS
  mfs: MFS
  error: null | Error
  starting: false
  nodeInfo: HeliaNodeInfo
}

export const HeliaContext = createContext<HeliaContextType>({
  helia: null,
  unixfs: null,
  mfs: null,
  error: null,
  starting: true
})

export const HeliaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [helia, setHelia] = useState<HeliaLibp2p | null>(null)
  const [unixfs, setUnixfs] = useState<UnixFS | null>(null)
  const [mfs, setMfs] = useState<MFS | null>(null)
  const [starting, setStarting] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [nodeInfo, setNodeInfo] = useState<HeliaNodeInfo>()
  const [datastore, setDatastore] = useState<null | Datastore>(null)
  const [blockstore, setBlockstore] = useState<null | Blockstore>(null)

  useEffect(() => {
    if (datastore == null) {
      void (async () => {
        const db = new IDBDatastore('helia-datastore')
        await db.open()
        setDatastore(db)
      })()
    }
  }, [datastore])

  useEffect(() => {
    if (blockstore == null) {
      void (async () => {
        const db = new IDBBlockstore('helia-blockstore')
        await db.open()
        setBlockstore(db)
      })()
    }
  }, [blockstore])

  useEffect(() => {
    if (datastore == null || blockstore == null) return
    if (helia == null) {
      void (async () => {
        try {
          console.info('Starting Helia')
          const helia = await createHelia({
            datastore,
            blockstore,
            libp2p: {
              metrics: inspectorMetrics()
            }
          }) as HeliaLibp2p
          setHelia(helia)
          setUnixfs(_unixfs(helia))
          setMfs(_mfs(helia))
          setStarting(false)
          setNodeInfo({
            peerId: helia.libp2p.peerId.toString(),
            multiaddrs: helia.libp2p.getMultiaddrs(),
            connections: helia.libp2p.getConnections()
          })
        } catch (e: any) {
          console.error(e)
          setError(e)
        }
      })()
    }
  }, [datastore, blockstore, helia])

  const updateNodeInfo = useCallback(() => {
    if (helia == null) return
    setNodeInfo({
      ...nodeInfo,
      multiaddrs: helia.libp2p.getMultiaddrs(),
      connections: helia.libp2p.getConnections()
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
