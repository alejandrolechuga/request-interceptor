export enum RuntimeMessage {
  SETTINGS_UPDATE = 'SETTINGS_UPDATE',
}

export interface SettingsUpdateMessage {
  action: RuntimeMessage.SETTINGS_UPDATE;
  settings: {
    enableRuleset: boolean;
  };
}
