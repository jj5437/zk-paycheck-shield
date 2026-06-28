#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "Deploying Verifier contract..."
cd contracts/verifier
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/verifier.wasm \
  --source alice \
  --network testnet > verifier_contract_id.txt
cd ../..

VERIFIER_ID=$(cat contracts/verifier/verifier_contract_id.txt)
echo "Verifier deployed: $VERIFIER_ID"

echo "Deploying Payroll contract..."
cd contracts/payroll
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/payroll.wasm \
  --source alice \
  --network testnet > payroll_contract_id.txt
cd ../..

PAYROLL_ID=$(cat contracts/payroll/payroll_contract_id.txt)
echo "Payroll deployed: $PAYROLL_ID"

echo "Initializing Payroll..."
soroban contract invoke \
  --id $PAYROLL_ID \
  --source alice \
  --network testnet \
  -- \
  initialize \
  --employer $(soroban keys address alice) \
  --verifier $VERIFIER_ID

echo "Done. Update frontend .env with:"
echo "VITE_PAYROLL_CONTRACT_ID=$PAYROLL_ID"
echo "VITE_VERIFIER_CONTRACT_ID=$VERIFIER_ID"
