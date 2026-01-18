import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
  isRequestModalOpen: boolean;
  setIsRequestModalOpen: (open: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  return (
    <UIContext.Provider value={{ isRequestModalOpen, setIsRequestModalOpen }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
};