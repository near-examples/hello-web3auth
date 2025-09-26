// src/context/provider.tsx
import { ReactNode, useEffect, useState } from 'react';
import { JsonRpcProvider } from '@near-js/providers';
import { Account } from '@near-js/accounts';
import { NearContext } from './useNear';
import { providerUrl } from '../config';
import { tssLib } from '@toruslabs/tss-frost-lib';
import {
  Web3AuthMPCCoreKit,
  WEB3AUTH_NETWORK,
  COREKIT_STATUS,
} from '@web3auth/mpc-core-kit';
import { Web3AuthSigner } from './signer';
import { bytesToHex } from '@noble/hashes/utils';

const web3AuthClientId =
  'BMzaHK4oZHNeZeF5tAAHvlznY5H0k1lNs5WynTzE1Uxvr_fVIemzk-90v_hmnRIwFOuU4wbyMqazIvqth60yRRA';
const verifier = 'web3auth-test-near';
const googleClientId =
  '17426988624-32m2gh1o1n5qve6govq04ue91sioruk7.apps.googleusercontent.com';

const provider = new JsonRpcProvider({ url: providerUrl });

const coreKitInstance = new Web3AuthMPCCoreKit({
  web3AuthClientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.DEVNET,
  storage: window.localStorage,
  manualSync: true,
  tssLib,
  uxMode: 'popup',
  baseUrl: window.location.origin,
});

interface ProviderProps {
  children: ReactNode;
}

export const NEARxWeb3Auth = ({ children }: ProviderProps) => {
  const [coreKitStatus, setCoreKitStatus] = useState<COREKIT_STATUS>(
    COREKIT_STATUS.NOT_INITIALIZED
  );
  const [walletId, setWalletId] = useState<string | null>(null);
  const [nearAccount, setNearAccount] = useState<Account | null>(null);
  const [web3AuthUser, setWeb3AuthUser] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      try {
        await coreKitInstance.init();

        if (coreKitInstance.status === COREKIT_STATUS.LOGGED_IN) {
          const publicKeyRaw = coreKitInstance.getPubKeyEd25519(); // Uint8Array
          const walletIdHex = bytesToHex(Buffer.from(publicKeyRaw));
          const signer = new Web3AuthSigner(coreKitInstance, walletIdHex);
          const acc = new Account(walletIdHex, provider, signer as any);

          setWalletId(acc.accountId);
          setNearAccount(acc);
          setWeb3AuthUser(coreKitInstance.getUserInfo());
        } else {
          setWalletId(null);
          setNearAccount(null);
          setWeb3AuthUser(null);
        }
      } catch (err) {
        console.error('CoreKit init failed:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [coreKitStatus]);

  const login = async () => {
    setLoading(true);
    try {
      await coreKitInstance.loginWithOAuth({
        subVerifierDetails: { typeOfLogin: 'google', verifier, clientId: googleClientId },
      });

      if (coreKitInstance.status === COREKIT_STATUS.LOGGED_IN) {
        await coreKitInstance.commitChanges();
      }

      setCoreKitStatus(coreKitInstance.status);
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await coreKitInstance.logout();
      setCoreKitStatus(coreKitInstance.status);
      setWalletId(null);
      setNearAccount(null);
      setWeb3AuthUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NearContext.Provider
      value={{ provider, nearAccount, walletId, web3AuthUser, login, logout, loading }}
    >
      {children}
    </NearContext.Provider>
  );
};
