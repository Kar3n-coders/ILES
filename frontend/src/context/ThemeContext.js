import { createContext } from "react";

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  return <ThemeContext.Provider>{children}</ThemeContext.Provider>;
}
