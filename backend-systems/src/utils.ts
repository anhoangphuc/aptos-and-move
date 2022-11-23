import {AptosAccount} from "aptos";
import {DEPLOYED_ACCOUNT_PK} from "./constants";

export function loadDeployedAccount(): AptosAccount {
    return new AptosAccount(Uint8Array.from(Buffer.from(DEPLOYED_ACCOUNT_PK, 'hex')));
}