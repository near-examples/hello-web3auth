import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from '@web3auth/base'
import type { Web3AuthOptions } from '@web3auth/modal'
import type { Web3AuthContextConfig } from '@web3auth/modal-react-hooks'
import { CommonPrivateKeyProvider } from '@web3auth/base-provider'

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.OTHER,
  chainId: 'near:mainnet', // NEAR mainnet
  rpcTarget: 'https://rpc.mainnet.near.org',
  displayName: 'NEAR Mainnet',
  blockExplorerUrl: 'https://nearblocks.io',
  ticker: 'NEAR',
  tickerName: 'NEAR',
}

const privateKeyProvider = new CommonPrivateKeyProvider({
  config: { chainConfig }
})

const web3AuthOptions: Web3AuthOptions = {
  clientId: 'BP1rATmBxrPQ5BK0cMry4vmcOXJwYVSElff0dnb3in004j9lFE2SI2QUlC9Sy9lkqVgzussY6QPkOXWocnoJGGI',
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  chainConfig,
  privateKeyProvider,
}

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions,
}

export default web3AuthContextConfig
