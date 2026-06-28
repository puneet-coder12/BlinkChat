import forge from "node-forge";

export const generateKeyPair = () => {
  const keyPair = forge.pki.rsa.generateKeyPair({
    bits: 2048,
  });

  return {
    publicKey: forge.pki.publicKeyToPem(
      keyPair.publicKey
    ),

    privateKey:
      forge.pki.privateKeyToPem(
        keyPair.privateKey
      ),
  };
};