"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
// Create a new keypair
let kp = web3_js_1.Keypair.generate();
console.log(`You have creater a new Solana wallet:
${kp.publicKey.toBase58()}
To save your wallet, copy and paste the following into a JSON file:
[${kp.secretKey}]`);
