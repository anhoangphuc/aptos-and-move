import {AptosAccount, AptosClient, HexString, TransactionBuilderABI, TxnBuilderTypes} from "aptos";
import fs from "fs";
import path from "path";
import {loadRandomAccount} from "../utils";
import {client} from "../constants";
import {publishBalance} from "../basic-coin/publish_balance";
import {mint} from "../basic-coin/mint";
const {
    TransactionPayloadScript,
    Script,
    TransactionArgumentAddress,
    TransactionArgumentU64,
    AccountAddress,
} = TxnBuilderTypes;

export async function splitTransfer(sender: AptosAccount, account1: AptosAccount, account2: AptosAccount, amount: number) {
    console.log(`Split transfer ${amount} from ${sender.address()} to ${account1.address()} and ${account2.address()}`)
    const splitTransferScriptBuilt = fs.readFileSync(path.join(__dirname, "./built/main.mv"), "hex");
    const payload = new TransactionPayloadScript(
        new Script(
            new HexString(splitTransferScriptBuilt).toUint8Array(),
            [],
            [
                new TransactionArgumentAddress(AccountAddress.fromHex(account1.address())),
                new TransactionArgumentAddress(AccountAddress.fromHex(account2.address())),
                new TransactionArgumentU64(BigInt(amount)),
            ],
        )
    );
    const txn = await client.generateSignSubmitWaitForTransaction(sender, payload);
    const transactionDetail = await client.getTransactionByHash(txn.hash);
    console.log(`Transaction status is ${transactionDetail['vm_status']}`);
    console.log(`--------------------------------------------------`);
}

async function main() {
    const [sender, account1, account2] = await Promise.all([
        loadRandomAccount(),
        loadRandomAccount(),
        loadRandomAccount(),
    ])
    await publishBalance(sender);
    await publishBalance(account1);
    await publishBalance(account2);

    await mint(sender, 100000000);
    await splitTransfer(sender, account1, account2, 100);
    await splitTransfer(sender, account1, account2, 99);
    await splitTransfer(sender, account1, account2, 100000000);
}

if (require.main === module) {
    main();
}