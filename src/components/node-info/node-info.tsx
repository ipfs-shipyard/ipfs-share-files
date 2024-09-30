import { Circuit } from '@multiformats/multiaddr-matcher'
import React, { useMemo } from 'react'
import { useHelia } from '../../hooks/useHelia'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NodeInfoProps {

}

export const NodeInfo: React.FC<NodeInfoProps> = () => {
  const { nodeInfo } = useHelia()

  const hasCircuitRelayAddr = useMemo(() => {
    if (nodeInfo?.multiaddrs == null) {
      return false
    }
    return nodeInfo.multiaddrs.some((addr) => Circuit.matches(addr))
  }, [nodeInfo])

  if (nodeInfo == null) {
    return null
  }

  return (
    <div className='NodeInfo gray-muted'>
      <div className='NodeInfo-peerId'>
        <span>Peer ID:</span>
        <span>{nodeInfo.peerId}</span>
      </div>
      <div className='NodeInfo-multiaddrs'>
        <span>Multiaddrs:</span>
        <p>circuitRelayAddrs: {hasCircuitRelayAddr ? 'true' : 'false'}</p>
        {/* <ul>
          {multiaddrs.map((addr, i) => (
            <li key={i}>{addr}</li>
          ))}
        </ul> */}
      </div>
    </div>
  )
}

export default NodeInfo
