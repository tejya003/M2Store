import React, { createContext, useContext, useState } from 'react';

const lightTheme = {
  background: '#ffffff',
  text: '#000000',
  primary: '#1E88E5',
  inputBackground: '#f5f5f5',
  inputText: '#000000',
  border: '#cccccc',
  placeholder: '#999999'
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);