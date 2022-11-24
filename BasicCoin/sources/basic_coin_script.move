module NamedAddr::basic_coin_script {
    use NamedAddr::basic_coin;

    public entry fun transfer(from: &signer, to: address, amount: u64) {
        basic_coin::transfer(from, to, amount);
    }
}