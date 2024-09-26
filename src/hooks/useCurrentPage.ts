import { cid } from 'is-ipfs'
import { useHashLocation } from 'wouter/use-hash-location'

/**
 * * `(?<=\/)` — Positive lookbehind to ensure that the match is preceded by / without including it in the result.
 * * `[^\/?]+` — Matches one or more characters that are not / or ?.
 * * `(?=\?|$)` — Positive lookahead to ensure that the match is followed by either a ? or the end of the string ($).
 */
const cidRegex = /(?<=\/)[^/?]+(?=\?|$)/

export type CurrentPage = 'add' | 'download'
export const useCurrentPage = (): CurrentPage => {
  const [location] = useHashLocation()
  const maybeCid = location.match(cidRegex)?.[0] ?? ''
  if (location.startsWith('/add') || !cid(maybeCid)) return 'add'
  return 'download'
}
