import { type Connection } from '@libp2p/interface'
import { type Multiaddr } from '@multiformats/multiaddr'
import { Circuit, WebRTC, WebRTCDirect, WebSockets, WebSocketsSecure, WebTransport } from '@multiformats/multiaddr-matcher'
import React, { useMemo } from 'react'
import { useHelia } from '../../hooks/use-helia.js'
import { NodeInfoDetail } from './node-info-detail.jsx'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NodeInfoProps {

}

export const NodeInfo: React.FC<NodeInfoProps> = () => {
  const { nodeInfo } = useHelia()
  const { peerId, multiaddrs, connections } = nodeInfo ?? {}

  const { listeningAddrs, circuitRelayAddrs, webRtc, webRtcDirect, webTransport, webSockets, webSocketsSecure } = useMemo(() => {
    const base = {
      listeningAddrs: 0,
      circuitRelayAddrs: 0,
      webRtc: 0,
      webRtcDirect: 0,
      webTransport: 0,
      webSockets: 0,
      webSocketsSecure: 0
    }

    if (multiaddrs == null) {
      return base
    }
    return multiaddrs.reduce(
      (acc: typeof base, addr: Multiaddr) => {
        if (Circuit.exactMatch(addr)) {
          acc.circuitRelayAddrs++
        } else if (WebRTC.exactMatch(addr)) {
          acc.webRtc++
        } else if (WebRTCDirect.exactMatch(addr)) {
          acc.webRtcDirect++
        } else if (WebTransport.exactMatch(addr)) {
          acc.webTransport++
        } else if (WebSockets.exactMatch(addr)) {
          acc.webSockets++
        } else if (WebSocketsSecure.exactMatch(addr)) {
          acc.webSocketsSecure++
        } else {
          // eslint-disable-next-line no-console
          console.log('unrecognized listen addr', addr.toString())
        }
        acc.listeningAddrs++
        return acc
      },
      base
    )
  }, [multiaddrs])

  const { totalConns, inboundConns, outboundConns, unlimitedConns } = useMemo(() => {
    const base = { totalConns: 0, inboundConns: 0, outboundConns: 0, unlimitedConns: 0 }
    if (connections == null) {
      return base
    }

    return connections?.reduce(
      (acc: typeof base, conn: Connection) => {
        if (conn.direction === 'inbound') {
          acc.inboundConns++
        } else if (conn.direction === 'outbound') {
          acc.outboundConns++
        }
        if (conn.limits == null) {
          acc.unlimitedConns++
        }
        acc.totalConns++
        return acc
      },
      base
    )
  }, [connections])

  if (peerId == null) {
    return null
  }

  return (
    <div className='ml2 pb2 f5 gray-muted montserrat mw7'>
      <NodeInfoDetail label='Peer ID' value={peerId} />
      <NodeInfoDetail label='ListeningAddrs' value={`${listeningAddrs} (relayed: ${circuitRelayAddrs}, webRtc: ${webRtc}, webRtcDirect: ${webRtcDirect}, webTransport: ${webTransport}, ws: ${webSockets}, wss: ${webSocketsSecure})`} />
      <NodeInfoDetail label='Connections' value={`${totalConns} (${inboundConns} in, ${outboundConns} out, ${unlimitedConns} unlimited)`} />
    </div>
  )
}

export default NodeInfo
