import assert from 'node:assert/strict';
import test from 'node:test';
import { KeyPair, Transaction } from 'near-api-js';
import { web3AuthSigner } from '../src/context/signer.js';

test('Core Kit signs the SDK hash without exporting a private key or hashing twice', async () => {
  const key = KeyPair.fromRandom('ed25519');
  let signedHash;
  const signer = new web3AuthSigner({
    getPubKeyEd25519: () => key.getPublicKey().data,
    sign: async (bytes) => { signedHash = bytes; return key.sign(bytes).signature; },
  });
  const transaction = new Transaction({ signerId: 'alice.testnet', publicKey: key.getPublicKey(), nonce: 1n,
    receiverId: 'hello.testnet', actions: [], blockHash: new Uint8Array(32) });
  const { txHash, signedTransaction } = await signer.signTransaction(transaction);
  assert.deepEqual(txHash, signedHash);
  assert.equal(key.verify(txHash, signedTransaction.signature.data), true);
});
