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
import { tssLib } from '@toruslabs/tss-frost-lib'
import {
  Web3AuthMPCCoreKit,
  WEB3AUTH_NETWORK,
  COREKIT_STATUS,
} from '@web3auth/mpc-core-kit'
import { web3AuthSigner } from './signer'
import { bytesToHex } from '@noble/hashes/utils'

// config
const web3AuthClientId =
  'BP1rATmBxrPQ5BK0cMry4vmcOXJwYVSElff0dnb3in004j9lFE2SI2QUlC9Sy9lkqVgzussY6QPkOXWocnoJGGI' // get from https://dashboard.web3auth.io
const verifier = 'near-login'
const googleClientId =
  '1088894945876-mfc54okjpbf6pmqakpaab2o6s5e176q9.apps.googleusercontent.com'


// Provider
const provider = new JsonRpcProvider({ url: providerUrl })

console.log(`${window.location.origin}${window.location.pathname}`)

const coreKitInstance = new Web3AuthMPCCoreKit({
  web3AuthClientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.DEVNET,
  storage: window.localStorage,
  manualSync: true,
  tssLib,
  uxMode: 'popup',
  baseUrl: `${window.location.origin}${window.location.pathname}`,
})

// eslint-disable-next-line react/prop-types
export function NEARxWeb3Auth({ children }) {
  const [coreKitStatus, setCoreKitStatus] = useState(
    COREKIT_STATUS.NOT_INITIALIZED
  )
  const [walletId, setWalletId] = useState(null)
  const [nearAccount, setNearAccount] = useState(null)
  const [web3AuthUser, setWeb3AuthUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      await coreKitInstance.init()

      if (coreKitInstance.status === COREKIT_STATUS.LOGGED_IN) {
        const signer = new web3AuthSigner(coreKitInstance)
        const publicKey = signer
          .getPublicKey()
          .toString()
          .replace('ed25519:', '')
        const walletId = bytesToHex(base58.decode(publicKey))
        const acc = new Account(walletId, provider, signer)
        setWalletId(acc.accountId)
        setNearAccount(acc)
        setWeb3AuthUser(coreKitInstance.getUserInfo())
      } else {
        setWalletId(null)
        setNearAccount(null)
        setWeb3AuthUser(null)
      }

      setLoading(false)
    }
    init()
  }, [coreKitStatus])

  const login = async () => {
    setLoading(true)

    await coreKitInstance.loginWithOAuth({
      subVerifierDetails: {
        typeOfLogin: 'google',
        verifier,
        clientId: googleClientId,
      },
    })
console.log("holis g", coreKitInstance.status);
    if (coreKitInstance.status === COREKIT_STATUS.LOGGED_IN) {
      await coreKitInstance.commitChanges() // Needed for new accounts
    }
    setCoreKitStatus(coreKitInstance.status)
  }

  const loginWithJWT = async (idToken, verifierId) => {
    console.log("login with jwt called", { idToken, verifierId })

    // Check if already logged in or logging in
    if (coreKitInstance.status === COREKIT_STATUS.LOGGED_IN) {
      console.log("Already logged in, skipping JWT login")
      return
    }

    if (coreKitInstance.status === COREKIT_STATUS.REQUIRED_SHARE) {
      console.log("Login already in progress (REQUIRED_SHARE status)")
      return
    }

    setLoading(true)

    try {
      const idTokenLoginParams = {
        verifier,
        verifierId: verifierId, // Use sub from the parsed token
        idToken
      }

      console.log("Logging in with ID Token:", idTokenLoginParams)

      await coreKitInstance.loginWithJWT(idTokenLoginParams)

      if (coreKitInstance.status === COREKIT_STATUS.LOGGED_IN) {
        await coreKitInstance.commitChanges() // Needed for new accounts
      }
      setCoreKitStatus(coreKitInstance.status)
    } catch (error) {
      console.error("login error", error)
      
      // If it's a duplicate token error, check if we're actually logged in
      if (error.message?.includes('Duplicate token')) {
        if (coreKitInstance.status === COREKIT_STATUS.LOGGED_IN) {
          console.log("Duplicate token but already logged in, continuing...")
          setCoreKitStatus(coreKitInstance.status)
          return
        }
      }
      
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await coreKitInstance.logout()
    setCoreKitStatus(coreKitInstance.status)
  }

  return (
    <NearContext.Provider
      value={{
        provider,
        nearAccount,
        walletId,
        web3AuthUser,
        login,
        loginWithJWT,
        logout,
        loading,
      }}
    >
      {children}
    </NearContext.Provider>
  )
}
