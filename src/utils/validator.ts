import { InvalidFormatError, InvalidFormatMessage, InvalidHandshakeError, InvalidHandshakeMessage } from "../enums/error";
import { MessageType } from "../enums/message-type";

export class Validator {

    validateFormat(message: any): InvalidFormatError | undefined {
        if (!this.checkObjectKeys(message)) {
            return { INVALID_FORMAT: InvalidFormatMessage.KEY_MISSING_OR_ADDITIONAL }
        }

        return undefined
    }

    validateHelloMessageContent(message: any): InvalidHandshakeError | undefined {
        if (!this.checkHelloMessage(message)) {
            return { INVALID_HANDSHAKE: InvalidHandshakeMessage.INVALID_HANDSHAKE }
        }

        return undefined
    }

    checkObjectKeys(data: any): boolean {
        if (typeof data === "object") {
            if (data != null && typeof data.type === "string") {
                if (data.type === MessageType.Hello && data.version === "string" && data.agent === "string") {
                    if (Object.keys(data).length > 3) {
                        return false;
                    }
                    return true
                }
            }
        }

        return false
    }

    checkHelloMessage(data: any): boolean {
        if (typeof data === "object") {
            if (data != null && typeof data.type === "string") {
                if (data.type === MessageType.Hello && data.version === "string" && data.agent === "string") {
                    if (Object.keys(data).length > 3) {
                        return false;
                    }
                    if (/^0\.10\.\d$/.test(data.version) && this.checkAgent(data.agent)) {
                        return true
                    }

                }
            }
        }

        return false
    }

    checkAgent(agent: string): boolean {
        if (typeof agent !== 'string' || agent.length > 128) {
            return false;
        }

        for (let i = 0; i < agent.length; i++) {
            const charCode = agent.charCodeAt(i);
            if (charCode < 32 || charCode > 126) {
                return false;
            }
        }

        return true;
    }
}
