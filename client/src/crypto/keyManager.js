const PRIVATE_KEY = "privateKey";
const PUBLIC_KEY = "publicKey";

// Save Keys
export const saveKeys = (
  publicKey,
  privateKey
) => {
  localStorage.setItem(
    PUBLIC_KEY,
    publicKey
  );

  localStorage.setItem(
    PRIVATE_KEY,
    privateKey
  );
};

// Load Public Key
export const loadPublicKey = () => {
  return localStorage.getItem(
    PUBLIC_KEY
  );
};

// Load Private Key
export const loadPrivateKey = () => {
  return localStorage.getItem(
    PRIVATE_KEY
  );
};

// Clear Keys
export const clearKeys = () => {
  localStorage.removeItem(
    PUBLIC_KEY
  );

  localStorage.removeItem(
    PRIVATE_KEY
  );
};