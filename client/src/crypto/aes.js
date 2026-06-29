import {
  encoder,
  decoder,
  arrayBufferToBase64,
  base64ToArrayBuffer,
} from "./helpers";

// Generate a new AES-256 key
export const generateAESKey = async () => {
  return await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
};

// Export CryptoKey -> Base64
export const exportAESKey = async (key) => {
  const raw = await crypto.subtle.exportKey(
    "raw",
    key
  );

  return arrayBufferToBase64(raw);
};

// Import Base64 -> CryptoKey
export const importAESKey = async (
  base64Key
) => {
  const raw =
    base64ToArrayBuffer(base64Key);

  return await crypto.subtle.importKey(
    "raw",
    raw,
    {
      name: "AES-GCM",
    },
    true,
    ["encrypt", "decrypt"]
  );
};

// Encrypt Message
export const encryptMessage = async (
  message,
  key
) => {
  const iv = crypto.getRandomValues(
    new Uint8Array(12)
  );

  const encrypted =
    await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      encoder.encode(message)
    );

  return {
    encryptedContent:
      arrayBufferToBase64(encrypted),

    iv: arrayBufferToBase64(iv),
  };
};

// Decrypt Message
export const decryptMessage = async (
  encryptedContent,
  key,
  iv
) => {
  const decrypted =
    await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(
          base64ToArrayBuffer(iv)
        ),
      },
      key,
      base64ToArrayBuffer(
        encryptedContent
      )
    );

  return decoder.decode(decrypted);
};