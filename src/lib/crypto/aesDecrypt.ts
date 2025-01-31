import crypto from 'crypto';

/**
 * Decrypts AES-encrypted data.
 * @param {Buffer} key - The decryption key (32 bytes).
 * @param {Buffer} ciphertext - The encrypted data.
 * @returns {Buffer} - The decrypted plaintext.
 * @throws {Error} - If decryption fails or the ciphertext is invalid.
 */
export function aesDecrypt(key: Buffer, ciphertext: Buffer): Buffer {
  if (key.length !== 32) {
    throw new Error('Key must be 32 bytes long.');
  }

  // Define the nonce size for AES-GCM (standard is 12 bytes)
  const nonceSize = 12;

  if (ciphertext.length < nonceSize) {
    throw new Error('Ciphertext too short.');
  }

  // Extract the nonce and the actual encrypted data
  const nonce = ciphertext.subarray(0, nonceSize);
  const encryptedData = ciphertext.subarray(nonceSize);

  // Extract the authentication tag (last 16 bytes of the encrypted data)
  const tag = encryptedData.subarray(encryptedData.length - 16);
  const encryptedText = encryptedData.subarray(0, encryptedData.length - 16);

  // Create a decipher object using AES-256-GCM
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);

  // Set the authentication tag on the decipher
  decipher.setAuthTag(tag);

  // Decrypt the data
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

  return decrypted;
}
