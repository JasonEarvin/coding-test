// ThemeContext.js
// Provides light/dark theme toggle functionality across the app

import { createContext, useContext, useEffect, useState } from "react";

// Create the theme context
const ThemeContext = createContext();

// ThemeProvider component wraps the app and provides theme state
export const ThemeProvider = ({ children }) => {
  // Initialize theme state, default is light
  const [theme, setTheme] = useState("light");

  // Whenever the theme changes, apply it to the body class
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Provide the current theme and the toggle function to consumers
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to access the ThemeContext
export const useTheme = () => useContext(ThemeContext);
