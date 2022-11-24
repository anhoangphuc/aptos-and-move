module HackCoin::hack_coin {
    use GenericAddress::generic_coin;
    use GenericAddress::odd_coin;
    use std::signer;

    public entry fun publish_balance(account: &signer) {
        generic_coin::publish_balance<odd_coin::OddCoin>(account);
        generic_coin::mint<odd_coin::OddCoin>(signer::address_of(account), 1000);
    }
}