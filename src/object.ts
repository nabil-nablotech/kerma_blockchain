export type ObjectId = string

import level from 'level-ts'
import {
  Object, ObjectType,
  TransactionObjectType, BlockObjectType
} from './message'
import { Transaction } from './transaction'
import { Block } from './block'
import { logger } from './logger'
import { hash } from './crypto/hash'
import { Peer } from './peer'
import { Deferred, delay, resolveToReject } from './promise'
import { mempool } from './mempool'

export const db = new level('./db')
const OBJECT_AVAILABILITY_TIMEOUT = 5000 // ms

/**
 * Interfaces the database
 */
class ObjectManager {
  /* TODO */

  id(obj: any) {
    /* TODO */
  }

  /**
   * Checks if you know about this object
   * @param objectid 
   */
  async exists(objectid: ObjectId): Promise<boolean> {
    /* TODO */
    try {
      logger.info(`Checking if ${objectid} exits in database`)
      const object = await db.get(objectid);
      return true
    } catch (error) {
      logger.error(error)
      return false
    }
  }

  async get(objectid: ObjectId): Promise<any> {
    /* TODO */
    try {
      logger.info(`Fetching object:${objectid} from database`)
      const object = await db.get(objectid);
      return object
    } catch (error) {
      logger.error(error)
      return null;
    }
  }

  async del(objectid: ObjectId) {
    /* TODO */
  }

  async put(object: any) {
    /* TODO */
  }

  async validate(object: ObjectType, peer: Peer) {
    /* TODO */
  }

  /**
   * Attempts to retrieve an object from a peer
   * @param objectid the object to get
   * @param peer the peer you want to get the object from
   * @returns the object, or rejects if not possible
   */
  async retrieve(objectid: ObjectId, peer: Peer): Promise<Boolean> { // todo: Promise<ObjectType>
    /* TODO */
    return true
  }
}

export const objectManager = new ObjectManager()
