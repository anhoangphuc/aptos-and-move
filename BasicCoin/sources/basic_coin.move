module NamedAddr::basic_coin {
    use std::signer;

    const MODULE_OWNER: address = @NamedAddr;

    const ENOT_MODULE_OWNER: u64 = 0;
    const EINSUFFICIENT_BALANCE: u64 = 1;
    const EALREADY_HAS_BALANCE: u64 = 2;

    struct Coin has store {
        value: u64,
    }

    struct Balance has key {
        coin: Coin,
    }

    /// Publish an empty balance resource under `account`'s address. This function must be called
    /// before minting or transferring to this account
    public entry fun publish_balance(account: &signer) {
        let empty_coin = Coin { value: 0 };
        assert!(!exists<Balance>(signer::address_of(account)), EALREADY_HAS_BALANCE);
        move_to(account, Balance { coin: empty_coin });
    }

    public fun balance_of(owner: address): u64 acquires Balance {
        borrow_global<Balance>(owner).coin.value
    }

    /// Mint `amount` tokens to `mint_addr`. Mint must be approved by the module owner
    public entry fun mint(module_owner: &signer, mint_addr: address, amount: u64) acquires Balance {
        assert!(signer::address_of(module_owner) == MODULE_OWNER, ENOT_MODULE_OWNER);
        deposit(mint_addr, Coin { value: amount });
    }

    /// Transfer `amount` of tokens from `from` to `to`
    public fun transfer(from: &signer, to: address, amount: u64) acquires Balance {
        let check = withdraw(signer::address_of(from), amount);
        deposit(to, check);
    }

    /// Withdraw `amount` number of tokens from the balance under `addr`
   fun withdraw(addr: address, amount: u64): Coin acquires Balance {
        let balance = balance_of(addr);
        assert!(balance >= amount, EINSUFFICIENT_BALANCE);
        let balance_ref = &mut borrow_global_mut<Balance>(addr).coin.value;
        *balance_ref = balance - amount;
        Coin { value: amount }
   }

    /// Deposit `amount` number of tokens to the balance under `addr`
    fun deposit(addr: address, check: Coin) acquires Balance {
        let balance = balance_of(addr);
        let balance_ref = &mut borrow_global_mut<Balance>(addr).coin.value;
        let Coin { value } = check;
        *balance_ref = balance + value;
    }

    #[test(account = @0x1)]
    #[expected_failure(abort_code = 0)]
    fun mint_non_owner(account: signer) acquires Balance{
        publish_balance(&account);
        mint(&account, @0x1, 10);
    }

    #[test(account = @NamedAddr)]
    fun mint_check_balance(account: signer) acquires Balance {
        let addr = signer::address_of(&account);
        publish_balance(&account);
        mint(&account, addr, 42);
        assert!(balance_of(addr) == 42, 0);
    }

    #[test(account = @0x1)]
    fun publish_balance_has_zero(account: signer) acquires Balance{
        let addr = signer::address_of(&account);
        publish_balance(&account);
        assert!(balance_of(addr) == 0, 0);
    }

    #[test(account = @0x1)]
    #[expected_failure(abort_code = 2)]
    fun publish_balance_already_exists(account: signer) {
        publish_balance(&account);
        publish_balance(&account);
    }

    #[test]
    #[expected_failure]
    fun balance_of_dne() acquires Balance{
        balance_of(@0x1);
    }

    #[test]
    #[expected_failure]
    fun withdraw_dne() acquires Balance {
        Coin { value: _} = withdraw(@0x1, 1);
    }

    #[test(account = @0x1)]
    #[expected_failure]
    fun withdraw_too_much(account: signer) acquires Balance {
        let addr = signer::address_of(&account);
        publish_balance(&account);
        Coin { value: _ } = withdraw(addr, 1)
    }


    #[test(account = @NamedAddr)]
    fun can_withdraw_amount(account: signer) acquires Balance {
        publish_balance(&account);
        let amount = 1000;
        let addr = signer::address_of(&account);
        mint(&account, addr, amount);
        let Coin { value } = withdraw(addr, amount);
        assert!(value == amount, 0);
    }
}