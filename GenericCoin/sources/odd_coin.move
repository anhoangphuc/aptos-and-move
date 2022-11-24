module GenericAddress::odd_coin {
    use GenericAddress::generic_coin;
    use std::signer;

    struct OddCoin has drop {}

    const ENOT_ODD: u64 = 0;

    public fun set_and_mint(account: &signer, amount: u64) {
        generic_coin::publish_balance<OddCoin>(account);
        generic_coin::mint<OddCoin>(signer::address_of(account), amount);
    }

    public fun transfer(from: &signer, to: address, amount: u64) {
        assert!(amount % 2 == 1, ENOT_ODD);
        generic_coin::transfer<OddCoin>(from, to, amount);
    }

    #[test(from = @0x42, to = @0x10)]
    fun test_odd_success(from: signer, to: signer) {
        set_and_mint(&from, 42);
        set_and_mint(&to, 10);

        transfer(&from, @0x10, 7);

        assert!(generic_coin::balance_of<OddCoin>(@0x42) == 35, 0);
        assert!(generic_coin::balance_of<OddCoin>(@0x10) == 17, 1);
    }

    #[test(from = @0x42, to = @0x10)]
    #[expected_failure]
    fun test_not_odg_failure(from: signer, to: signer) {
        set_and_mint(&from, 42);
        set_and_mint(&to, 10);

        transfer(&from, @0x10, 8);
    }
}