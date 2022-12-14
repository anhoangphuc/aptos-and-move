import {AptosClient, FaucetClient} from "aptos";

export const DEV_URL = "https://fullnode.devnet.aptoslabs.com";
export const FAUCET_DEV_URL = "https://faucet.devnet.aptoslabs.com";
export const DEPLOYED_ADDRESS = "0xc173b64e7e88fdf75907e1f237f9d53dc2c8b9fa2be82bea1ae32ecb5f9032ea";
export const DEPLOYED_ACCOUNT_PK = "7423faa52ce5fca5534efedf3633dc775f90234b98dce9124f1ecf3695a85322";
export const GENERIC_ADDRESS = "0xaa9d48ab497d61f8251072c82112e2adbe9748c5de1ad168664b402651a601c2";
export const GENERIC_ACCOUNT_PK = "2e7b734d03026f2e057941cb3e2d6a552066a2690937cdfc2733ecc46cbff1c9";
export const HACK_COIN_ADDRESS = "0xac411b3d35ec86f609f0c15abcc0521c343f86a3fbcdd3bb2400d6a9fd7f2f35";
export const HACK_COIN_ACCOUNT_PK = "a3fa52e5e0ff7df5bb4caa3ff38da0dccdf5b5c4624648f77bd37cec75a89cde";
export const client = new AptosClient(DEV_URL);
export const faucetClient = new FaucetClient(DEV_URL, FAUCET_DEV_URL);