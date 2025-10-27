import { useContext, createContext } from 'react'

/**
 * @typedef {Object} NearContext
 * @property {import('@near-js/accounts').Account | null} nearAccount The NEAR account instance
 * @property {string} walletId The user's NEAR wallet address
 * @property {import('@near-js/providers').JsonRpcProvider} provider A NEAR JSON RPC provider
 */

/** @type {import('react').Context<NearContext>} */
export const NearContext = createContext({
  walletId: null,
  web3AuthUser: null,
  nearAccount: null,
  provider: undefined,
  loading: Boolean,
  login: async () => {},
  loginWithJWT: async (idToken, email) => {},
  logout: async () => {},
})

export function useNEARxWeb3Auth() {
  const context = useContext(NearContext)
  if (!context) {
    throw new Error(
      'useNEARxWeb3Auth must be used within a <NearContext> provider'
    )
  }
  return context
}
