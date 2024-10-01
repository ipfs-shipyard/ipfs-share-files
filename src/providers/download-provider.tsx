/**
 * A download provider that stores the cid and filename from the URL for distributing to other components
 */
import React, { createContext, useContext, useState, type ReactNode } from 'react'
import { useFilesDispatch } from '../hooks/useFiles'

// Define the shape of the context state
interface DownloadContextState {
  cid: string | null
  filename: string | null
  setDownloadInfo(cid: string, filename: string | null): void
}

export const DownloadContext = createContext<DownloadContextState>({
  cid: null,
  filename: null,
  setDownloadInfo: () => {}
})

/**
 * Must be used inside FilesProvider and HeliaProvider
 */
export const DownloadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cid, setCid] = useState<string | null>(null)
  const [filename, setFilename] = useState<string | null>(null)
  const dispatch = useFilesDispatch()

  const setDownloadInfo = (newCid: string, newFilename: string | null): void => {
    dispatch({ type: 'reset_files' })
    setCid(newCid)
    setFilename(newFilename)
  }

  console.log('DownloadProvider state:', { cid, filename })

  return (
    <DownloadContext.Provider value={{ cid, filename, setDownloadInfo }}>
      {children}
    </DownloadContext.Provider>
  )
}

export const useDownloadInfo = (): DownloadContextState => {
  return useContext(DownloadContext)
}
