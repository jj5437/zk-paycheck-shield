const snarkjs = require('snarkjs');
const fs = require('fs');
const crypto = require('crypto');

// BN254 field prime
const P = 21888242871839275222246405745257275088548364400416034343698204186575808495617n;

async function poseidon2(a, b, wasmPath) {
  const input = { a: a.toString(), b: b.toString() };
  await snarkjs.wtns.calculate(input, wasmPath, 'tmp.wtns');
  const witness = await snarkjs.wtns.exportJson('tmp.wtns');
  return BigInt(witness[1]);
}

async function poseidon1(a, wasmPath) {
  const input = { a: a.toString() };
  await snarkjs.wtns.calculate(input, wasmPath, 'tmp.wtns');
  const witness = await snarkjs.wtns.exportJson('tmp.wtns');
  return BigInt(witness[1]);
}

async function main() {
  const wasmPath2 = 'circuits/test_poseidon_js/test_poseidon.wasm';
  const wasmPath1 = 'circuits/test_poseidon1_js/test_poseidon1.wasm';

  // Demo employees
  const employees = [
    { name: 'Alice', amount: 1000 },
    { name: 'Bob', amount: 1500 },
    { name: 'Carol', amount: 2000 },
  ];

  function hashName(name) {
    const hash = crypto.createHash('sha256').update(name).digest();
    return BigInt('0x' + hash.toString('hex')) % P;
  }

  // Compute leaves: Poseidon(name_hash, amount)
  const leaves = [];
  for (const emp of employees) {
    const nameHash = hashName(emp.name);
    const leaf = await poseidon2(nameHash, BigInt(emp.amount), wasmPath2);
    leaves.push(leaf);
  }

  // Pad to 4 leaves
  while (leaves.length < 4) {
    leaves.push(0n);
  }

  // Level 1 hashes
  const level1 = [];
  for (let i = 0; i < leaves.length; i += 2) {
    const h = await poseidon2(leaves[i], leaves[i + 1], wasmPath2);
    level1.push(h);
  }

  // Root
  const root = await poseidon2(level1[0], level1[1], wasmPath2);

  // Compute paths
  const paths = leaves.map((leaf, idx) => {
    const siblingIdx = idx % 2 === 0 ? idx + 1 : idx - 1;
    const parentIdx = Math.floor(idx / 2);
    const parentSiblingIdx = parentIdx % 2 === 0 ? parentIdx + 1 : parentIdx - 1;

    return {
      elements: [leaves[siblingIdx], level1[parentSiblingIdx]],
      indices: [idx % 2, parentIdx % 2],
    };
  });

  // Generate input for Carol (idx 2)
  const carolIdx = 2;
  const carolPath = paths[carolIdx];
  const carolNameHash = hashName('Carol');

  // nullifier = Poseidon(name_hash) using Poseidon(1)
  const nullifier = await poseidon1(carolNameHash, wasmPath1);

  const input = {
    name_hash: carolNameHash.toString(),
    amount: '2000',
    pathElements: [
      carolPath.elements[0].toString(),
      carolPath.elements[1].toString(),
    ],
    pathIndices: carolPath.indices,
    root: root.toString(),
    nullifier: nullifier.toString(),
  };

  fs.writeFileSync('circuits/demo_input.json', JSON.stringify(input, null, 2));

  console.log('Root (decimal):', root.toString());
  console.log('Root (hex):', root.toString(16).padStart(64, '0'));
  console.log('Nullifier (decimal):', nullifier.toString());
  console.log('Input written to circuits/demo_input.json');

  // Cleanup
  if (fs.existsSync('tmp.wtns')) fs.unlinkSync('tmp.wtns');
}

main().catch(console.error);
