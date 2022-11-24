import {AptosAccount, AptosClient, HexString, TransactionBuilderABI} from "aptos";
import fs from "fs";
import path from "path";
import {client, DEPLOYED_ADDRESS} from "../constants";
import {loadRandomAccount} from "../utils";
import {publishBalance} from "../basic-coin/publish_balance";
import {mint} from "../basic-coin/mint";

export async function transfer(accountFrom: AptosAccount, accountTo: AptosAccount, amount: number) {
    console.log(`Transfer ${amount} from ${accountFrom.address()} to ${accountTo.address()}`);
    const balanceResource = `${DEPLOYED_ADDRESS}::basic_coin::Balance`;
    let resource = await client.getAccountResource(accountTo.address(), balanceResource);
    console.log(`Balance of account ${accountTo.address()} is ${JSON.stringify(resource['data'])}`);

    const transferABIs = fs.readFileSync(path.join(__dirname, "./abis/transfer.abi"), "hex");
    const builder = new TransactionBuilderABI([new HexString(transferABIs).toUint8Array()])
    const payload = builder.buildTransactionPayload(
        `${DEPLOYED_ADDRESS}::basic_coin_script::transfer`,
        [],
        [accountTo.address(), amount],
    );

    // generate raw transaction
    const rawTx = await client.generateRawTransaction(accountFrom.address(), payload);


    const bcsTxn = AptosClient.generateBCSTransaction(accountFrom, rawTx);
    const transactionRes = await client.submitSignedBCSTransaction(bcsTxn);
    await client.waitForTransaction(transactionRes.hash);

    // Check resource, exist now
    resource = await client.getAccountResource(accountTo.address(), balanceResource);
    console.log(`Balance of account ${accountTo.address()} is ${JSON.stringify(resource['data'])}`);

    resource = await client.getAccountResource(accountFrom.address(), balanceResource);
    console.log(`Balance of account ${accountFrom.address()} is ${JSON.stringify(resource['data'])}`);
    console.log(`--------------------------------------------------`);
}

async function main() {
    const accountFrom = await loadRandomAccount();
    const accountTo = await loadRandomAccount();
    await publishBalance(accountFrom);
    await publishBalance(accountTo);
    await mint(accountFrom, 100000000);
    await transfer(accountFrom, accountTo, 50000000);
}

if (require.main === module) {
    main();
}