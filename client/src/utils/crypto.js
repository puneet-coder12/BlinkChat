import forge from "node-forge";

export const generateKeyPair = () => {
  const keyPair =
    forge.pki.rsa.generateKeyPair({
      bits: 2048,
    });

  return {
    publicKey:
      forge.pki.publicKeyToPem(
        keyPair.publicKey
      ),

    privateKey:
      forge.pki.privateKeyToPem(
        keyPair.privateKey
      ),
  };
};


export const encryptAESKey = (
  aesKey,
  publicKey
) => {
  const publicKeyObj =
    forge.pki.publicKeyFromPem(
      publicKey
    );

  return forge.util.encode64(
    publicKeyObj.encrypt(aesKey)
  );
};

export const decryptAESKey = (
  encryptedKey,
  privateKey
) => {
  const privateKeyObj =
    forge.pki.privateKeyFromPem(
      privateKey
    );

  return privateKeyObj.decrypt(
    forge.util.decode64(
      encryptedKey
    )
  );
};