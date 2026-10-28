import { PublicKey, Signer } from 'near-api-js'

// The NEAR SDK serializes and hashes transactions; Core Kit signs those bytes
// with its threshold Ed25519 key without exporting a private key.
export class web3AuthSigner extends Signer {
  constructor(coreKitInstance) {
    super()
    this.coreKitInstance = coreKitInstance
  }

  async getPublicKey() {
    const publicKey = this.coreKitInstance.getPubKeyEd25519()
    return new PublicKey({ keyType: 0, data: Uint8Array.from(publicKey) })
  }

  async signBytes(bytes) {
    return Uint8Array.from(await this.coreKitInstance.sign(bytes))
  }
}
