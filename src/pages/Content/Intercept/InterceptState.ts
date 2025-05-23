import type { Rule } from '../../../types/rule';

export interface InterceptSettings {
  enableRuleset: boolean;
}

export interface InterceptStateData {
  settings: InterceptSettings;
  rules: Rule[];
}

export class InterceptState {
  private state: InterceptStateData;

  constructor(initial?: Partial<InterceptStateData>) {
    this.state = {
      settings: { enableRuleset: false },
      rules: [],
      ...initial,
    } as InterceptStateData;
  }

  public getState(): InterceptStateData {
    return this.state;
  }

  public updateState(update: Partial<InterceptStateData>): void {
    this.state = { ...this.state, ...update };
  }
}
