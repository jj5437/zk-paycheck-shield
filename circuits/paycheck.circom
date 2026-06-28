pragma circom 2.1.0;

include "circomlib/poseidon.circom";
include "circomlib/mux1.circom";
include "circomlib/comparators.circom";

template PaycheckProof(levels) {
    signal input name_hash;
    signal input amount;
    signal input pathElements[levels];
    signal input pathIndices[levels];

    signal input root;
    signal input nullifier;

    // 1. leaf = Poseidon(name_hash, amount)
    component leafHasher = Poseidon(2);
    leafHasher.inputs[0] <== name_hash;
    leafHasher.inputs[1] <== amount;
    signal leaf <== leafHasher.out;

    // 2. Verify Merkle inclusion using Mux1 for quadratic constraints
    component hashers[levels];
    component muxLeft[levels];
    component muxRight[levels];
    signal currentHash[levels + 1];
    currentHash[0] <== leaf;

    for (var i = 0; i < levels; i++) {
        muxLeft[i] = Mux1();
        muxLeft[i].c[0] <== currentHash[i];
        muxLeft[i].c[1] <== pathElements[i];
        muxLeft[i].s <== pathIndices[i];

        muxRight[i] = Mux1();
        muxRight[i].c[0] <== pathElements[i];
        muxRight[i].c[1] <== currentHash[i];
        muxRight[i].s <== pathIndices[i];

        hashers[i] = Poseidon(2);
        hashers[i].inputs[0] <== muxLeft[i].out;
        hashers[i].inputs[1] <== muxRight[i].out;
        currentHash[i + 1] <== hashers[i].out;
    }

    root === currentHash[levels];

    // 3. amount != 0 check using IsZero
    component isZero = IsZero();
    isZero.in <== amount;
    isZero.out === 0;

    // 4. nullifier = Poseidon(name_hash)
    component nfHasher = Poseidon(1);
    nfHasher.inputs[0] <== name_hash;
    nullifier === nfHasher.out;
}

component main {public [root, nullifier, amount]} = PaycheckProof(2);
