import {AptosClient, HexString, TransactionBuilderABI} from "aptos";
import {DEPLOYED_ADDRESS, DEV_URL} from "../constants";
import fs from "fs";
import * as path from "path";
import {loadDeployedAccount} from "../utils";

(async function () {
    const client = new AptosClient(DEV_URL);
    const publishBalanceABIs = fs.readFileSync(path.join(__dirname, "./abis/publish_balance.abi"), "hex");
    const builder = new TransactionBuilderABI([new HexString(publishBalanceABIs).toUint8Array()])
    const payload = builder.buildTransactionPayload(
        `${DEPLOYED_ADDRESS}::basic_coin::publish_balance`,
        [],
        [],
    );
    const rawTx = await client.generateRawTransaction(new HexString(DEPLOYED_ADDRESS), payload);
    const deployedAccount = loadDeployedAccount();
    const bcsTxn = AptosClient.generateBCSTransaction(deployedAccount, rawTx);
    const transactionRes = await client.submitSignedBCSTransaction(bcsTxn);
    await client.waitForTransaction(transactionRes.hash);
})()