const contractPerNetwork = {
  mainnet: 'hello.near-examples.near',
  testnet: 'hello.near-examples.testnet',
}

export const NetworkId = 'testnet'
export const providerUrl = 'https://test.rpc.fastnear.com'
export const HelloNearContract = contractPerNetwork[NetworkId]
