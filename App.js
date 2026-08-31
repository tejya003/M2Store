import React from 'react';
import AppNavigator from './frontend/navigation/AppNavigator';
import { ThemeProvider } from './frontend/context/ThemeContext';
import { LanguageProvider } from './frontend/context/LanguageContext';

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppNavigator />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;