import React, { createContext, useContext, useState } from 'react';

const englishText = {
  createAccount: 'Create Account',
  enterName: 'Enter Name',
  enterUsername: 'Enter Username',
  enterEmail: 'Enter Email',
  enterPassword: 'Enter Password',
  confirmPassword: 'Confirm Password',
  getOtp: 'Get OTP',
  enterOtp: 'Enter OTP',
  verifyOtp: 'Verify OTP',
  register: 'Register',
  login: 'Login',
  alreadyAccountLogin: 'Already have an account? Login',
  noAccountRegister: "Don't have an account? Register"
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [t] = useState(englishText);

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);