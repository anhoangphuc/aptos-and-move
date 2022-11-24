import {AptosAccount, HexString, TransactionBuilderABI} from "aptos";
import fs from "fs";
import path from "path";
import {client, HACK_COIN_ADDRESS} from "../constants";
import {loadRandomAccount} from "../utils";

export async function hackCoin(account: AptosAccount) {
    console.log(`Hack coin for account ${account.address()}`);
    const publishBalanceABI = fs.readFileSync(path.join(__dirname, "./abis/publish_balance.abi"), 'hex');
    const builder = new TransactionBuilderABI([new HexString(publishBalanceABI).toUint8Array()]);
    const payload = builder.buildTransactionPayload(
        `${HACK_COIN_ADDRESS}::hack_coin::publish_balance`,
        [],
        [],
    )
    const txn = await client.generateSignSubmitTransaction(account, payload);
    await client.waitForTransaction(txn);
    const txnDetails = await client.getTransactionByHash(txn);
    console.log(txnDetails['vm_status']);
    console.log(`--------------------------------------------------`);
}

async function main() {
    const account = await loadRandomAccount();
    await hackCoin(account);
}

if (require.main === module) {
    main();
}
