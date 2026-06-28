#!/bin/bash
set -e

echo "=== ZK Paycheck Shield Environment Setup ==="

echo "[1/7] Checking Rust..."
rustc --version

echo "[2/7] Checking Node.js..."
node --version

echo "[3/7] Installing Soroban CLI..."
cargo install soroban-cli --locked
soroban --version

echo "[4/7] Installing stellar-zk CLI..."
cargo install stellar-zk
stellar-zk --version

echo "[5/7] Installing soroban-verifier-gen..."
cargo install soroban-verifier-gen
soroban-verifier-gen --help

echo "[6/7] Installing Circom..."
if ! command -v circom &> /dev/null; then
  cd /tmp
  git clone https://github.com/iden3/circom.git || true
  cd circom
  cargo build --release
  cargo install --path circom
fi
circom --version

echo "[7/7] Installing snarkjs..."
npm install -g snarkjs
snarkjs --version

echo "=== All tools installed successfully ==="
