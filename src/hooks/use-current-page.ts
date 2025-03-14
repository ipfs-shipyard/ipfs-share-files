import { multiaddr } from '@multiformats/multiaddr'
import { cid } from 'is-ipfs'
import { useEffect } from 'react'
import { useHashLocation } from 'wouter/use-hash-location'
import { useFilesDispatch } from './use-files'

/**
 * * `(?<=\/)` — Positive lookbehind to ensure that the match is preceded by / without including it in the result.
 * * `[^\/?]+` — Matches one or more characters that are not / or ?.
 * * `(?=\?|$)` — Positive lookahead to ensure that the match is followed by either a ? or the end of the string ($).
 */
const cidRegex = /(?<=\/)[^/?]+(?=\?|$)/

const filenameRegex = /(?<=filename=)[^&]+/

const maddrsRegex = /(?<=maddrs=)[^&]+/

export type CurrentPage = 'add' | 'download'
export const useCurrentPage = (): CurrentPage => {
  const [location] = useHashLocation()
  const dispatch = useFilesDispatch()
  const maybeCid = location.match(cidRegex)?.[0] ?? null
  const filename = location.match(filenameRegex)?.[0] ?? null
  const maddrs = location.match(maddrsRegex)?.[0] ?? null

  // Dispatch the fetch_start action if the URL contains a cid
  useEffect(() => {
    if (maybeCid == null) return
    dispatch({ type: 'reset_files' })
    const decodedFilename = decodeURIComponent(filename ?? '')
    // Decode the provider's maddrs from the URL
    const decodedMaddrs = maddrs != null ? decodeURIComponent(maddrs).split(',') : null
    const multiaddrs = decodedMaddrs != null ? decodedMaddrs.map(maddr => multiaddr(maddr)) : null

    dispatch({ type: 'fetch_start', cid: maybeCid, filename: decodedFilename, providerMaddrs: multiaddrs })
  }, [maybeCid, filename, maddrs])

  if (location.startsWith('/add') || !cid(maybeCid ?? '')) {
    return 'add'
  }

  return 'download'
}
