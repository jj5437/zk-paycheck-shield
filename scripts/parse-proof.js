const fs = require('fs');

// Load proof
const proof = JSON.parse(fs.readFileSync('circuits/demo_proof.json', 'utf8'));
const publicSignals = JSON.parse(fs.readFileSync('circuits/demo_public.json', 'utf8'));

function fieldToBytes(fieldStr) {
  const hex = BigInt(fieldStr).toString(16).padStart(64, '0');
  const bytes = Buffer.from(hex, 'hex');
  return bytes;
}

// Parse proof components
const pi_a = Buffer.concat([
  fieldToBytes(proof.pi_a[0]),
  fieldToBytes(proof.pi_a[1]),
]);

const pi_b = Buffer.concat([
  fieldToBytes(proof.pi_b[1][1]), // x.c0
  fieldToBytes(proof.pi_b[0][1]), // x.c1
  fieldToBytes(proof.pi_b[1][0]), // y.c0
  fieldToBytes(proof.pi_b[0][0]), // y.c1
]);

const pi_c = Buffer.concat([
  fieldToBytes(proof.pi_c[0]),
  fieldToBytes(proof.pi_c[1]),
]);

console.log('pi_a length:', pi_a.length, 'hex:', pi_a.toString('hex'));
console.log('pi_b length:', pi_b.length, 'hex:', pi_b.toString('hex'));
console.log('pi_c length:', pi_c.length, 'hex:', pi_c.toString('hex'));
console.log('amount:', publicSignals[0]);
console.log('root:', publicSignals[1]);
console.log('nullifier:', publicSignals[2]);
