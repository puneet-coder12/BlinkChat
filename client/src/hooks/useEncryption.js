import {
  generateAESKey,
  encryptMessage,
  decryptMessage,
  encryptAESKey,
  decryptAESKey,
  importPublicKey,
  importPrivateKey,
  loadPrivateKey,
} from "../crypto";

/**
 * Encrypt a message for a conversation
 */
export const encryptForConversation = async (
  text,
  conversation,
  currentUserId,
) => {
  const sender = conversation.participants.find(
    (user) => user._id === currentUserId,
  );

  const receiver = conversation.participants.find(
    (user) => user._id !== currentUserId,
  );

  if (!sender || !receiver) {
    throw new Error("Conversation participants not found");
  }

  const aesKey = await generateAESKey();

  const { encryptedContent, iv } = await encryptMessage(
    text,
    aesKey,
  );

  const senderPublicKey = await importPublicKey(
    sender.publicKey,
  );

  const receiverPublicKey =
    await importPublicKey(receiver.publicKey);

  const senderEncryptedKey =
    await encryptAESKey(aesKey, senderPublicKey);

  const receiverEncryptedKey =
    await encryptAESKey(aesKey, receiverPublicKey);

  return {
    encryptedContent,

    encryptedKeys: {
      sender: senderEncryptedKey,
      receiver: receiverEncryptedKey,
    },

    iv,
  };
};

/**
 * Decrypt a message
 */
export const decryptConversationMessage =
  async (
    message,
    currentUserId,
  ) => {
    const senderId =
      typeof message.senderId === "string"
        ? message.senderId
        : message.senderId._id;

    const encryptedKey =
      senderId === currentUserId
        ? message.encryptedKeys.sender
        : message.encryptedKeys.receiver;

    const privateKey =
      await importPrivateKey(
        loadPrivateKey(),
      );

    const aesKey =
      await decryptAESKey(
        encryptedKey,
        privateKey,
      );

    return await decryptMessage(
      message.encryptedContent,
      aesKey,
      message.iv,
    );
  };