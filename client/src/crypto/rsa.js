import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
} from "./helpers";

// Generate RSA Key Pair
export const generateRSAKeyPair =
  async () => {
    return await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([
          1, 0, 1,
        ]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );
  };

  export const exportPublicKey =
  async (publicKey) => {
    const spki =
      await crypto.subtle.exportKey(
        "spki",
        publicKey
      );

    return arrayBufferToBase64(spki);
  };

  export const exportPrivateKey =
  async (privateKey) => {
    const pkcs8 =
      await crypto.subtle.exportKey(
        "pkcs8",
        privateKey
      );

    return arrayBufferToBase64(pkcs8);
  };

  export const importPublicKey =
  async (base64) => {
    return await crypto.subtle.importKey(
      "spki",
      base64ToArrayBuffer(base64),
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"]
    );
  };

  export const importPrivateKey =
  async (base64) => {
    return await crypto.subtle.importKey(
      "pkcs8",
      base64ToArrayBuffer(base64),
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["decrypt"]
    );
  };

  export const encryptAESKey =
  async (aesKey, publicKey) => {
    const exportedAES =
      await crypto.subtle.exportKey(
        "raw",
        aesKey
      );

    const encrypted =
      await crypto.subtle.encrypt(
        {
          name: "RSA-OAEP",
        },
        publicKey,
        exportedAES
      );

    return arrayBufferToBase64(
      encrypted
    );
  };

  export const decryptAESKey =
  async (
    encryptedAES,
    privateKey
  ) => {
    const decrypted =
      await crypto.subtle.decrypt(
        {
          name: "RSA-OAEP",
        },
        privateKey,
        base64ToArrayBuffer(
          encryptedAES
        )
      );

    return await crypto.subtle.importKey(
      "raw",
      decrypted,
      {
        name: "AES-GCM",
      },
      true,
      ["encrypt", "decrypt"]
    );
  };