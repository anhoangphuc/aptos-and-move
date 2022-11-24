module GenericAddress::odd_coin {
    use GenericAddress::generic_coin;
    use std::signer;

    const MODULE_OWNER: address = @GenericAddress;

    struct OddCoin has drop {}

    const ENOT_ODD: u64 = 0;
    const ENOT_MODULE_OWNER: u64 = 1;

    public entry fun set_and_mint(account: &signer, module_owner: &signer, amount: u64) {
        generic_coin::publish_balance<OddCoin>(account);
        assert!(signer::address_of(module_owner) == MODULE_OWNER, ENOT_MODULE_OWNER);
        generic_coin::mint<OddCoin>(signer::address_of(account), amount);
    }

    public entry fun transfer(from: &signer, to: address, amount: u64) {
        assert!(amount % 2 == 1, ENOT_ODD);
        generic_coin::transfer<OddCoin>(from, to, amount);
    }

    #[test(from = @0x42, to = @0x10, module_owner = @GenericAddress)]
    fun test_odd_success(from: signer, to: signer, module_owner: signer) {
        set_and_mint(&from, &module_owner, 42);
        set_and_mint(&to, &module_owner, 10);

        transfer(&from, @0x10, 7);

        assert!(generic_coin::balance_of<OddCoin>(@0x42) == 35, 0);
        assert!(generic_coin::balance_of<OddCoin>(@0x10) == 17, 1);
    }

    #[test(from = @0x42, to = @0x10, module_owner = @GenericAddress)]
    #[expected_failure]
    fun test_not_odg_failure(from: signer, to: signer, module_owner: signer) {
        set_and_mint(&from, &module_owner, 42);
        set_and_mint(&to, &module_owner, 10);

        transfer(&from, @0x10, 8);
    }
}