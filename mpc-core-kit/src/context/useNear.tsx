import { createContext, useContext } from 'react';
import { Account } from '@near-js/accounts';
import { JsonRpcProvider } from '@near-js/providers';

// Define the type of the context
export interface NearContextType {
  nearAccount: Account | null;
  walletId: string | null;
  web3AuthUser: any | null; // Replace `any` with the actual user type if known
  provider: JsonRpcProvider | undefined;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context with default values
export const NearContext = createContext<NearContextType>({
  nearAccount: null,
  walletId: null,
  web3AuthUser: null,
  provider: undefined,
  loading: false,
  login: async () => {},
  logout: async () => {},
});

// Custom hook to use the NEAR Web3Auth context
export function useNEARxWeb3Auth(): NearContextType {
  const context = useContext(NearContext);
  if (!context) {
    throw new Error(
      'useNEARxWeb3Auth must be used within a <NearContext.Provider>'
    );
  }
  return context;
}
