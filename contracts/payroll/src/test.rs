#[cfg(test)]
mod test {
    use soroban_sdk::{testutils::Address as _, Address, Bytes, BytesN, Env};
    use crate::{Payroll, PayrollClient};

    #[test]
    fn test_initialize_and_set_root() {
        let env = Env::default();
        let contract_id = env.register_contract(None, Payroll);
        let client = PayrollClient::new(&env, &contract_id);

        let employer = Address::generate(&env);
        let verifier = Address::generate(&env);

        client.initialize(&employer, &verifier);

        let root = BytesN::from_array(&env, &[0u8; 32]);
        client.set_payroll_root(&root);

        assert_eq!(client.get_root(), Some(root));
    }
}
