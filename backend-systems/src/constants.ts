import {AptosClient, FaucetClient} from "aptos";

export const DEV_URL = "https://fullnode.devnet.aptoslabs.com";
export const FAUCET_DEV_URL = "https://faucet.devnet.aptoslabs.com";
export const DEPLOYED_ADDRESS = "0xc173b64e7e88fdf75907e1f237f9d53dc2c8b9fa2be82bea1ae32ecb5f9032ea";
export const DEPLOYED_ACCOUNT_PK = "7423faa52ce5fca5534efedf3633dc775f90234b98dce9124f1ecf3695a85322";
export const client = new AptosClient(DEV_URL);
export const faucetClient = new FaucetClient(DEV_URL, FAUCET_DEV_URL);