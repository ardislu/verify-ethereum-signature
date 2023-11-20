import { Signature } from "npm:@noble/secp256k1@2.0.0";
import { keccak_256 } from "npm:@noble/hashes@1.3.2/sha3";

/**
 * Recovers the signing address from a given message and signature and compares it to the given address.
 * @param address A public address in hex (including "0x" prefix).
 * @param message The plaintext message that was signed.
 * @param signature The signature of the message in hex (including "0x" prefix).
 * @returns True if the given address matches the signing address and false otherwise.
 */
export function isValidSignature(
  address: string,
  message: string,
  signature: string,
): boolean {
  const signatureObj = Signature.fromCompact(signature.substring(2, 130))
    .addRecoveryBit(signature.slice(-2) === "1b" ? 0 : 1);

  // ERC-191
  const encodedMessage = new TextEncoder().encode(message);
  const personalMessage =
    `\x19Ethereum Signed Message:\n${encodedMessage.length}${message}`; // MUST use encodedMessage.length and not message.length
  const personalMessageHash = keccak_256(
    new TextEncoder().encode(personalMessage),
  );

  // Recover secp256k1 public key
  const signingPublicKey = signatureObj.recoverPublicKey(personalMessageHash);
  const serializedPublicKey = signingPublicKey.toRawBytes(false).slice(1); // MUST use uncompressed public key, AND drop the first byte (0x04)

  // The public address is the last 20 bytes of the keccak256 hash of the public key
  const signingAddress = `0x${
    [...keccak_256(serializedPublicKey).slice(-20)].map((v) =>
      v.toString(16).padStart(2, "0")
    ).join("")
  }`;

  return address.toLowerCase() === signingAddress.toLowerCase();
}
