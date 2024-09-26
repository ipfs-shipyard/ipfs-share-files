import { cid } from 'is-ipfs'
import { useEffect } from 'react'
import { useHashLocation } from 'wouter/use-hash-location'
import { useDownloadInfo } from '../providers/download-provider'

/**
 * * `(?<=\/)` — Positive lookbehind to ensure that the match is preceded by / without including it in the result.
 * * `[^\/?]+` — Matches one or more characters that are not / or ?.
 * * `(?=\?|$)` — Positive lookahead to ensure that the match is followed by either a ? or the end of the string ($).
 */
const cidRegex = /(?<=\/)[^/?]+(?=\?|$)/

const filenameRegex = /(?<=filename=)[^&]+/

export type CurrentPage = 'add' | 'download'
export const useCurrentPage = (): CurrentPage => {
  const [location] = useHashLocation()
  const { setDownloadInfo } = useDownloadInfo()
  const maybeCid = location.match(cidRegex)?.[0] ?? null
  const filename = location.match(filenameRegex)?.[0] ?? null

  useEffect(() => {
    if (maybeCid == null) return
    setDownloadInfo(maybeCid, filename)
  }, [maybeCid, filename])

  if (location.startsWith('/add') || !cid(maybeCid ?? '')) {
    return 'add'
  }

  return 'download'
}
