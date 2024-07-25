import { Keypair } from "@solana/web3.js";

// Create a new keypair
let kp = Keypair.generate();

console.log(`You have creater a new Solana wallet:
${kp.publicKey.toBase58()}
To save your wallet, copy and paste the following into a JSON file:
[${kp.secretKey}]`);


