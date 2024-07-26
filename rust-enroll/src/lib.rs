mod programs;
#[cfg(test)]
mod tests {
use std::str::FromStr;
use solana_client::rpc_client::RpcClient;
use solana_program::{
    pubkey::Pubkey,
    system_instruction::transfer, system_program
    };
use solana_sdk::{message::Message, signature::{read_keypair_file, Keypair, Signer}, transaction::Transaction};
use crate::programs::wba_prereq::{WbaPrereqProgram, CompleteArgs, UpdateArgs};
const RPC_URL: &str = "https://api.devnet.solana.com";


#[test]
fn keygen() {
// Create a new keypair and a new wallet with it
let kp = Keypair::new();
println!("You've generated a new Solana wallet: {}", kp.pubkey().to_string());
println!("");
println!("To save your wallet, copy and paste the following into a JSON file:");
println!("{:?}", kp.to_bytes());
}
#[test]
fn airdop() {
// Import our keypair
let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");
// Connected to Solana Devnet RPC Client
let client = RpcClient::new(RPC_URL);
// We're going to claim 2 devnet SOL tokens (2 billion lamports)
match client.request_airdrop(&keypair.pubkey(), 2_000_000_000u64) {
    Ok(s) => {
    println!("Success! Check out your TX here:");
    println!("https://explorer.solana.com/tx/{}?cluster=devnet", s.to_string());
    },
    Err(e) => println!("Oops, something went wrong: {}", e.to_string())
    };   
}
#[test]
fn transfer_sol() {
// Import our keypair
let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");
// Define our WBA public key
let to_pubkey = Pubkey::from_str("BatamKum8NLWDudXZxNEhkSaXPmRG2Z5gujMtnQKdY8B").unwrap();
// Create a Solana devnet connection
let rpc_client = RpcClient::new(RPC_URL);
// Get recent blockhash
let recent_blockhash = rpc_client
.get_latest_blockhash()
.expect("Failed to get recent blockhash");
//Transfer 0.1 SOL from our dev wallet to our WBA wallet adress and sign it
let transaction = Transaction::new_signed_with_payer(
    &[transfer(
    &keypair.pubkey(),
    &to_pubkey,
    1_000_000
    )],
    Some(&keypair.pubkey()),
    &vec![&keypair],
    recent_blockhash
    );
// Send the transaction
let signature = rpc_client
.send_and_confirm_transaction(&transaction)
.expect("Failed to send transaction");
// Print our transaction out
println!(
    "Success! Check out your TX here:
    https://explorer.solana.com/tx/{}/?cluster=devnet",
    signature
    );
}
#[test]
fn transfer_all() {
// Import our keypair
let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");
// Define our WBA public key
let to_pubkey = Pubkey::from_str("BatamKum8NLWDudXZxNEhkSaXPmRG2Z5gujMtnQKdY8B").unwrap();
// Create a Solana devnet connection
let rpc_client = RpcClient::new(RPC_URL);
// Get recent blockhash
let recent_blockhash = rpc_client
.get_latest_blockhash()
.expect("Failed to get recent blockhash");
// Get balance of dev wallet
let balance = rpc_client
.get_balance(&keypair.pubkey())
.expect("Failed to get balance");

// Create a test transaction to calculate fees
let message = Message::new_with_blockhash(
    &[transfer(
    &keypair.pubkey(),
    &to_pubkey,
    balance,
    )],
    Some(&keypair.pubkey()),
    &recent_blockhash
    );
// Calculate exact fee rate to transfer entire SOL amount out of account minus fees
let fee = rpc_client
.get_fee_for_message(&message)
.expect("Failed to get fee calculator");

// Deduct fee from lamports amount and create a TX with correct balance
let transaction = Transaction::new_signed_with_payer(
    &[transfer(
    &keypair.pubkey(),
    &to_pubkey,
    balance - fee,
    )],
    Some(&keypair.pubkey()),
    &vec![&keypair],
    recent_blockhash
    );
// Send the transaction
let signature = rpc_client
.send_and_confirm_transaction(&transaction)
.expect("Failed to send transaction");
// Print our transaction out
println!(
    "Success! Check out your TX here:
    https://explorer.solana.com/tx/{}/?cluster=devnet",
    signature
    );
}

#[test]
fn enroll_program() {
    // Create a Solana devnet connection
let rpc_client = RpcClient::new(RPC_URL);

// Let's define our accounts
let signer = read_keypair_file("wba-wallet.json").expect("Couldn't find wallet file");

// Creating a PDA for our prereq account, basically, this code will combine the adress program and the public key of the signer to create another array of u8 arrays and combined with the program ID will create the adress for the prereq account
let prereq = WbaPrereqProgram::derive_program_address(&[b"prereq",
signer.pubkey().to_bytes().as_ref()]);

// The block below will finally execute the enroll transaction

// Define our instruction data
let args = CompleteArgs {
    github: b"testaccount".to_vec()
    };
    
// Get recent blockhash (To publish our transaction, as we last time, we need a recent block hash)
let blockhash = rpc_client
.get_latest_blockhash()
.expect("Failed to get recent blockhash");

// Now we can invoke the "complete" function (To populate our complete function that is declared in)
let transaction = WbaPrereqProgram::complete(
    &[&signer.pubkey(), &prereq, &system_program::id()],
    &args,
    Some(&signer.pubkey()),
    &[&signer],
    blockhash
    );
    
    // Send the transaction
let signature = rpc_client
.send_and_confirm_transaction(&transaction)
.expect("Failed to send transaction");
// Print our transaction out
println!(
    "Success! Check out your TX here:
    https://explorer.solana.com/tx/{}/?cluster=devnet",
    signature
    );

}

}


