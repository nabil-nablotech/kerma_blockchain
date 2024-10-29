// error keys
export enum ErrorKey {
    INVALID_FORMAT = 'INVALID_FORMAT',
    INVALID_HANDSHAKE = 'INVALID_HANDSHAKE',
    INVALID_TX_CONSERVATION = 'INVALID_TX_CONSERVATION',
    INVALID_TX_SIGNATURE = 'INVALID_TX_SIGNATURE',
    INVALID_TX_OUTPOINT = 'INVALID_TX_OUTPOINT',
    INVALID_BLOCK_POW = 'INVALID_BLOCK_POW',
    INVALID_BLOCK_TIMESTAMP = 'INVALID_BLOCK_COINBASE',
    INVALID_GENESIS = 'INVALID_GENESIS',
    UNKNOWN_OBJECT = 'UNKNOWN_OBJECT',
    UNFINDABLE_OBJECT = 'UNFINDABLE_OBJECT',
    INVALID_ANCESTRY = 'INVALID_ANCESTRY',
}

//invalidformat messages
export enum InvalidFormatMessage {
    SENT_INVALID_JSON = 'A message was sent that could not be parsed as valid JSON.',
    NOT_JSON_OBJECT = 'A message is not a JSON object.',
    KEY_MISSING_OR_ADDITIONAL = 'A required key is missing or an additional key is present.',
    INCORRECT_DATATYPE = 'An incorrect data type is encountered.',
    FIXED_KEY_ERROR = 'A key that should hold a fixed value contains a different value or does not meet the required format.',
    BLOCK_REFERENCE_ERROR = 'A block was referenced at a position where a transaction was expected, or vice versa.',
    NO_INPUT = 'A non-coinbase transaction has no inputs.',
    NEGATIVE_OUTPUT = 'A transaction has an output that holds a negative amount of coins.',
    INVALID_PEER = 'A peer in a peers message is syntactically invalid.'
}

// invalidhandshake messages 
export enum InvalidHandshakeMessage {
    INVALID_HANDSHAKE = 'A (semantic) error occurred related to the handshake.'
}

// UnkownObject messages 
export enum UnkownObjectMessage {
    UNKNOWN_OBJECT = 'Object does not exist.'
}

export type InvalidFormatError = {
    [ErrorKey.INVALID_FORMAT]: InvalidFormatMessage;
}

export type InvalidHandshakeError = {
    [ErrorKey.INVALID_HANDSHAKE]: InvalidHandshakeMessage;
}

export type UnkownObjectError = {
    [ErrorKey.UNKNOWN_OBJECT]: UnkownObjectMessage;
}

export type ErrorMessage = InvalidFormatError | InvalidHandshakeError | UnkownObjectError