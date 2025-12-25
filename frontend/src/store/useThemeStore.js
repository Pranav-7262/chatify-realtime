import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee", // default theme is coffee
  setTheme: (theme) => {
    // function to update the theme
    localStorage.setItem("chat-theme", theme);
    set({ theme }); // update the state with the new theme
  },
})); // here we create a zustand store to manage the theme state
