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

[TBD - 2-3 minute screen recording]

## Contract Addresses (Testnet)

- Verifier: `CCXIGG3XWVN44OZAXOIG4AWGDFQX46TPYFNNLTMN7ONBRH2VXS6Y52UA`
- Payroll: `CBC3PSZJP5XH72P4AXI3FNSPYTDBZ3DQBSS7OV5FMTL2EMSDDVXKKAFN`

## Successful Claim Transaction

- **Tx Hash:** `56ca0513c213ca17a4082940acf7853d9bde89330542383aef523e8124f1d2a4`
- **Explorer:** https://stellar.expert/explorer/testnet/tx/56ca0513c213ca17a4082940acf7853d9bde89330542383aef523e8124f1d2a4

## License

MIT
