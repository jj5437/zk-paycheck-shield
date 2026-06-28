# Demo Script

## Prerequisites

- All tools installed (see README)
- Contracts built

## Step 1: Start Frontend

```bash
cd frontend && npm run dev
```

Open http://localhost:5173

## Step 2: Employer Sets Payroll

1. Open **Employer Panel** (left side)
2. View the 3 demo employees: Alice (1000 XLM), Bob (1500 XLM), Carol (2000 XLM)
3. Click **Generate Merkle Root**
4. Copy the root hash displayed

## Step 3: Deploy and Initialize (CLI)

```bash
npm run deploy
```

This deploys both contracts and initializes Payroll with the verifier address.

## Step 4: Set Payroll Root on Chain

```bash
export PAYROLL_ID=$(cat contracts/payroll/payroll_contract_id.txt)
soroban contract invoke \
  --id $PAYROLL_ID \
  --source alice \
  --network testnet \
  -- \
  set_payroll_root \
  --root ROOT_HASH_HERE
```

## Step 5: Employee Generates Proof

1. Open **Employee Claim** panel (right side)
2. Enter Name: `Carol`, Amount: `2000`
3. Click **Generate Proof (Browser)**
   - If browser proving fails, use Node.js fallback:
   ```bash
   npm run demo:proof
   ```
4. Copy the proof JSON

## Step 6: Submit Claim

Paste the proof into the text area and click **Submit Claim**.

## Expected Result

- Transaction succeeds
- Nullifier recorded on-chain
- `claim` event emitted
- Explorer shows only `amount`, `nullifier`, and `proof` — no name, no other employees
