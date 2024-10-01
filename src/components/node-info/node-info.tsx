import { type Connection } from '@libp2p/interface'
import { type Multiaddr } from '@multiformats/multiaddr'
import { Circuit, WebRTC, WebRTCDirect, WebSockets, WebSocketsSecure, WebTransport } from '@multiformats/multiaddr-matcher'
import React, { useMemo } from 'react'
import { useHelia } from '../../hooks/useHelia'

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
        if (Circuit.matches(addr)) {
          acc.circuitRelayAddrs++
        } else if (WebRTC.matches(addr)) {
          acc.webRtc++
        } else if (WebRTCDirect.matches(addr)) {
          acc.webRtcDirect++
        } else if (WebTransport.matches(addr)) {
          acc.webTransport++
        } else if (WebSockets.matches(addr)) {
          acc.webSockets++
        } else if (WebSocketsSecure.matches(addr)) {
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

  const { inboundConns, outboundConns, unlimitedConns } = useMemo(() => {
    const base = { inboundConns: 0, outboundConns: 0, unlimitedConns: 0 }
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
          // eslint-disable-next-line no-console
          // console.log('unlimited connection', conn)
          acc.unlimitedConns++
        }
        return acc
      },
      base
    )
  }, [connections])

  if (peerId == null) {
    return null
  }

  return (
    <div className='NodeInfo gray-muted'>
      <div className='NodeInfo-peerId'>
        <span>Peer ID:</span>
        <span>{peerId}</span>
      </div>
      <div className='NodeInfo-multiaddrs'>
        <p>ListeningAddrs: {listeningAddrs} (relayed: {circuitRelayAddrs}, webRtc: {webRtc}, webRtcDirect: {webRtcDirect}, webTransport: {webTransport}, ws: {webSockets}, wss: {webSocketsSecure})</p>
        <p>Connections: {connections?.length} ({inboundConns} in, {outboundConns} out, {unlimitedConns} unlimited)</p>
      </div>
    </div>
  )
}

export default NodeInfo
