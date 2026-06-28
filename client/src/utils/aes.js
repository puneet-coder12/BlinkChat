import CryptoJS from "crypto-js";

export const generateAESKey = () => {
  return CryptoJS.lib.WordArray.random(32).toString();
};

export const generateIV = () => {
  return CryptoJS.lib.WordArray.random(16).toString();
};

export const encryptMessage = (
  message,
  key,
  iv
) => {
  return CryptoJS.AES.encrypt(
    message,
    CryptoJS.enc.Hex.parse(key),
    {
      iv: CryptoJS.enc.Hex.parse(iv),
    }
  ).toString();
};

export const decryptMessage = (
  encryptedMessage,
  key,
  iv
) => {
  const bytes = CryptoJS.AES.decrypt(
    encryptedMessage,
    CryptoJS.enc.Hex.parse(key),
    {
      iv: CryptoJS.enc.Hex.parse(iv),
    }
  );

  return bytes.toString(
    CryptoJS.enc.Utf8
  );
};