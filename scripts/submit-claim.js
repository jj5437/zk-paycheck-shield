const {
  Keypair,
  TransactionBuilder,
  Contract,
  nativeToScVal,
  xdr,
  Networks,
  rpc,
} = require('@stellar/stellar-sdk');
const fs = require('fs');

const SECRET_KEY = 'SBECHZFQ3LPFBGQDKUBIJSCYXDQOFKICXCF7SCZDLJNEWK5TRCQELIDP';
const PAYROLL_ID = 'CDFGZNOBM2Y3P3LHY6MGURLXUEPVIPTX5EY5NGH3OLK6QQUZFJINWKLL';
const RPC_URL = 'https://soroban-testnet.stellar.org';

async function main() {
  // Generate keypair from seed phrase
  const kp = Keypair.fromSecret(SECRET_KEY);
  console.log('Address:', kp.publicKey());

  // Load proof
  const proof = JSON.parse(fs.readFileSync('circuits/demo_proof.json', 'utf8'));

  function fieldToBytes(fieldStr, len = 32) {
    const hex = BigInt(fieldStr).toString(16).padStart(len * 2, '0');
    return Buffer.from(hex, 'hex');
  }

  const pi_a = Buffer.concat([
    fieldToBytes(proof.pi_a[0]),
    fieldToBytes(proof.pi_a[1]),
  ]);

  const pi_b = Buffer.concat([
    fieldToBytes(proof.pi_b[0][1]), // x.c0
    fieldToBytes(proof.pi_b[0][0]), // x.c1
    fieldToBytes(proof.pi_b[1][1]), // y.c0
    fieldToBytes(proof.pi_b[1][0]), // y.c1
  ]);

  const pi_c = Buffer.concat([
    fieldToBytes(proof.pi_c[0]),
    fieldToBytes(proof.pi_c[1]),
  ]);

  const nullifier = fieldToBytes('10941033643596869018319331680733498030047688207189912058218674328483190264336');

  console.log('pi_a length:', pi_a.length);
  console.log('pi_b length:', pi_b.length);
  console.log('pi_c length:', pi_c.length);
  console.log('nullifier length:', nullifier.length);

  // Connect to RPC
  const server = new rpc.Server(RPC_URL);

  // Load account
  const account = await server.getAccount(kp.publicKey());

  // Build transaction
  const contract = new Contract(PAYROLL_ID);
  const tx = new TransactionBuilder(account, {
    fee: '1000000',
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      contract.call(
        'claim',
        nativeToScVal(1000, { type: 'i128' }),
        nativeToScVal(nullifier, { type: 'bytes' }),
        nativeToScVal(pi_a, { type: 'bytes' }),
        nativeToScVal(pi_b, { type: 'bytes' }),
        nativeToScVal(pi_c, { type: 'bytes' }),
      )
    )
    .setTimeout(30)
    .build();

  // Simulate
  console.log('Simulating transaction...');
  const simResult = await server.simulateTransaction(tx);
  console.log('Simulation result:', JSON.stringify(simResult, null, 2));

  if (rpc.Api.isSimulationSuccess(simResult)) {
    // Sign and submit
    const preparedTx = rpc.assembleTransaction(tx, simResult).build();
    preparedTx.sign(kp);

    console.log('Submitting transaction...');
    const sendResult = await server.sendTransaction(preparedTx);
    console.log('Submit result:', JSON.stringify(sendResult, null, 2));

    // Poll for result
    if (sendResult.status === 'PENDING') {
      console.log('Polling for transaction result...');
      let result;
      for (let i = 0; i < 10; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        result = await server.getTransaction(sendResult.hash);
        if (result.status !== 'NOT_FOUND') {
          console.log('Transaction result:', JSON.stringify(result, null, 2));
          break;
        }
      }
    }
  } else {
    console.error('Simulation failed:', simResult);
  }
}

main().catch(console.error);
