import { PublicKey } from "@near-js/crypto";
import { Signature, SignedTransaction, Transaction } from "@near-js/transactions";
import { sha256 } from "@noble/hashes/sha2";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";

export interface SignedMessage {
  accountId: string;
  signature: Uint8Array;
  publicKey: PublicKey;
}

export class Web3AuthSigner {
  coreKitInstance: any;
  accountId: string;

  constructor(coreKitInstance: any, accountId: string) {
    this.coreKitInstance = coreKitInstance;
    this.accountId = accountId;
  }

  async getPublicKey(): Promise<PublicKey> {
    const web3AuthKey = this.coreKitInstance.getPubKeyEd25519();
    return new PublicKey({ keyType: 0, data: Uint8Array.from(web3AuthKey) });
  }

  async signNep413Message(
    message: string,
    accountId: string,
    recipient: string,
    nonce: Uint8Array,
    callbackUrl?: string
  ): Promise<SignedMessage> {
    const messageBytes = new TextEncoder().encode(message);
    const hash = sha256(messageBytes);
    const signatureRaw = await this.coreKitInstance.sign(hash);
    const pubKey = await this.getPublicKey();

    return {
      accountId,
      signature: new Uint8Array(signatureRaw),
      publicKey: pubKey,
    };
  }

  async signDelegateAction(_delegateAction: any): Promise<Uint8Array> {
    return new Uint8Array();
  }

  async signTransaction(transaction: Transaction) {
    const encoded = transaction.encode();
    const txHash = bytesToHex(sha256(encoded));
    const signatureRaw = await this.coreKitInstance.sign(hexToBytes(txHash));
    const signature = new Signature({
      keyType: transaction.publicKey.keyType,
      data: signatureRaw,
    });
    return [[], new SignedTransaction({ transaction, signature })];
  }
}
