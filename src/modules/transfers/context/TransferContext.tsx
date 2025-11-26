
import React, { createContext, useContext, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1,
    },
  },
});

type TransferContextValue = Record<string, never>;

const TransferContext = createContext<TransferContextValue | undefined>(undefined);

export const TransferProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TransferContext.Provider value={{} as TransferContextValue}>
        {children}
      </TransferContext.Provider>
    </QueryClientProvider>
  );
};

export const useTransferContext = () => {
  const context = useContext(TransferContext);
  if (!context) {
    throw new Error('useTransferContext must be used within TransferProvider');
  }
  return context;
};
