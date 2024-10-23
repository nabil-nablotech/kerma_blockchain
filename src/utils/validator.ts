import { InvalidFormatError, InvalidFormatMessage, InvalidHandshakeError, InvalidHandshakeMessage } from "../enums/error";
import { MessageType } from "../enums/message-type";

export class Validator {

    validateFormat(message: any): InvalidFormatError | undefined {
        if (!this.checkObjectKeys(message)) {
            return { INVALID_FORMAT: InvalidFormatMessage.KEY_MISSING_OR_ADDITIONAL }
        } else if (!this.checkPeersMessage(message)) {
            return { INVALID_FORMAT: InvalidFormatMessage.INVALID_PEER }
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
                } else if (data.type === MessageType.Peers && data.peers === "object") {
                    if (Object.keys(data).length > 2 || !Array.isArray(data.peers)) {
                        return false;
                    }
                }
            }
        }

        return true
    }

    checkHelloMessage(data: any): boolean {
        if (typeof data === "object") {
            if (data != null && typeof data.type === "string") {
                if (data.type === MessageType.Hello && data.version === "string" && data.agent === "string") {
                    if (Object.keys(data).length > 3) {
                        return false;
                    }
                    if (!/^0\.10\.\d$/.test(data.version) || !this.checkAgent(data.agent)) {
                        return false
                    }

                }
            }
        }

        return true
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

    checkPeersMessage(data: any): boolean {
        if (typeof data === "object") {
            if (data != null && typeof data.type === "string") {
                if (data.type === MessageType.Peers && data.peers === "object") {
                    if (Object.keys(data).length > 2 || !Array.isArray(data.peers)) {
                        return false;
                    }

                    for (let i = 0; i < data.peers.length; i++) {
                        const [host, port] = data.peers[i];
                        if (host == undefined || port == undefined) {
                            return false
                        } else if (parseInt(port) < 1 || parseInt(port) > 65535) {
                            return false
                        }

                        const regex = /^[a-zA-Z\d\.\-\_]{3,50}$/;
                        let isValidDomain = true
                        if (!regex.test(host)) {
                            isValidDomain = false;
                        }


                        if (host.indexOf('.') === -1 || host.startsWith('.') || host.endsWith('.')) {
                            isValidDomain = false;
                        }


                        const hasLetter = /[a-zA-Z]/.test(host);
                        if (!hasLetter) {
                            isValidDomain = false;
                        }

                        const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})$/;

                        if (!isValidDomain && !ipv4Regex.test(host)) {
                            return false
                        }
                    }
                }
            }
        }

        return true
    }
}
