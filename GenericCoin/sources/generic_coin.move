module GenericAddress::generic_coin {
    use std::signer;

    const EINSUFFICIENT_BALANCE: u64 = 0;
    const EALREADY_HAS_BALANCE: u64 = 1;

    struct Coin<phantom CoinType> has store {
        value: u64,
    }

    struct Balance<phantom CoinType> has key {
        coin: Coin<CoinType>,
    }

    public fun publish_balance<CoinType>(account: &signer) {
        let empty_coin = Coin<CoinType> { value: 0};
        assert!(!exists<Balance<CoinType>>(signer::address_of(account)), EALREADY_HAS_BALANCE);
        move_to(account, Balance<CoinType> { coin: empty_coin });
    }

    public fun mint<CoinType: drop>(mint_addr: address, amount: u64, _withness: CoinType) acquires Balance {
        deposit<CoinType>(mint_addr, Coin<CoinType> { value: amount });
    }

    public fun transfer<CoinType: drop>(from: &signer, to: address, amount: u64, _witness: CoinType) acquires Balance {
        let check = withdraw<CoinType>(signer::address_of(from), amount);
        deposit<CoinType>(to, check);
    }

    public fun balance_of<CoinType>(owner: address): u64 acquires Balance {
        borrow_global<Balance<CoinType>>(owner).coin.value
    }

    fun withdraw<CoinType>(addr: address, amount: u64): Coin<CoinType> acquires Balance {
        let balance = balance_of<CoinType>(addr);
        assert!(balance >= amount, EINSUFFICIENT_BALANCE);
        let balance_ref = &mut borrow_global_mut<Balance<CoinType>>(addr).coin.value;
        *balance_ref = balance - amount;
        Coin<CoinType> { value: amount }
    }

    fun deposit<CoinType>(addr: address, check: Coin<CoinType>) acquires Balance {
        let balance = balance_of<CoinType>(addr);
        let balance_ref = &mut borrow_global_mut<Balance<CoinType>>(addr).coin.value;
        let Coin { value } = check;
        *balance_ref = balance + value;
    }
}