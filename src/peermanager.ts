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
    try {
      logger.info("Loading peers from database")
      const peers = await db.get("peers");
      this.knownPeers = new Set<string>(peers);
      logger.info(`Loaded from db: ${Array.from(this.knownPeers).join(",")}`)
    } catch (error) {
      logger.error(error)
    }
  }

  async store() {
    /* TODO */
    try {
      await db.put("peers", Array.from(this.knownPeers));
    } catch (error) {
      logger.error(error)
    }

  }

  peerDiscovered(peerAddr: string) {
    /* TODO */
    if (this.knownPeers.size == MAX_PEERS_PER_PEER) {
      this.knownPeers.delete(Array.from(this.knownPeers)[0])
    }
    this.knownPeers.add(peerAddr);
    this.store()
  }

  /**
   * If a peer is faulty, then remove it from your known peers
   * @param peerAddr the faulty peer
   */
  peerFailed(peerAddr: string) {
    /* TODO */
    this.knownPeers.delete(peerAddr)
    this.store()
  }

  getKnownPeers(): Set<string> {
    return this.knownPeers
  }
}

export const peerManager = new PeerManager()
