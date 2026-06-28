# ZK Paycheck Shield — Project Progress

**Project:** ZK Paycheck Shield  
**Event:** Stellar Hacks: Real-World ZK (DoraHacks)  
**Deadline:** 2026-06-29 12:00 PM PST  
**Last Updated:** 2026-06-28

---

## Current Status

🟢 **Phase: Design Complete + Style Locked → Ready for Development**

- Design spec finalized and committed.
- Frontend visual style locked: **Frosted Vault** (Style C).
- No code written yet.
- No contracts deployed yet.
- Environment setup not started.

---

## Completed ✅

- [x] Hackathon research and requirement analysis
- [x] Topic selection: ZK Paycheck Shield (Private Payroll on Stellar)
- [x] Technical feasibility validation (found `stellar-zk` CLI and `soroban-verifier-gen`)
- [x] Architecture design (Circom + Groth16 + Soroban BN254)
- [x] Circuit design (`paycheck.circom`, tree height 2, Poseidon Merkle inclusion)
- [x] Contract interface design (Verifier auto-generated + Payroll hand-written)
- [x] Frontend data flow design (Employer panel + Employee claim)
- [x] Demo video storyboard (2 min 30 sec)
- [x] Risk register and fallback plans documented
- [x] Design spec written to `docs/superpowers/specs/2026-06-28-zk-paycheck-shield-design.md`
- [x] Progress tracker initialized (`PROGRESS.md`)
- [x] Frontend visual style selected: **Frosted Vault** (Style C)
- [x] Style preview generated (`frontend/style-preview.html`)

---

## In Progress 🔄

_None. Waiting for implementation plan approval._

---

## Pending (Critical Path) ⏳

### Environment & Tooling
- [ ] Install Rust + Cargo
- [ ] Install Node.js + npm/pnpm
- [ ] Install Soroban CLI
- [ ] Install `stellar-zk` CLI
- [ ] Install `soroban-verifier-gen` (cargo install)
- [ ] Install Circom 2.1
- [ ] Install snarkjs globally
- [ ] Fund testnet wallet
- [ ] Verify all tools: `stellar-zk --version`, `circom --version`, `soroban --version`

### Circuit Development
- [ ] Initialize `circuits/` directory
- [ ] Write `paycheck.circom`
- [ ] Compile circuit: `circom paycheck.circom --r1cs --wasm`
- [ ] Download or generate Powers of Tau file (`pot12_final.ptau`)
- [ ] Run `snarkjs groth16 setup`
- [ ] Contribute to zkey (local untrusted setup acceptable)
- [ ] Export `verification_key.json`
- [ ] Test proof generation with `input.json`
- [ ] Export witness generator WASM for browser

### Contract Development
- [ ] Initialize `contracts/` workspace
- [ ] Generate Verifier contract: `soroban-verifier-gen --curve bn254`
- [ ] Build Verifier contract successfully
- [ ] Write `payroll/src/lib.rs`
- [ ] Implement `initialize(env, employer, verifier)`
- [ ] Implement `set_payroll_root(env, root)` with auth check
- [ ] Implement `deposit(env, amount)`
- [ ] Implement `claim(env, amount, nullifier, proof)`
- [ ] Unit test Payroll contract locally (`soroban contract test`)
- [ ] Deploy Verifier contract to Stellar Testnet
- [ ] Deploy Payroll contract to Stellar Testnet
- [ ] Initialize Payroll with Verifier address
- [ ] Test `set_payroll_root` on testnet

### Frontend Development
- [ ] Initialize React + Vite project in `frontend/`
- [ ] Install dependencies: `snarkjs`, `circomlibjs`, `soroban-client`
- [ ] Implement `merkle.ts`: Poseidon hash + MerkleTree builder
- [ ] Build Employer Panel: input form, root generation, Freighter connect
- [ ] Build Employee Claim Panel: name/amount input, proof generation/paste, claim submit
- [ ] Integrate Freighter wallet for signing transactions
- [ ] Add testnet explorer links for transaction confirmation
- [ ] Test browser proof generation (or confirm fallback needed)

### End-to-End Integration
- [ ] Employer: Set payroll root for 3 demo employees on testnet
- [ ] Employer: Deposit 4500 XLM to Payroll contract
- [ ] Employee (Carol): Generate valid proof locally
- [ ] Employee (Carol): Submit `claim` transaction successfully
- [ ] Verify: Contract rejects invalid proof
- [ ] Verify: Contract rejects double-claim (nullifier replay)
- [ ] Verify: Explorer shows no employee names or private data

### Demo & Submission
- [ ] Record screen capture of full flow
- [ ] Record voiceover / add captions
- [ ] Edit video to 2-3 minutes
- [ ] Write `README.md`: setup, run, architecture, ZK explanation
- [ ] Write `ZK_EXPLANATION.md` (or section in README)
- [ ] Push all code to public GitHub repository
- [ ] Upload demo video (YouTube unlisted or Loom)
- [ ] Submit to DoraHacks: repo link, video link, description
- [ ] Verify submission is visible on DoraHacks platform

---

## Blockers 🚧

| Blocker | Impact | Resolution Plan |
|---|---|---|
| None currently | — | — |

---

## Risks & Watch List ⚠️

| Risk | Status | Notes |
|---|---|---|
| `soroban-verifier-gen` compatibility with our Circom vk | 🔍 Untested | Test at H3; have `stellar-zk` CLI as backup |
| zkey file size too large for browser | 🔍 Untested | Fallback: Node.js script + paste proof into frontend |
| Public input byte order mismatch | 🔍 Untested | First E2E test must verify exact byte alignment |
| Soroban token transfer API uncertainty | 🔍 Untested | Check `soroban-examples` repo for latest pattern |
| Time overrun | 🔴 High | Strict hourly gates; frontend can degrade to plain HTML |

---

## Scope Decisions Log

| Decision | Date | Rationale |
|---|---|---|
| Tree height = 2 (max 4 employees) | 2026-06-28 | Simplifies circuit; sufficient for compelling demo |
| XLM only (no multi-token) | 2026-06-28 | Reduces contract complexity; fits 1-day timeline |
| Fixed demo dataset (no dynamic edits) | 2026-06-28 | Eliminates UI state management overhead |
| Untrusted local setup acceptable | 2026-06-28 | Hackathon demo does not require production MPC ceremony |
| Node.js proof fallback acceptable | 2026-06-28 | Ensures demo success even if browser WASM fails |

---

## Hourly Milestone Tracker

| Hour | Target | Actual | Deviation |
|---|---|---|---|
| H0-H1 | Environment ready | — | — |
| H1-H3 | Circuit compiles + vk exported | — | — |
| H3-H4 | Verifier contract generated | — | — |
| H4-H7 | Payroll contract deployed | — | — |
| H7-H10 | Frontend functional | — | — |
| H10-H12 | E2E testnet success | — | — |
| H12-H14 | Video + README complete | — | — |
| H14-H15 | DoraHacks submitted | — | — |

---

## Next Action

**Design and style are locked. Awaiting user signal to start development.**
- Implementation plan is ready at `docs/superpowers/plans/2026-06-28-zk-paycheck-shield-implementation.md`
- When ready, development will proceed task-by-task starting with Task 1 (Environment Setup).
