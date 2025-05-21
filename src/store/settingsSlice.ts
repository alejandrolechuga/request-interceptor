import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  enableRuleset: boolean;
}

const initialState: SettingsState = {
  enableRuleset: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setEnableRuleset(state, action: PayloadAction<boolean>) {
      state.enableRuleset = action.payload;
    },
  },
});

export const { setEnableRuleset } = settingsSlice.actions;

export default settingsSlice.reducer;

