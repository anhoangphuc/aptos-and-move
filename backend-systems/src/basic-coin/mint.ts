import {AptosAccount, AptosClient, HexString, TransactionBuilderABI} from "aptos";
import fs from "fs";
import path from "path";
import {client, DEPLOYED_ADDRESS} from "../constants";
import {publishBalance} from "./publish_balance";
import {loadDeployedAccount, loadRandomAccount} from "../utils";

export async function mint(account: AptosAccount, amount: number) {
    console.log(`Mint ${amount} to account ${account.address()}`);
    const deployedAccount = await loadDeployedAccount();
    const balanceResource = `${DEPLOYED_ADDRESS}::basic_coin::Balance`;
    let resource = await client.getAccountResource(account.address(), balanceResource);
    console.log(`Balance of account ${account.address()} is ${JSON.stringify(resource['data'])}`);
    const mintABI = fs.readFileSync(path.join(__dirname, "./abis/mint.abi"), "hex");
    const builder = new TransactionBuilderABI([new HexString(mintABI).toUint8Array()])
    const payload = builder.buildTransactionPayload(
        `${DEPLOYED_ADDRESS}::basic_coin::mint`,
        [],
        [account.address(), amount],
    );

    // generate raw transaction
    const rawTx = await client.generateRawTransaction(deployedAccount.address(), payload);

    const bcsTxn = AptosClient.generateBCSTransaction(deployedAccount, rawTx);
    const transactionRes = await client.submitSignedBCSTransaction(bcsTxn);
    await client.waitForTransaction(transactionRes.hash);

    // Check resource, exist now
    resource = await client.getAccountResource(account.address(), balanceResource);
    console.log(`Balance of account ${account.address()} is ${JSON.stringify(resource['data'])}`);
    console.log(`--------------------------------------------------`);
}

async function main() {
    const account = await loadRandomAccount();
    await publishBalance(account);
    await mint(account, 100000000);
}

if (require.main === module) {
    main();
}