# ZK Explanation

## Public vs Private Inputs

| Input | Type | Visibility | Purpose |
|---|---|---|---|
| root | Public | On-chain | Merkle root of all salary records |
| nullifier | Public | On-chain | Prevents double-claiming; derived from `Poseidon(name_hash)` |
| amount | Public | On-chain | Amount to claim (does not reveal recipient identity) |
| name_hash | Private | Local only | Employee identity; never leaves browser |
| pathElements | Private | Local only | Merkle proof siblings; reveals tree structure if exposed |
| pathIndices | Private | Local only | Left/right path through tree |

## Why Merkle Tree?

A Merkle Tree lets us commit to many records with a single 32-byte root. Proving inclusion requires only `log2(N)` sibling hashes, keeping the circuit small. For our demo with 4 leaves (height 2), only 2 sibling hashes are needed.

## Why Groth16 on BN254?

Stellar Protocol 25/26 provides native BN254 host functions (`g1_add`, `g1_mul`, `pairing_check`). This makes Groth16 verification extremely cheap (~12M CPU instructions, ~1,100 stroops).

## Nullifier Anti-Replay

Each employee's nullifier is deterministically derived from their `name_hash`. The contract records used nullifiers and rejects duplicates, ensuring each employee claims exactly once.

## Circuit Constraints

- Tree height: 2 (supports up to 4 leaves)
- Hash function: Poseidon (2-input)
- Constraint count: ~950 non-linear constraints
- Curve: BN254
