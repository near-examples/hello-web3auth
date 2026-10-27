// Web3Auth Config
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, CommonPrivateKeyProvider } from '@web3auth/modal'

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.OTHER,
  chainId: 'near:testnet',
  rpcTarget: 'https://rpc.testnet.near.org',
  displayName: 'NEAR Testnet',
  blockExplorerUrl: 'https://testnet.nearblocks.io',
  ticker: 'NEAR',
  tickerName: 'NEAR',
}

const privateKeyProvider = new CommonPrivateKeyProvider({
  config: { chain: chainConfig, chains: [chainConfig], keyExportEnabled: true }
})

export const web3AuthContextConfig = {
  web3AuthOptions: {
    clientId: 'BP1rATmBxrPQ5BK0cMry4vmcOXJwYVSElff0dnb3in004j9lFE2SI2QUlC9Sy9lkqVgzussY6QPkOXWocnoJGGI',
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    chains: [chainConfig],
    defaultChainId: chainConfig.chainId,
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
