import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeName =
  | ""
  | "dark"
  | "theme-blue"
  | "theme-sunset"
  | "theme-neon-ice"
  | "theme-pastel-mint"
  | "theme-gruvbox"
  | "theme-solarized"
  | "theme-vintage-paper";

interface ThemeState {
  current: ThemeName;
}

const initialState: ThemeState = {
  current: "",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeReducer: (state, action: PayloadAction<ThemeName>) => {
      state.current = action.payload;
    },
  },
});

export const { setThemeReducer } = themeSlice.actions;
export default themeSlice.reducer;
