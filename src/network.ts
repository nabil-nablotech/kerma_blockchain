import * as net from 'net'
import { logger } from './logger'
import { NAME, Peer, VERSION } from './peer'
import { EventEmitter } from 'events'
import { peerManager } from './peermanager'
import { IPFamily } from './enums/IPfamily'
import { messageGenerator } from './utils/message-generator'
import { MessageHandler } from './utils/message-handler'

class Network {
  /* TODO */

  async init(bindPort: number, bindIP: string) {
    await peerManager.load()

    const server = net.createServer(socket => {
      logger.info(`New connection from peer ${socket.remoteAddress}`)
      /* TODO */
      // add peer to known peers
      if (socket.remoteFamily === IPFamily.IPv4) {
        const peerAddress: string = socket.remoteAddress + ":" + socket.remotePort
        const helloMessage: string = messageGenerator.generateHelloMessage(VERSION,NAME)
        socket.write(helloMessage)
        peerManager.peerDiscovered(peerAddress)
      }

    })

    logger.info(`Listening for connections on port ${bindPort} and IP ${bindIP}`)
    server.listen(bindPort, bindIP)

    /* TODO */
    // perform initial connection to known peers 
    const peers: { [key: string]: Peer; } = {}
    peerManager.getKnownPeers().forEach((peerAddress) => {
      logger.info(`Performing inital connetion to peers: ${peerAddress}`)
      const peer:Peer = new Peer(MessageSocket.createClient(peerAddress), peerAddress);
      const [host, port] = peerAddress.split(":");
      peer.getSocket().getNetSocket().connect(parseInt(port),host);
    })
  }

  broadcast(obj: object) {
    logger.info(`Broadcasting object to all peers: %o`, obj)

    /* TODO */
  }
}

export class MessageSocket extends EventEmitter {
  netSocket: net.Socket
  peerAddr: string
  /* TODO */

  static createClient(peerAddr: string) {
    /* TODO */
    const netSocket = new net.Socket()
    const socket = new MessageSocket(netSocket, peerAddr)
    /* TODO */
    return socket
  }

  constructor(netSocket: net.Socket, peerAddr: string) {
    super()

    this.peerAddr = peerAddr
    this.netSocket = netSocket
    // what to do when data arrives
    this.netSocket.on('data', (data: string) => {
      /* TODO: handle data */
      // const messageHandler = new MessageHandler(this)
    })
    /* TODO */
  }

  getNetSocket(): net.Socket {
    return this.netSocket
  }

  sendMessage(message: string) {
    /* TODO */
  }

  end() {
    /* TODO */
  }
}

export const network = new Network()
