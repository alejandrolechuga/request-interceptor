export enum ExtensionMessageType {
  STATE_UPDATE = 'STATE_UPDATE',
  RECEIVER_READY = 'RECEIVER_READY',
}

export enum ExtensionMessageOrigin {
  DEVTOOLS = 'devtools',
  RECEIVER = 'receiver',
  CONTENT_SCRIPT = 'content-script',
}
