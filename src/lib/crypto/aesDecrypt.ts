import crypto from 'crypto';

/**
 * Decrypts AES-256-GCM encrypted data.
 *
 * @param {Buffer} key - The 32-byte decryption key.
 * @param {Buffer | string} ciphertext - The encrypted data.
 * @param {BufferEncoding} [inputEncoding='base64'] - Encoding type if `ciphertext` is a string.
 * @returns {Buffer} - The decrypted plaintext.
 * @throws {Error} - If decryption fails or the ciphertext is invalid.
 */
export function aesDecrypt(key: Buffer, ciphertext: Buffer | string, inputEncoding: BufferEncoding = 'base64'): Buffer {
  if (key.length !== 32) {
    throw new Error(`Invalid key length: expected 32 bytes, got ${key.length}`);
  }

  // Convert ciphertext to Buffer if it is a string
  const ciphertextBuffer = typeof ciphertext === 'string' ? Buffer.from(ciphertext, inputEncoding) : ciphertext;

  // Define nonce and tag sizes for AES-GCM
  const nonceSize = 12; // Standard nonce size for AES-GCM
  const tagSize = 16; // Standard authentication tag size

  if (ciphertextBuffer.length < nonceSize + tagSize) {
    throw new Error(
      `Ciphertext too short: expected at least ${nonceSize + tagSize} bytes, got ${ciphertextBuffer.length}`,
    );
  }

  // Extract nonce, encrypted data, and authentication tag
  const nonce = ciphertextBuffer.subarray(0, nonceSize);
  const encryptedData = ciphertextBuffer.subarray(nonceSize, ciphertextBuffer.length - tagSize);
  const tag = ciphertextBuffer.subarray(ciphertextBuffer.length - tagSize);

  try {
    // Create a decipher object using AES-256-GCM
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);

    // Set the authentication tag
    decipher.setAuthTag(tag);

    // Decrypt data
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed: ${error}`);
  }
}
