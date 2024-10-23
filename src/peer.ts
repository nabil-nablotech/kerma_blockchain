import { logger } from './logger'
import { MessageSocket } from './network'
import {
  Messages,
  Message,
  HelloMessage,
  PeersMessage, GetPeersMessage,
  IHaveObjectMessage, GetObjectMessage, ObjectMessage,
  GetChainTipMessage, ChainTipMessage,
  ErrorMessage,
  MessageType,
  HelloMessageType,
  PeersMessageType, GetPeersMessageType,
  IHaveObjectMessageType, GetObjectMessageType, ObjectMessageType,
  GetChainTipMessageType, ChainTipMessageType,
  ErrorMessageType,
  GetMempoolMessageType,
  MempoolMessageType
} from './message'
import { peerManager } from './peermanager'
import { db, objectManager } from './object'
import { network } from './network'
import { ObjectId } from './object'
import { chainManager } from './chain'
import { mempool } from './mempool'
import { messageGenerator } from './utils/message-generator'
import { MessageHandler } from './utils/message-handler'
import { ErrorKey, InvalidHandshakeMessage } from './enums/error'

export const VERSION = '0.10.1' /* TODO */
export const NAME = 'nablotech' /* TODO */

// Number of peers that each peer is allowed to report to us
const MAX_PEERS_PER_PEER = 30

export class Peer {
  socket: MessageSocket
  peerAddr: string
  timeout: any
  messageHandler: MessageHandler
  /* TODO */

  getSocket(): MessageSocket {
    return this.socket
  }

  getPeerAddr(): string {
    return this.peerAddr
  }

  async sendHello() {
    /* TODO */
  }
  async sendGetPeers() {
    /* TODO */
  }
  async sendPeers() {
    /* TODO */
  }
  async sendIHaveObject(obj: any) {
    /* TODO */
  }
  async sendObject(obj: any) {
    /* TODO */
  }
  async sendGetObject(objid: ObjectId) {
    /* TODO */
  }
  async sendGetChainTip() {
    /* TODO */
  }
  async sendChainTip(blockid: ObjectId) {
    /* TODO */
  }
  async sendGetMempool() {
    /* TODO */
  }
  async sendMempool(txids: ObjectId[]) {
    /* TODO */
  }
  async sendError(err: string) {
    /* TODO */
    this.socket.getNetSocket().write(err)
    this.socket.getNetSocket().end()
    logger.error(err)
    logger.error(`Connection with ${this.socket.getNetSocket().remoteAddress}:${this.socket.getNetSocket().remotePort} closed by server.`)
    peerManager.peerFailed(this.socket.getNetSocket().remoteAddress + ":" + this.socket.getNetSocket().remotePort)
  }
  sendMessage(obj: object) {
    /* TODO */
  }
  async fatalError(err: string) {
    /* TODO */
  }
  async fail() {
    /* TODO */
  }
  async onConnect() {
    /* TODO */
    logger.info(`On Connection Establishment sending hello message to: ${this.socket.getNetSocket().remoteAddress}:${this.socket.getNetSocket().remotePort}`)
    const helloMessage: string = messageGenerator.generateHelloMessage(VERSION, NAME)
    this.socket.getNetSocket().write(helloMessage)
    this.startTimeout()
  }
  async onMessage(message: string) {
    this.debug(`Message arrival: ${message}`)
    this.messageHandler.handleData(message)

    let msg: object = {}

    /* TODO */

    // check if this msg is a valid Message
    if (!Message.guard(msg)) {
      /* TODO */
    }
    /* TODO */
    /*Message.match(
      this.onMessageHello.bind(this),
      this.onMessageGetPeers.bind(this),
      this.onMessagePeers.bind(this),
      this.onMessageIHaveObject.bind(this),
      this.onMessageGetObject.bind(this),
      this.onMessageObject.bind(this),
      this.onMessageGetChainTip.bind(this),
      this.onMessageChainTip.bind(this),
      this.onMessageGetMempool.bind(this),
      this.onMessageMempool.bind(this),
      this.onMessageError.bind(this)
    )(msg)*/
  }

  async onData(data: string) {
    this.debug(`Data arrival: ${data}`)
    this.messageHandler.handleData(data.toString())

  }

  async onMessageHello() {
    /* TODO */
    if (typeof this.timeout !== "undefined") {
      clearTimeout(this.timeout)
    }
    logger.info(`Hello Message recieved from: ${this.socket.getNetSocket().remoteAddress}:${this.socket.getNetSocket().remotePort}`)
    this.socket.getNetSocket().write(messageGenerator.generateGetPeersMessage())
    logger.info(`Getpeers message sent to: ${this.socket.getNetSocket().remoteAddress}:${this.socket.getNetSocket().remotePort}`)
  }
  async onMessagePeers(msg: PeersMessageType) {
    /* TODO */
    logger.info(`Peers message sent to: ${this.socket.getNetSocket().remoteAddress}:${this.socket.getNetSocket().remotePort}`)
  }
  async onMessageGetPeers(msg: GetPeersMessageType) {
    /* TODO */
    logger.info(`Getpeers message recieved from : ${this.socket.getNetSocket().remoteAddress}:${this.socket.getNetSocket().remotePort}`)
    this.socket.getNetSocket().write(messageGenerator.generatePeersMessage(Array.from(peerManager.getKnownPeers())))
    logger.info(`Peers message sent to: ${this.socket.getNetSocket().remoteAddress}:${this.socket.getNetSocket().remotePort}`)
  }
  async onMessageIHaveObject(msg: IHaveObjectMessageType) {
    /* TODO */
  }
  async onMessageGetObject(msg: GetObjectMessageType) {
    /* TODO */
  }
  async onMessageObject(msg: ObjectMessageType) {
    /* TODO */
  }
  async onMessageGetChainTip(msg: GetChainTipMessageType) {
    /* TODO */
  }
  async onMessageChainTip(msg: ChainTipMessageType) {
    /* TODO */
  }
  async onMessageGetMempool(msg: GetMempoolMessageType) {
    /* TODO */
  }
  async onMessageMempool(msg: MempoolMessageType) {
    /* TODO */
  }
  async onMessageError(error: any) {
    /* TODO */
    if (error.name == ErrorKey.INVALID_HANDSHAKE) {
      const errorMessage: string = messageGenerator.generateErrorMessage({ INVALID_HANDSHAKE: error.msg })
      this.sendError(errorMessage)
    }

  }

  async startTimeout() {
    this.timeout = setTimeout(() => {
      logger.error(`Didn't recieve hello message from: ${this.socket.getNetSocket().remoteAddress}:${this.socket.getNetSocket().remotePort} within timeout time.`)
      const errorMessage: string = messageGenerator.generateErrorMessage({ INVALID_HANDSHAKE: InvalidHandshakeMessage.INVALID_HANDSHAKE })
      this.sendError(errorMessage)
    }, 20000);
  }

  log(level: string, message: string, ...args: any[]) {
    logger.log(
      level,
      `Add further debug info ${message}`,
      ...args
    )
  }
  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args)
  }
  info(message: string, ...args: any[]) {
    this.log('info', message, ...args)
  }
  debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args)
  }
  constructor(socket: MessageSocket, peerAddr: string) {
    this.socket = socket
    this.peerAddr = peerAddr
    this.messageHandler = new MessageHandler(this)

    socket.netSocket.on('connect', this.onConnect.bind(this))
    socket.netSocket.on('error', err => {
      this.warn(`Socket error: ${err}`)
      this.fail()
    })
    socket.on('message', this.onMessage.bind(this))

    // what to do when data arrives
    socket.netSocket.on('data', this.onData.bind(this))
  }
}
