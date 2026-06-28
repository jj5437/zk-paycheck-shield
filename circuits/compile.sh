#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "[1/5] Compiling circuit..."
circom paycheck.circom --r1cs --wasm --sym -o .

echo "[2/5] Downloading powers of tau (pot12)..."
if [ ! -f pot12_final.ptau ]; then
  snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
  snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First" -v -e="random"
  snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
fi

echo "[3/5] Groth16 setup..."
snarkjs groth16 setup paycheck.r1cs pot12_final.ptau paycheck_0000.zkey -v

echo "[4/5] Contributing to zkey..."
snarkjs zkey contribute paycheck_0000.zkey paycheck_final.zkey --name="Contributor" -v -e="random"

echo "[5/5] Exporting verification key..."
snarkjs zkey export verificationkey paycheck_final.zkey verification_key.json

echo "Done. Outputs:"
ls -lh paycheck_js/paycheck.wasm paycheck_final.zkey verification_key.json
