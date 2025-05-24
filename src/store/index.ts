import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import settingsReducer, { setEnableRuleset } from './settingsSlice';
import rulesetReducer, { setRules } from '../Panel/ruleset/rulesetSlice';
import { RuntimeMessage } from '../types/runtimeMessage';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    ruleset: rulesetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// When running as a Chrome extension, load persisted settings and rules from
// chrome.storage.local so the store reflects the last saved state.
if (typeof chrome !== 'undefined' && chrome.storage?.local) {
  chrome.storage.local.get(['settings', 'ruleset'], ({ settings, ruleset }) => {
    if (settings) {
      store.dispatch(setEnableRuleset(settings.enableRuleset));
    }
    if (ruleset) {
      store.dispatch(setRules(ruleset));
    }
  });

  let previousSettings = store.getState().settings;
  let previousRuleset = store.getState().ruleset;

  // Persist updates to chrome.storage.local whenever settings or rules change.
  // `previousSettings` and `previousRuleset` track the last values written so
  // we always write the latest state after each dispatch.
  store.subscribe(() => {
    const state = store.getState();
    const { settings, ruleset } = state;

    if (previousSettings !== settings || previousRuleset !== ruleset) {
      previousSettings = settings;
      previousRuleset = ruleset;

      chrome.storage.local.set({ settings, ruleset });

      if (chrome.tabs && chrome.devtools?.inspectedWindow) {
        chrome.tabs.sendMessage(chrome.devtools.inspectedWindow.tabId, {
          action: RuntimeMessage.STATE_UPDATE,
          state,
        });
      } else {
        console.log('chrome devtools not available, skipping state broadcast');
      }
    }
  });
}
