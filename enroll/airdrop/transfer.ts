import { Transaction, SystemProgram, Connection, Keypair,
    LAMPORTS_PER_SOL, sendAndConfirmTransaction, PublicKey } from
    "@solana/web3.js";

import wallet from "./dev-wallet.json";

// Import our dev wallet keypair from the wallet file
const from = Keypair.fromSecretKey(new Uint8Array(wallet));

// Define our WBA public key
const to = new
PublicKey("BatamKum8NLWDudXZxNEhkSaXPmRG2Z5gujMtnQKdY8B");

//Create a Solana devnet connection
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
    try {
    const transaction = new Transaction().add(
    SystemProgram.transfer({
    fromPubkey: from.publicKey,
    toPubkey: to,
    lamports: LAMPORTS_PER_SOL/100,
    })
    );
    transaction.recentBlockhash = (await
    
    connection.getLatestBlockhash('confirmed')).blockhash;
    
    transaction.feePayer = from.publicKey;
    // Sign transaction, broadcast, and confirm
    const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [from]
    
    );
    console.log(`Success! Check out your TX here:
    https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch(e) {
    console.error(`Oops, something went wrong: ${e}`)
    }
    })();

    (async () => {
        try {
          const balance = await connection.getBalance(from.publicKey);
          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: from.publicKey,
              toPubkey: to,
              lamports: balance,
            })
          );
          transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
          transaction.feePayer = from.publicKey;
      
          const fee = (await connection.getFeeForMessage(transaction.compileMessage(), 'confirmed')).value || 0;
          transaction.instructions.pop();
          transaction.add(
            SystemProgram.transfer({
              fromPubkey: from.publicKey,
              toPubkey: to,
              lamports: balance - fee,
            })
          );
      
          const signature = await sendAndConfirmTransaction(connection, transaction, [from]);
          console.log(`Sucesso! Veja sua TX aqui: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
        } catch (e) {
          console.error(`Erro: ${e}`);
        }
      })();

