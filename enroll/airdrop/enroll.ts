import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, WbaPrereq } from "./programs/wba_prereq";
import wallet from "./wba-wallet.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// GitHub account as a buffer
const github = Buffer.from("necrobucther666", "utf8");


// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
    commitment: "confirmed",
});

// Define the program ID (replace with your actual program ID)
const programId = new PublicKey(IDL.address);


// Create our program
const program = new Program<WbaPrereq>(IDL, provider);

// Create the PDA for our enrollment account
const enrollment_seeds = [Buffer.from("prereq"), keypair.publicKey.toBuffer()];
const [enrollmentKey, _bump] = PublicKey.findProgramAddressSync(enrollment_seeds, programId);

// Execute our enrollment transaction
(async () => {
    try {
        const txhash = await program.methods
            .complete(github)
            .accounts({
                signer: keypair.publicKey,
                prereq: enrollmentKey,
                systemProgram: SystemProgram.programId
            })
            .signers([keypair])
            .rpc();
        console.log(`Success! Check out your TX here:
        https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();