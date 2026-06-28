#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype,
    crypto::bn254::{Bn254Fr, Bn254G1Affine, Bn254G2Affine},
    Address, BytesN, Env, IntoVal, Map, Symbol, Vec,
};

#[contracttype]
#[derive(Clone)]
pub struct PayrollState {
    pub employer: Address,
    pub verifier: Address,
    pub root: Option<BytesN<32>>,
}

#[derive(Clone)]
#[contracttype]
pub struct Groth16Proof {
    pub a: Bn254G1Affine,
    pub b: Bn254G2Affine,
    pub c: Bn254G1Affine,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    Unauthorized = 3,
    RootNotSet = 4,
    ProofInvalid = 5,
    NullifierUsed = 6,
}

#[contract]
pub struct Payroll;

#[contractimpl]
impl Payroll {
    pub fn initialize(
        env: Env,
        employer: Address,
        verifier: Address,
    ) -> Result<(), Error> {
        if env.storage().instance().has(&Symbol::new(&env, "state")) {
            return Err(Error::AlreadyInitialized);
        }

        env.storage().instance().set(
            &Symbol::new(&env, "state"),
            &PayrollState {
                employer,
                verifier,
                root: None,
            },
        );

        Ok(())
    }

    pub fn set_payroll_root(env: Env, root: BytesN<32>) -> Result<(), Error> {
        let mut state: PayrollState = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "state"))
            .ok_or(Error::NotInitialized)?;

        state.employer.require_auth();
        state.root = Some(root.clone());

        env.storage().instance().set(&Symbol::new(&env, "state"),
            &state,
        );

        env.events().publish(
            (Symbol::new(&env, "set_payroll_root"),),
            root,
        );

        Ok(())
    }

    pub fn claim(
        env: Env,
        amount: i128,
        nullifier: BytesN<32>,
        pi_a: BytesN<64>,
        pi_b: BytesN<128>,
        pi_c: BytesN<64>,
    ) -> Result<(), Error> {
        let state: PayrollState = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "state"))
            .ok_or(Error::NotInitialized)?;

        let root = state.root.as_ref().ok_or(Error::RootNotSet)?;

        // Anti-replay check
        let nullifier_key = Symbol::new(&env, "nullifier");
        let mut used_nullifiers: Map<BytesN<32>, bool> = env
            .storage()
            .instance()
            .get(&nullifier_key)
            .unwrap_or(Map::new(&env));

        if used_nullifiers.get(nullifier.clone()).unwrap_or(false) {
            return Err(Error::NullifierUsed);
        }

        // Construct proof
        let proof = Groth16Proof {
            a: Bn254G1Affine::from_array(&env, &pi_a.to_array()),
            b: Bn254G2Affine::from_array(&env, &pi_b.to_array()),
            c: Bn254G1Affine::from_array(&env, &pi_c.to_array()),
        };

        // Construct public signals [amount, root, nullifier]
        let mut pub_signals = Vec::new(&env);

        // amount as Bn254Fr (32-byte big-endian)
        let mut amount_bytes = [0u8; 32];
        let amount_u64 = amount as u64;
        amount_bytes[24..32].copy_from_slice(&amount_u64.to_be_bytes());
        pub_signals.push_back(Bn254Fr::from_bytes(BytesN::from_array(&env, &amount_bytes)));

        // root as Bn254Fr
        pub_signals.push_back(Bn254Fr::from_bytes(root.clone()));

        // nullifier as Bn254Fr
        pub_signals.push_back(Bn254Fr::from_bytes(nullifier.clone()));

        // Call verifier contract
        let verify_result = env.invoke_contract::<bool>(
            &state.verifier,
            &Symbol::new(&env, "verify_proof"),
            (proof, pub_signals).into_val(&env),
        );

        if !verify_result {
            return Err(Error::ProofInvalid);
        }

        // Record nullifier
        used_nullifiers.set(nullifier.clone(), true);
        env.storage().instance().set(&nullifier_key, &used_nullifiers);

        // Emit claim event
        env.events().publish(
            (Symbol::new(&env, "claim"), env.current_contract_address()),
            (nullifier, amount),
        );

        Ok(())
    }

    pub fn get_root(env: Env) -> Result<Option<BytesN<32>>, Error> {
        let state: PayrollState = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "state"))
            .ok_or(Error::NotInitialized)?;
        Ok(state.root)
    }
}
