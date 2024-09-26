/**
 * A download provider that stores the cid and filename from the URL for distributing to other components
 */
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

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

  // const dispatch = useFilesDispatch()
  // const { fetch } = useFiles()
  // const heliaState = useHelia()
  // const doAddFiles = useAddFiles(dispatch, heliaState)

  // when we have a CID, we want to trigger a fetch_start event
  useEffect(() => {
    if (cid == null) return
    console.info('fetch_start', cid)
  }, [cid])

  const setDownloadInfo = (newCid: string, newFilename: string | null): void => {
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
