script {
    use NamedAddr::basic_coin;

    // There are two ways to approach this problem
    // 1. Withdraw the total then distribute the pieces by breaking it up or
    // 2. Transfer for each amount individually
    fun main(sender: &signer, reciever_a: address, receiver_b: address, amount: u64) {
        assert!(amount % 2 == 0, 0);
        basic_coin::transfer(sender, reciever_a, amount / 2);
        basic_coin::transfer(sender, receiver_b, amount / 2);
    }
}
