import { ErrorMessage } from "../enums/error"
import { MessageType } from "../enums/message-type"


class MessageGenerator {
    generateHelloMessage(version: string, agent: string): string {
        const helloMessage = { type: MessageType.Hello, version, agent }
        return this.canonicalJSONStringify(helloMessage)
    }

    generateErrorMessage(error: ErrorMessage): string {
        const errorMessage = { type: MessageType.Error, ...error }
        return this.canonicalJSONStringify(errorMessage)
    }

    generateGetPeersMessage(): string {
        const getPeersMessage = { type: MessageType.Getpeers }
        return this.canonicalJSONStringify(getPeersMessage)
    }

    generatePeersMessage(peerAddresses: string[]): string {
        const peersMessage = { type: MessageType.Peers, peers: peerAddresses }
        return this.canonicalJSONStringify(peersMessage)
    }

    generateGetObjectMessage(objectid: string): string {
        const getObjectMessage = { type: MessageType.GetObject, objectid: objectid }
        return this.canonicalJSONStringify(getObjectMessage)
    }

    generateObjectMessage(object: any): string {
        const objectMessage = { type: MessageType.Object, object: object }
        return this.canonicalJSONStringify(objectMessage)
    }

    canonicalJSONStringify(obj: any): string {
        if (Array.isArray(obj)) {
            return '[' + obj.map(this.canonicalJSONStringify).join(',') + ']';
        } else if (typeof obj === 'object' && obj !== null) {
            const keys = Object.keys(obj).sort();
            return '{' + keys.map(key =>
                `"${key}":${this.canonicalJSONStringify(obj[key])}`
            ).join(',') + '}';
        } else if (typeof obj === 'string') {
            return JSON.stringify(obj);
        } else if (typeof obj === 'number') {
            return Number.isInteger(obj) ? obj.toString() : obj.toFixed(15).replace(/\.?0+$/, '');
        } else {
            return JSON.stringify(obj);
        }
    }
}

export const messageGenerator = new MessageGenerator()