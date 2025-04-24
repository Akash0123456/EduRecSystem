import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the types of settings we'll store
export interface Settings {
  // Accessibility settings
  textSize: 'small' | 'medium' | 'large';
  
  // Response settings
  responseLength: 'concise' | 'balanced' | 'detailed';
  citationStyle: 'MLA' | 'APA' | 'Chicago' | 'Harvard';
  
  // Other settings can be added here
}

// Define the context type
interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

// Default settings
const defaultSettings: Settings = {
  textSize: 'medium',
  responseLength: 'balanced',
  citationStyle: 'MLA',
};

// Create the context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider component
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or use defaults
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('eduRecSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Update settings
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      localStorage.setItem('eduRecSettings', JSON.stringify(updatedSettings));
      return updatedSettings;
    });
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem('eduRecSettings', JSON.stringify(defaultSettings));
  };

  // Apply text size to the document
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    // Remove any existing text size classes
    htmlElement.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');
    
    // Add the current text size class
    htmlElement.classList.add(`text-size-${settings.textSize}`);
  }, [settings.textSize]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook for using the settings context
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
