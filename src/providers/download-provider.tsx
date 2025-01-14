/**
 * A download provider that stores the cid and filename from the URL for distributing to other components
 */
import { multiaddr, type Multiaddr } from '@multiformats/multiaddr'
import React, { createContext, useContext, useState, type ReactNode } from 'react'
import { useFilesDispatch } from '../hooks/use-files.js'

// Define the shape of the context state
interface DownloadContextState {
  cid: string | null
  filename: string | null
  maddrs: Multiaddr[] | null
  setDownloadInfo(cid: string, filename: string | null, maddr: string | null): void
}

export const DownloadContext = createContext<DownloadContextState>({
  cid: null,
  filename: null,
  maddrs: null,
  setDownloadInfo: () => {}
})

/**
 * Must be used inside FilesProvider and HeliaProvider
 */
export const DownloadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cid, setCid] = useState<string | null>(null)
  const [filename, setFilename] = useState<string | null>(null)
  const [maddrs, setMaddrs] = useState<Multiaddr[] | null>(null)
  const dispatch = useFilesDispatch()

  const setDownloadInfo = (newCid: string, newFilename: string | null, newMaddrs: string | null): void => {
    dispatch({ type: 'reset_files' })
    setCid(newCid)
    const filename = decodeURIComponent(newFilename ?? '')
    // Decode the provider's maddrs from the URL
    const maddrs = newMaddrs != null ? decodeURIComponent(newMaddrs).split(',') : []
    const multiaddrs = maddrs.map(maddr => multiaddr(maddr))

    setMaddrs(multiaddrs)
    setFilename(filename)
  }

  return (
    <DownloadContext.Provider value={{ cid, filename, maddrs, setDownloadInfo }}>
      {children}
    </DownloadContext.Provider>
  )
}

export const useDownloadInfo = (): DownloadContextState => {
  return useContext(DownloadContext)
}
