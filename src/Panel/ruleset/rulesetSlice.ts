import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Rule } from '../../types/rule';

type RuleUpdate = Partial<Pick<Rule, 'urlPattern' | 'method' | 'enabled'>>;

const initialState: Rule[] = [];

const rulesetSlice = createSlice({
  name: 'ruleset',
  initialState,
  reducers: {
    addRule(state, action: PayloadAction<Rule>) {
      state.push(action.payload);
    },
    removeRule(state, action: PayloadAction<string>) {
      return state.filter((rule) => rule.id !== action.payload);
    },
    updateRule(
      state,
      action: PayloadAction<{ id: string; changes: RuleUpdate }>
    ) {
      const rule = state.find((r) => r.id === action.payload.id);
      if (rule) {
        Object.assign(rule, action.payload.changes);
      }
    },
    clearRules() {
      return [] as Rule[];
    },
    setRules(_state, action: PayloadAction<Rule[]>) {
      return action.payload;
    },
  },
});

export const { addRule, removeRule, updateRule, clearRules, setRules } =
  rulesetSlice.actions;

export default rulesetSlice.reducer;
