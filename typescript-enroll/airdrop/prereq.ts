import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, WbaPrereq } from "./programs/wba_prereq";
import wallet from "./wba-wallet.json";

// Import your keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a connection to Solana Devnet
const connection = new Connection("https://api.devnet.solana.com");

// Create your Anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
    commitment: "confirmed"
});

// Create your program instance using the IDL
const program = new Program<WbaPrereq>(IDL, provider);

// Create the PDA for the prereq account
const enrollmentSeeds = [Buffer.from("prereq"), keypair.publicKey.toBuffer()];
const [enrollmentKey, _bump] = PublicKey.findProgramAddressSync(enrollmentSeeds, program.programId);

console.log("PDA for the prereq account:", enrollmentKey.toBase58());