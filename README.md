# ZK Paycheck Shield

Privacy-preserving payroll on Stellar using zero-knowledge proofs.

## Problem

On-chain payroll exposes every employee's identity and salary. ZK Paycheck Shield proves you are on the payroll without revealing who you are or how much you earn.

## Architecture

- **Circom Circuit**: Proves Merkle inclusion of `hash(name, amount)` without revealing name or path.
- **Groth16 Prover**: snarkjs generates proofs locally in the browser (or via Node.js fallback).
- **Verifier Contract**: Auto-generated Soroban contract validates BN254 Groth16 proofs on-chain.
- **Payroll Contract**: Stores Merkle root, prevents double-claims via nullifiers, emits claim events.

## Tech Stack

Circom 2.1 | snarkjs | Soroban SDK | React + Vite | Stellar Testnet

## Quick Start

### Prerequisites
- Rust >= 1.84, Node.js >= 20, Circom, snarkjs, Soroban CLI

### 1. Setup
```bash
npm run setup
```

### 2. Build Circuit
```bash
npm run build:circuit
```

### 3. Generate Verifier
```bash
npm run gen:verifier
```

### 4. Deploy Contracts
```bash
npm run deploy
```

### 5. Run Frontend
```bash
cd frontend && npm install && npm run dev
```

### 6. Generate Proof (Node.js fallback)
```bash
npm run demo:proof
```

## Repository

https://github.com/jj5437/zk-paycheck-shield

## Demo Video

*Uploading to Cloudflare R2 — link will be inserted here.*

## Contract Addresses (Testnet)

- Verifier: `CBZ4FENUWDDKNRLNWK2UBUSV7AHKTBCADYMXQPGYUDVMTVXYINJNRLVF`
- Payroll: `CDFGZNOBM2Y3P3LHY6MGURLXUEPVIPTX5EY5NGH3OLK6QQUZFJINWKLL`

## Successful Claim Transaction

- **Tx Hash:** `9e8947038bc7d52bb49bb7da9a60632ac9ef6ea798c6ea576dda16f93a31b888`
- **Explorer:** https://stellar.expert/explorer/testnet/tx/9e8947038bc7d52bb49bb7da9a60632ac9ef6ea798c6ea576dda16f93a31b888

## License

MIT
