import { createContext, useContext } from 'react';
import { Account } from '@near-js/accounts';
import { JsonRpcProvider } from '@near-js/providers';

// -----------------------------
// Types
// -----------------------------
interface NearContextType {
  nearAccount: Account | null;
  walletId: string | null;
  provider: JsonRpcProvider | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  web3AuthUser: any | null;
}

// -----------------------------
// Default values
// -----------------------------
const defaultProvider: NearContextType = {
  nearAccount: null,
  walletId: null,
  provider: null,
  loading: false,
  login: async () => {},
  logout: async () => {},
  web3AuthUser: null,
};

// -----------------------------
// Context
// -----------------------------
export const NearContext = createContext<NearContextType>(defaultProvider);

// -----------------------------
// Hook
// -----------------------------
export function useNEARxWeb3Auth(): NearContextType {
  const context = useContext(NearContext);
  if (!context) {
    throw new Error(
      'useNEARxWeb3Auth must be used within a <NearContext> provider'
    );
  }
  return context;
}
