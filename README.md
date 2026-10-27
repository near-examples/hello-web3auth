# NEAR x Web3Auth

Two React examples connect Web3Auth social login to NEAR through `near-api-js`:

- `modal/` uses Web3Auth Modal 10.16's custom-chain provider and derives an
  Ed25519 NEAR key from the authenticated session key.
- `mpc-core-kit/` uses Core Kit 3.6 and a custom SDK `Signer` that delegates byte
  signing to its threshold Ed25519 key, without exporting a private key.

Use Node.js 22.22.2 or newer. In either directory run `npm ci`, `npm run dev`,
`npm run lint`, or `npm run build`. Core Kit also has an offline `npm test`
that verifies transaction hashing and signatures.

Configure your Web3Auth client ID and allowed origins in the dashboard and source
configuration. Core Kit also requires your OAuth verifier/Google client settings.
Fund the displayed NEAR testnet account before submitting greeting changes.
Modal uses the recent 10.x custom-provider API; upgrading to 11.x requires a
separate migration to its changed connection/chain model.
