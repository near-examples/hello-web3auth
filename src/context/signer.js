import { PublicKey } from "@near-js/crypto"
import { Signature, SignedTransaction } from "@near-js/transactions"
import { sha256 } from "@noble/hashes/sha2"
import { bytesToHex, hexToBytes } from "@noble/hashes/utils"

// A Signer class that implements the `Signer` interface from near-api-js
export class web3AuthSigner {
  constructor(coreKitInstance) {
    this.coreKitInstance = coreKitInstance
  }

  getPublicKey() {
    let web3AuthKey = this.coreKitInstance.getPubKeyEd25519()
    return new PublicKey({ keyType: 0, data: Uint8Array.from(web3AuthKey) })
  }

  async signTransaction(transaction) {
    const encoded = transaction.encode()
    const txHash = bytesToHex(sha256(encoded))
    const signatureRaw = await this.coreKitInstance.sign(
      hexToBytes(txHash)
    )
    const signature = new Signature({
      keyType: transaction.publicKey.keyType,
      data: signatureRaw,
    })
    return [[], new SignedTransaction({ transaction, signature })]
  }
}