import {AptosAccount, HexString, TransactionBuilderABI} from "aptos";
import fs from "fs";
import path from "path";
import {client, GENERIC_ADDRESS} from "../constants";
import {loadGenericAccount, loadRandomAccount} from "../utils";
import {setAndMint} from "./set_and_mint";

export async function transfer(from: AptosAccount, to: AptosAccount, amount: number) {
    console.log(`Transfer ${amount} from ${from.address()} to ${to.address()}`);
    const transferABI = fs.readFileSync(path.join(__dirname, "./abis/transfer.abi"), 'hex');
    const builder = new TransactionBuilderABI([new HexString(transferABI).toUint8Array()]);
    const payload = builder.buildTransactionPayload(
        `${GENERIC_ADDRESS}::odd_coin::transfer`,
        [],
        [to.address(), amount],
    );

    const txn = await client.generateSignSubmitTransaction(from, payload);
    await client.waitForTransaction(txn);
    const txnDetails = await client.getTransactionByHash(txn);
    console.log(txnDetails['vm_status'])
    console.log(`--------------------------------------------------`);
}

async function main() {
    const from = await loadRandomAccount();
    const to = await loadRandomAccount();
    const moduleAccount = await loadGenericAccount();
    await setAndMint(from, moduleAccount, 10000);
    await setAndMint(to, moduleAccount, 100);
    await transfer(from, to, 21);
    await transfer(from, to, 20);
}

if (require.main === module) {
    main();
}