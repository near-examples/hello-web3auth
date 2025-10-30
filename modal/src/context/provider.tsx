import { ReactNode, useEffect, useState } from 'react';
import { JsonRpcProvider } from '@near-js/providers';
import { Account } from '@near-js/accounts';
import { KeyPair } from '@near-js/crypto';
import { KeyPairSigner } from '@near-js/signers';
import { base58 } from '@scure/base';
import { getED25519Key } from '@web3auth/base-provider';
import { useWeb3Auth } from '@web3auth/modal-react-hooks';

import { NearContext } from './useNear';
import { providerUrl } from '../config';

// -----------------------------
// NEAR Provider instance
// -----------------------------
const provider = new JsonRpcProvider({ url: providerUrl });

// -----------------------------
// Props type
// -----------------------------
interface NEARxWeb3AuthProps {
  children: ReactNode;
}

// -----------------------------
// Provider Component
// -----------------------------
export function NEARxWeb3Auth({ children }: NEARxWeb3AuthProps) {
  const [walletId, setWalletId] = useState<string | null>(null);
  const [nearAccount, setNearAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [web3AuthUser, setWeb3AuthUser] = useState<any | null>(null);

  // Web3Auth Modal state
  const { isConnected, userInfo, provider: web3authProvider } = useWeb3Auth();

  // -----------------------------
  // Sync NEAR account with Web3Auth
  // -----------------------------
  useEffect(() => {
    const syncAuth = async () => {
      if (!isConnected) {
        setWalletId(null);
        setNearAccount(null);
        setWeb3AuthUser(null);
        setLoading(false);
        return;
      }

      if (!web3authProvider) return;

      try {
        // Request private key from Web3Auth
        const privateKeyMaybe: string | null | undefined = await web3authProvider.request({
          method: 'private_key',
        });

        if (!privateKeyMaybe) {
          console.error('Private key not available');
          setLoading(false);
          return;
        }

        const privateKey: string = privateKeyMaybe;

        // Store Web3Auth user info
        setWeb3AuthUser(userInfo || null);

        // Convert private key to ED25519
        const privateKeyEd25519: Uint8Array = getED25519Key(privateKey).sk;

        // Create keypair and signer
        const keyPair = KeyPair.fromString(`ed25519:${base58.encode(privateKeyEd25519)}`);
        const signer = new KeyPairSigner(keyPair);

        // Derive account ID from public key
        const accountId = Array.from(keyPair.getPublicKey().data)
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

        // Create NEAR account instance
        const account = new Account(accountId, provider, signer);

        setWalletId(account.accountId);
        setNearAccount(account);
      } catch (err) {
        console.error('Failed to sync NEAR account:', err);
        setWalletId(null);
        setNearAccount(null);
        setWeb3AuthUser(null);
      } finally {
        setLoading(false);
      }
    };

    syncAuth();
  }, [isConnected, userInfo, web3authProvider]);

  // -----------------------------
  // Login function
  // -----------------------------
  const login = async () => {
    if (!web3authProvider) return;
    try {
      await web3authProvider.request({ method: 'login' });
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  // -----------------------------
  // Logout function
  // -----------------------------
  const logout = async () => {
    if (!web3authProvider) return;
    try {
      await web3authProvider.request({ method: 'logout' });
      setWalletId(null);
      setNearAccount(null);
      setWeb3AuthUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // -----------------------------
  // Context Provider
  // -----------------------------
  return (
    <NearContext.Provider
      value={{
        provider,
        nearAccount,
        walletId,
        loading,
        login,
        logout,
        web3AuthUser,
      }}
    >
      {children}
    </NearContext.Provider>
  );
}
