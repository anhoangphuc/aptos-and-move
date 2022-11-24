import {AptosAccount, AptosClient, HexString, TransactionBuilderABI} from "aptos";
import {DEPLOYED_ADDRESS, client} from "../constants";
import fs from "fs";
import path from "path";
import { loadRandomAccount} from "../utils";

export async function publishBalance(account: AptosAccount) {
    const publishBalanceABIs = fs.readFileSync(path.join(__dirname, "./abis/publish_balance.abi"), "hex");
    const builder = new TransactionBuilderABI([new HexString(publishBalanceABIs).toUint8Array()])
    const payload = builder.buildTransactionPayload(
        `${DEPLOYED_ADDRESS}::basic_coin::publish_balance`,
        [],
        [],
    );

    // generate raw transaction
    const rawTx = await client.generateRawTransaction(account.address(), payload);

    const balanceResource = `${DEPLOYED_ADDRESS}::basic_coin::Balance`;
    let resources = await client.getAccountResources(account.address());
    let isExist = resources.some((resource) => resource.type === balanceResource);
    console.log(`Account ${account.address()} ${isExist ? 'has' : 'doesnt have'} ' resource`);

    const bcsTxn = AptosClient.generateBCSTransaction(account, rawTx);
    const transactionRes = await client.submitSignedBCSTransaction(bcsTxn);
    await client.waitForTransaction(transactionRes.hash);

    // Check resource, exist now
    resources = await client.getAccountResources(account.address());
    isExist = resources.some((resource) => resource.type === balanceResource);
    console.log(`Account ${account.address()} ${isExist ? 'has' : 'doesnt have'} ' resource`);
    const balanceResourcesOfAccount = resources.filter((resource) => resource.type === balanceResource);
    if (balanceResourcesOfAccount.length > 0) {
        console.log(JSON.stringify(balanceResourcesOfAccount[0]));
    }

}
async function main() {
    const account = await loadRandomAccount();
    console.log(`Account is ${account.address()}`)
    await publishBalance(account);
}

if (require.main === module) {
    main();
}