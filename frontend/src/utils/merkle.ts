import { buildPoseidon } from 'circomlibjs';

let poseidon: any = null;

export async function getPoseidon() {
  if (!poseidon) {
    poseidon = await buildPoseidon();
  }
  return poseidon;
}

export async function hashName(name: string): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const nameBytes = encoder.encode(name);
  // Simple hash-to-field: hash the string bytes, then poseidon
  const hashBuffer = await crypto.subtle.digest('SHA-256', nameBytes);
  const hashArray = new Uint8Array(hashBuffer);
  // Convert 32 bytes to a field element (simplified for demo)
  return hashArray;
}

export async function computeLeaf(name: string, amount: number): Promise<Uint8Array> {
  const p = await getPoseidon();
  const nameHash = await hashName(name);
  const amountBytes = new Uint8Array(32);
  const view = new DataView(amountBytes.buffer);
  view.setBigUint64(24, BigInt(amount), false); // big-endian
  const leaf = p([nameHash, amountBytes]);
  return new Uint8Array(leaf);
}

export async function buildMerkleTree(leaves: Uint8Array[]): Promise<{
  root: Uint8Array;
  paths: { elements: Uint8Array[]; indices: number[] }[];
}> {
  const p = await getPoseidon();

  // Pad to 4 leaves
  while (leaves.length < 4) {
    leaves.push(new Uint8Array(32));
  }

  // Level 1 hashes
  const level1: Uint8Array[] = [];
  for (let i = 0; i < leaves.length; i += 2) {
    const h = p([leaves[i], leaves[i + 1]]);
    level1.push(new Uint8Array(h));
  }

  // Root
  const rootHash = p([level1[0], level1[1]]);
  const root = new Uint8Array(rootHash);

  // Compute paths for each leaf
  const paths = leaves.map((_leaf, idx) => {
    const siblingIdx = idx % 2 === 0 ? idx + 1 : idx - 1;
    const parentIdx = Math.floor(idx / 2);
    const parentSiblingIdx = parentIdx % 2 === 0 ? parentIdx + 1 : parentIdx - 1;

    return {
      elements: [leaves[siblingIdx], level1[parentSiblingIdx]],
      indices: [idx % 2, parentIdx % 2],
    };
  });

  return { root, paths };
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}
