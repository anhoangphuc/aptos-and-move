import {AptosClient} from "aptos";
import {DEV_URL} from "../constants";
import fs from "fs";
import * as path from "path";

(async function () {
    const client = new AptosClient(DEV_URL);
    const publishBalanceABIs = fs.readFileSync(path.join(__dirname, "./abis/publish_balance.abi"), "hex");
    console.log(publishBalanceABIs);
})()