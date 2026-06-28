const snarkjs = require('snarkjs');
const fs = require('fs');
const path = require('path');

async function generateProof(input, wasmPath, zkeyPath) {
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    wasmPath,
    zkeyPath
  );

  return { proof, publicSignals };
}

// CLI usage
if (require.main === module) {
  const inputPath = process.argv[2] || 'circuits/input.json';
  const wasmPath = process.argv[3] || 'circuits/paycheck_js/paycheck.wasm';
  const zkeyPath = process.argv[4] || 'circuits/paycheck_final.zkey';

  const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  generateProof(input, wasmPath, zkeyPath)
    .then(({ proof, publicSignals }) => {
      fs.writeFileSync('proof.json', JSON.stringify(proof, null, 2));
      fs.writeFileSync('public.json', JSON.stringify(publicSignals, null, 2));
      console.log('Proof generated successfully.');
      console.log('Public signals:', publicSignals);
    })
    .catch((err) => {
      console.error('Proof generation failed:', err);
      process.exit(1);
    });
}

module.exports = { generateProof };
