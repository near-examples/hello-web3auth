// near api js
import { JsonRpcProvider } from '@near-js/providers'
import { Account } from '@near-js/accounts'

// utils
import { base58 } from '@scure/base'

// config
import { useEffect } from 'react'
import { useState } from 'react'
import { NearContext } from './useNear'
import { providerUrl } from '../config'
import { useWeb3Auth } from '@web3auth/modal-react-hooks'
import { KeyPair } from '@near-js/crypto'
import { KeyPairSigner } from '@near-js/signers'
import { getED25519Key } from '@web3auth/base-provider'

// Provider
const provider = new JsonRpcProvider({ url: providerUrl })

// eslint-disable-next-line react/prop-types
export function NEARxWeb3Auth({ children }) {
  const [walletId, setWalletId] = useState(null)
  const [nearAccount, setNearAccount] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Get Web3Auth Modal state - this provides the authenticated session
  const { isConnected, authenticateUser, userInfo, provider: web3authProvider } = useWeb3Auth()

  // Sync MPC Core Kit with Web3Auth Modal authentication
  useEffect(() => {
    const syncAuth = async () => {
      if (!isConnected) {
        setWalletId(null)
        setNearAccount(null)
        setLoading(false)
        return
      }

      if (!web3authProvider) return;

      const privateKey = await web3authProvider.request({ method: 'private_key' })
      const privateKeyEd25519 = getED25519Key(privateKey).sk // Already a Uint8Array

      // Create keypair and derive account ID from public key
      const keyPair = KeyPair.fromString(`ed25519:${base58.encode(privateKeyEd25519)}`);
      const signer = new KeyPairSigner(keyPair);
      const accountId = Array.from(keyPair.getPublicKey().data).map(b => b.toString(16).padStart(2, '0')).join('')
      const account = new Account(accountId, provider, signer);
      
      setWalletId(account.accountId)
      setNearAccount(account)
      setLoading(false)
    }

    syncAuth()
  }, [isConnected, authenticateUser, userInfo, web3authProvider])

  return (
    <NearContext.Provider
      value={{
        provider,
        nearAccount,
        walletId,
        loading,
      }}
    >
      {children}
    </NearContext.Provider>
  )
}
