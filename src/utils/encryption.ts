/**
 * Utility functions for file encryption and decryption using the Web Crypto API
 */

/**
 * Generates a new random AES-GCM encryption key
 * @returns Promise resolving to the generated CryptoKey
 */
export async function generateEncryptionKey(): Promise<CryptoKey> {
  // Generate a random encryption key for AES-GCM
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256, // 256-bit keys are very secure
    },
    true, // extractable - allows the key to be exported
    ["encrypt", "decrypt"] // key can be used for both encryption and decryption
  );
}

/**
 * Encrypts a file using AES-GCM encryption
 * @param file The file to encrypt
 * @param key The CryptoKey to use for encryption
 * @returns Promise resolving to the encrypted Blob
 */
export async function encryptFile(file: File, key: CryptoKey): Promise<Blob> {
  // For demonstration purposes, this is a simplified implementation
  // A real implementation would:
  // 1. Read the file as ArrayBuffer
  // 2. Generate a random IV (initialization vector)
  // 3. Use crypto.subtle.encrypt with AES-GCM
  // 4. Combine the IV and ciphertext into a single Blob
  
  // Read the file as an ArrayBuffer
  const fileBuffer = await readFileAsArrayBuffer(file);
  
  // Generate a random 12-byte IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt the file data using AES-GCM
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
      tagLength: 128, // Authentication tag length (128 is recommended)
    },
    key,
    fileBuffer
  );
  
  // Combine the IV and encrypted data
  const encryptedArray = new Uint8Array(iv.length + encryptedData.byteLength);
  encryptedArray.set(iv, 0);
  encryptedArray.set(new Uint8Array(encryptedData), iv.length);
  
  // Return as a Blob with the original file type
  return new Blob([encryptedArray], { type: file.type });
}

/**
 * Decrypts an encrypted file using AES-GCM
 * @param encryptedBlob The encrypted Blob to decrypt
 * @param key The CryptoKey to use for decryption
 * @returns Promise resolving to the decrypted Blob
 */
export async function decryptFile(encryptedBlob: Blob, key: CryptoKey): Promise<Blob> {
  // For demonstration purposes, this is a simplified implementation
  // A real implementation would:
  // 1. Extract the IV from the first 12 bytes
  // 2. Extract the ciphertext (the rest of the data)
  // 3. Use crypto.subtle.decrypt with AES-GCM
  // 4. Return the decrypted data as a Blob
  
  // Read the encrypted blob as an ArrayBuffer
  const encryptedBuffer = await readFileAsArrayBuffer(encryptedBlob);
  const encryptedArray = new Uint8Array(encryptedBuffer);
  
  // Extract the IV (first 12 bytes)
  const iv = encryptedArray.slice(0, 12);
  
  // Extract the ciphertext (everything after the IV)
  const ciphertext = encryptedArray.slice(12);
  
  // Decrypt the data
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
      tagLength: 128,
    },
    key,
    ciphertext
  );
  
  // Return as a Blob (maintaining the original type if available)
  return new Blob([decryptedBuffer], { type: encryptedBlob.type || 'application/octet-stream' });
}

/**
 * Reads a File or Blob as an ArrayBuffer
 * @param file The File or Blob to read
 * @returns Promise resolving to an ArrayBuffer containing the file data
 */
function readFileAsArrayBuffer(file: File | Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Exports a CryptoKey to a hex string
 * @param key The CryptoKey to export
 * @returns Promise resolving to a hex string representation of the key
 */
export async function exportKeyToHex(key: CryptoKey): Promise<string> {
  const rawKey = await window.crypto.subtle.exportKey('raw', key);
  return Array.from(new Uint8Array(rawKey))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Imports a key from a hex string
 * @param hexKey The hex string representation of the key
 * @returns Promise resolving to a CryptoKey
 */
export async function importKeyFromHex(hexKey: string): Promise<CryptoKey> {
  // Convert hex string to byte array
  const keyBytes = hexKey.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [];
  const keyBuffer = new Uint8Array(keyBytes).buffer;
  
  // Import the key
  return await window.crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}