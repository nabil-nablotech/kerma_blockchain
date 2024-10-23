import { ErrorMessage, InvalidFormatMessage } from "../enums/error";
import { MessageType } from "../enums/message-type";
import { Peer } from "../peer";
import { messageGenerator } from "./message-generator";
import { Validator } from "./validator";


export class MessageHandler {
    buffer: string = ""
    separator = ":KERMACONTINUE:"
    peer: Peer

    constructor(peer: Peer) {
        this.peer = peer
    }

    handleData(data: string) {
        this.buffer += data
        let fragments = this.buffer.split('\n')
        console.log("data: " + data)
        console.log("Fragements: " + fragments)
        console.log("Fragements sixe: " + fragments.length)
        console.log("buffer: " + this.buffer)
        for (let i = 0; i < fragments.length; i++) {
            if (fragments[i] != "") {
                this.processMessage(fragments[i]);
            }
        }

        this.buffer = fragments.length > 0 && fragments[fragments.length - 1] !== "" ? fragments[fragments.length - 1] + this.separator : '';
    }

    processMessage(data: string) {
        const validator = new Validator();
        let mergedMessage: any = {}
        if (data.includes(this.separator)) {
            let packets = data.split(this.separator)
            for (let i = 0; i < packets.length; i++) {
                const packetObject = this.parseJSON(packets[i])
                if (typeof packetObject === "object") {
                    if (packetObject != null && typeof packetObject.type === "string") {
                        mergedMessage = { ...packetObject, type: typeof mergedMessage.type === "string" ? mergedMessage.type + packetObject.type : packetObject.type }
                    } else if (typeof packetObject === "undefined") {
                        const errorMessage: string = messageGenerator.generateErrorMessage({ INVALID_FORMAT: InvalidFormatMessage.KEY_MISSING_OR_ADDITIONAL })
                        this.peer.sendError(errorMessage)
                        return
                    }
                } else if (typeof packetObject === "undefined") {
                    const errorMessage: string = messageGenerator.generateErrorMessage({ INVALID_FORMAT: InvalidFormatMessage.NOT_JSON_OBJECT })
                    this.peer.sendError(errorMessage)
                    return
                }
            }
        } else {
            const packetObject = this.parseJSON(data)
            if (typeof packetObject === "object") {
                mergedMessage = { ...packetObject }
            } else if (typeof packetObject === "undefined") {
                const errorMessage: string = messageGenerator.generateErrorMessage({ INVALID_FORMAT: InvalidFormatMessage.NOT_JSON_OBJECT })
                this.peer.sendError(errorMessage)
                return
            }
        }

        let error: ErrorMessage | undefined
        error = validator.validateFormat(mergedMessage);
        if (error) {
            const errorMessage: string = messageGenerator.generateErrorMessage(error)
            this.peer.sendError(errorMessage)
            return
        }

        error = validator.validateHelloMessageContent(mergedMessage);
        if (error) {
            const errorMessage: string = messageGenerator.generateErrorMessage(error)
            this.peer.sendError(errorMessage)
            return
        }

        if (mergedMessage.type === MessageType.Hello) {
            this.peer.onMessageHello()
        }

        if (mergedMessage.type === MessageType.Error) {
            this.peer.onMessageError(mergedMessage)
        }

        if (mergedMessage.type === MessageType.Getpeers) {
            this.peer.onMessageGetPeers(mergedMessage)
        }

        if (mergedMessage.type === MessageType.Peers) {
            this.peer.onMessagePeers(mergedMessage)
        }

    }

    parseJSON(data: string): any {
        const validator = new Validator();
        try {
            const message = JSON.parse(data);
            return message
        } catch (err) {
            return undefined
        }


    }
}
