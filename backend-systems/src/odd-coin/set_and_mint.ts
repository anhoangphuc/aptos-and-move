import {AptosAccount, BCS, HexString, TransactionBuilder, TransactionBuilderABI, TxnBuilderTypes} from "aptos";
import fs from "fs";
import path from "path";
import {client, GENERIC_ADDRESS} from "../constants";
import {loadGenericAccount, loadRandomAccount} from "../utils";
const {
    MultiAgentRawTransaction,
    AccountAddress,
    Ed25519Signature,
    AccountAuthenticatorEd25519,
    Ed25519PublicKey,
    TransactionAuthenticatorMultiAgent,
    SignedTransaction,
} = TxnBuilderTypes;

export async function setAndMint(account: AptosAccount, moduleAccount: AptosAccount, amount: number) {
    console.log(`Set balance for account ${account.address()} and amount ${amount}`);
    const setAndMintABI = fs.readFileSync(path.join(__dirname, "./abis/set_and_mint.abi"), "hex");
    const builder = new TransactionBuilderABI([new HexString(setAndMintABI).toUint8Array()]);
    const payload = builder.buildTransactionPayload(
        `${GENERIC_ADDRESS}::odd_coin::set_and_mint`,
        [],
        [amount],
    );
    const rawTxn = await client.generateRawTransaction(account.address(), payload);
    const multiAgentTxn = new MultiAgentRawTransaction(rawTxn, [
        AccountAddress.fromHex(moduleAccount.address()),
    ])

    const senderSignature = new Ed25519Signature(
        account.signBuffer(TransactionBuilder.getSigningMessage(multiAgentTxn)).toUint8Array(),
    )
    const senderAuthenticator = new AccountAuthenticatorEd25519(
        new Ed25519PublicKey(account.signingKey.publicKey),
        senderSignature,
    );

    const moduleOwnerSignature = new Ed25519Signature(
        moduleAccount.signBuffer(TransactionBuilder.getSigningMessage(multiAgentTxn)).toUint8Array(),
    )

    const moduleOwnerAuthenticator = new AccountAuthenticatorEd25519(
        new Ed25519PublicKey(moduleAccount.signingKey.publicKey),
        moduleOwnerSignature,
    );

    const multiAgentAuthenticator = new TransactionAuthenticatorMultiAgent(
        senderAuthenticator,
        [AccountAddress.fromHex(moduleAccount.address())],
        [moduleOwnerAuthenticator],
    )

    const bcsTxn = BCS.bcsToBytes(new SignedTransaction(rawTxn, multiAgentAuthenticator));
    const transactionRes = await client.submitSignedBCSTransaction(bcsTxn);
    await client.waitForTransaction(transactionRes.hash);
}

async function main() {
    const account = await loadRandomAccount();
    const moduleAccount = await loadGenericAccount();
    await setAndMint(account, moduleAccount, 100);
}

if (require.main === module) {
    main();
}

