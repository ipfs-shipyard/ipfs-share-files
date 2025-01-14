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
      listeningAddrs: 0, // total listening addrs
      circuitRelayAddrs: 0, // circuit relay addrs
      webRtc: 0, // Any WebRTC address including a TCP relay one which isn't very useful for other browsers
      webRtcDirect: 0, // WebRTC Direct circuit relay addrs which can be used for browser WebRTC signalling
      webTransport: 0, // WebTransport circuit relay addrs which can be used for browser WebRTC signalling
      webSockets: 0, // WebSockets circuit relay addrs which can be used for browser WebRTC signalling
      webSocketsSecure: 0 // Secure WebSockets circuit relay addrs which can be used for browser WebRTC signalling
    }

    if (multiaddrs == null) {
      return base
    }
    return multiaddrs.reduce(
      (acc: typeof base, addr: Multiaddr) => {
        acc.listeningAddrs++
        if (Circuit.exactMatch(addr)) {
          acc.circuitRelayAddrs++
        }
        if (WebRTC.exactMatch(addr)) {
          acc.webRtc++
        }
        if (Circuit.exactMatch(addr) && WebRTCDirect.matches(addr)) {
          acc.webRtcDirect++
        }
        if (Circuit.exactMatch(addr) && WebTransport.matches(addr)) {
          acc.webTransport++
        }
        if (Circuit.exactMatch(addr) && WebSockets.matches(addr)) {
          acc.webSockets++
        }
        if (Circuit.exactMatch(addr) && WebSocketsSecure.matches(addr)) {
          acc.webSocketsSecure++
        }
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
      <NodeInfoDetail label='ListeningAddrs' value={`${listeningAddrs} (relayed: ${circuitRelayAddrs}, WebRTC: ${webRtc}, Secure WebSockets: ${webSocketsSecure}, WebRTC Direct: ${webRtcDirect}, WebTransport: ${webTransport}, WebSockets: ${webSockets})`} />
      {/*
        Dialable from other Browsers exclude:
        - WebTransport which is not included in the default Helia transports due to flaky browser support.
        - Normal WebSockets which is blocked in secure contexts.
      */}
      <NodeInfoDetail label='Dialable from other Browsers' value={` ${(webRtcDirect + webSocketsSecure) > 0 ? '✅' : '❌'}`} />
      <NodeInfoDetail label='Connections' value={`${totalConns} (${inboundConns} in, ${outboundConns} out, ${unlimitedConns} unlimited)`} />
    </div>
  )
}

export default NodeInfo
