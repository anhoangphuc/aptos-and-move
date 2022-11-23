import {AptosAccount} from "aptos";
import {DEPLOYED_ACCOUNT_PK, faucetClient} from "./constants";

export function loadDeployedAccount(): AptosAccount {
    return new AptosAccount(Uint8Array.from(Buffer.from(DEPLOYED_ACCOUNT_PK, 'hex')));
}

export async function loadRandomAccount(): Promise<AptosAccount> {
    const account = new AptosAccount();
    await faucetClient.fundAccount(account.address(), 1000000000);
    return account;
}