import {
  generateRSAKeyPair,
  exportPublicKey,
  exportPrivateKey,
  importPublicKey,
  importPrivateKey,
  generateAESKey,
  encryptAESKey,
  decryptAESKey,
  encryptMessage,
  decryptMessage,
} from "./crypto";

(async () => {
  console.log("Generating RSA Keys...");

  const {
    publicKey,
    privateKey,
  } = await generateRSAKeyPair();

  const exportedPublic =
    await exportPublicKey(publicKey);

  const exportedPrivate =
    await exportPrivateKey(privateKey);

  const importedPublic =
    await importPublicKey(exportedPublic);

  const importedPrivate =
    await importPrivateKey(exportedPrivate);

  console.log("Generating AES Key...");

  const aesKey =
    await generateAESKey();

  const encryptedAES =
    await encryptAESKey(
      aesKey,
      importedPublic
    );

  const decryptedAES =
    await decryptAESKey(
      encryptedAES,
      importedPrivate
    );

  const {
    encryptedContent,
    iv,
  } = await encryptMessage(
    "Hello Puneet 🚀",
    decryptedAES
  );

  const message =
    await decryptMessage(
      encryptedContent,
      decryptedAES,
      iv
    );

  console.log(message);
})();