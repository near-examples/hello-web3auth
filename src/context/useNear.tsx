import { createContext, useContext } from 'react';
import { Account } from '@near-js/accounts';
import { JsonRpcProvider } from '@near-js/providers';

export interface NearContextType {
  provider?: JsonRpcProvider;
  nearAccount: Account | null;
  walletId: string | null;
  web3AuthUser: Record<string, any> | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const NearContext = createContext<NearContextType | undefined>(undefined);

export function useNEARxWeb3Auth(): NearContextType {
  const context = useContext(NearContext);
  if (!context) {
    throw new Error('useNEARxWeb3Auth must be used within a <NEARxWeb3Auth> provider');
  }
  return context;
}
