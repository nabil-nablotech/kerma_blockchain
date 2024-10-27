import { db } from './object'
import { logger } from './logger'
import isValidHostname from 'is-valid-hostname'
import { MAX_PEERS_PER_PEER } from './peer'

export const BOOTSTRAP_PEERS: string[] = [
  /* TODO */
  "128.130.122.101:18018"
]

class PeerManager {
  knownPeers: Set<string> = new Set()

  async load() {
    /* TODO */

  }

  async store() {
    /* TODO */
  }

  peerDiscovered(peerAddr: string) {
    /* TODO */
    if (this.knownPeers.size == MAX_PEERS_PER_PEER) {
      this.knownPeers.delete(Array.from(this.knownPeers)[0])
    }
    this.knownPeers.add(peerAddr);
  }

  /**
   * If a peer is faulty, then remove it from your known peers
   * @param peerAddr the faulty peer
   */
  peerFailed(peerAddr: string) {
    /* TODO */
    this.knownPeers.delete(peerAddr)
  }

  getKnownPeers(): Set<string> {
    return this.knownPeers
  }
}

export const peerManager = new PeerManager()
