pragma circom 2.1.0;
include "circomlib/poseidon.circom";

template TestPoseidon() {
    signal input a;
    signal input b;
    component hasher = Poseidon(2);
    hasher.inputs[0] <== a;
    hasher.inputs[1] <== b;
    signal output out <== hasher.out;
}

component main = TestPoseidon();
