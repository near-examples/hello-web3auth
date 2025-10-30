// Web3Auth Config
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from '@web3auth/base'
import { CommonPrivateKeyProvider } from '@web3auth/base-provider'

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.OTHER,
  chainId: 'near:testnet', // NEAR mainnet
  rpcTarget: 'https://rpc.testnet.near.org',
  displayName: 'NEAR Mainnet',
  blockExplorerUrl: 'https://nearblocks.io',
  ticker: 'NEAR',
  tickerName: 'NEAR',
}

const privateKeyProvider = new CommonPrivateKeyProvider({
  config: { chainConfig }
})

export const web3AuthContextConfig = {
  web3AuthOptions: {
    clientId: 'BP1rATmBxrPQ5BK0cMry4vmcOXJwYVSElff0dnb3in004j9lFE2SI2QUlC9Sy9lkqVgzussY6QPkOXWocnoJGGI',
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    chainConfig,
    privateKeyProvider,
  }
}

// NEAR Config
const contractPerNetwork = {
  mainnet: 'hello.near-examples.near',
  testnet: 'hello.near-examples.testnet',
}

export const NetworkId = 'testnet'
export const providerUrl = 'https://test.rpc.fastnear.com'
export const HelloNearContract = contractPerNetwork[NetworkId]