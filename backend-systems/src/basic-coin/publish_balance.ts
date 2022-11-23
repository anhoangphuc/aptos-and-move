import {AptosClient, HexString, TransactionBuilderABI} from "aptos";
import {DEPLOYED_ADDRESS, client} from "../constants";
import fs from "fs";
import path from "path";
import { loadRandomAccount} from "../utils";

(async function () {
    const publishBalanceABIs = fs.readFileSync(path.join(__dirname, "./abis/publish_balance.abi"), "hex");
    const builder = new TransactionBuilderABI([new HexString(publishBalanceABIs).toUint8Array()])
    const payload = builder.buildTransactionPayload(
        `${DEPLOYED_ADDRESS}::basic_coin::publish_balance`,
        [],
        [],
    );
    const randomAccount = await loadRandomAccount();
    const rawTx = await client.generateRawTransaction(randomAccount.address(), payload);
    const balanceResource = `${DEPLOYED_ADDRESS}::basic_coin::Balance`;
    console.log(`Random account is ${randomAccount.address()}`);
    let resources = await client.getAccountResources(randomAccount.address());
    let isExist = resources.some((resource) => resource.type === balanceResource);
    console.log(`Account ${randomAccount.address()} ${isExist ? 'has' : 'doesnt have'} ' resource`);
    const bcsTxn = AptosClient.generateBCSTransaction(randomAccount, rawTx);
    const transactionRes = await client.submitSignedBCSTransaction(bcsTxn);
    await client.waitForTransaction(transactionRes.hash);
    resources = await client.getAccountResources(randomAccount.address());
    isExist = resources.some((resource) => resource.type === balanceResource);
    console.log(`Account ${randomAccount.address()} ${isExist ? 'has' : 'doesnt have'} ' resource`);
    const balanceResourcesOfAccount = resources.filter((resource) => resource.type === balanceResource);
    if (balanceResourcesOfAccount.length > 0) {
        console.log(JSON.stringify(balanceResourcesOfAccount[0]));
    }
})()