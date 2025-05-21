import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import settingsReducer from './settingsSlice';
import rulesetReducer from '../Panel/ruleset/rulesetSlice';

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
