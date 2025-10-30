import { PublicKey } from "@near-js/crypto";
import { Signature, SignedTransaction, Transaction } from "@near-js/transactions";
import { sha256 } from "@noble/hashes/sha2";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";

export class Web3AuthSigner {
  coreKitInstance: any;

  constructor(coreKitInstance: any) {
    this.coreKitInstance = coreKitInstance;
  }

  getPublicKey(): PublicKey {
    const key = this.coreKitInstance.getPubKeyEd25519();
    return new PublicKey({ keyType: 0, data: Uint8Array.from(key) });
  }

  async signTransaction(transaction: Transaction): Promise<[Signature[], SignedTransaction]> {
    const encoded = transaction.encode();
    const hash = bytesToHex(sha256(encoded));
    const sigRaw = await this.coreKitInstance.sign(hexToBytes(hash));

    const signature = new Signature({
      keyType: transaction.publicKey.keyType,
      data: sigRaw,
    });

    return [[], new SignedTransaction({ transaction, signature })];
  }
}
