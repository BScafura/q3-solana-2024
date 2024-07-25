"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bs58_1 = __importDefault(require("bs58"));
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const promptSync = (0, prompt_sync_1.default)();
function convertPrivateKey() {
    const privateKeyBase58 = promptSync('Enter your private key in base58 format: ');
    // Decode the base58 string to a byte array
    const privateKeyBytes = bs58_1.default.decode(privateKeyBase58);
    console.log('Private Key (Byte Array):', privateKeyBytes);
    // Encode the byte array back to base58
    const encodedPrivateKey = bs58_1.default.encode(privateKeyBytes);
    console.log('Private Key (Base58):', encodedPrivateKey);
}
convertPrivateKey();
