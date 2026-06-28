pragma circom 2.1.0;
include "circomlib/poseidon.circom";

template TestPoseidon1() {
    signal input a;
    component hasher = Poseidon(1);
    hasher.inputs[0] <== a;
    signal output out <== hasher.out;
}

component main = TestPoseidon1();
