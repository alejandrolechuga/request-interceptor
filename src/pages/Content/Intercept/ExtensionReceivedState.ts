import type { Rule } from '../../../types/rule';
import { EventBus } from '../../../utils/EventBus';

export interface ExtensionSettings {
  enableRuleset: boolean;
}

export interface ExtensionStateData {
  settings: ExtensionSettings;
  rules: Rule[];
}

export enum ExtensionStateEvents {
  STATE_UPDATED = 'STATE_UPDATED',
}

interface ExtensionStateEventMap {
  [ExtensionStateEvents.STATE_UPDATED]: ExtensionStateData;
}

export class ExtensionReceivedState extends EventBus<ExtensionStateEventMap> {
  private state: ExtensionStateData;

  constructor(initial?: Partial<ExtensionStateData>) {
    super();
    this.state = {
      settings: { enableRuleset: false },
      rules: [],
      ...initial,
    } as ExtensionStateData;
  }

  public getState(): ExtensionStateData {
    return this.state;
  }

  public updateState(update: Partial<ExtensionStateData>): void {
    this.state = { ...this.state, ...update };
    this.emit(ExtensionStateEvents.STATE_UPDATED, this.state);
  }
}
