import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, encryptedContent, encryptedKeys, iv } = req.body;

    const message = await Message.create({
      conversationId,
      senderId: req.user._id,
      encryptedContent,
      encryptedKeys,
      iv,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: new Date(),
    });

    // Return populated message
    const populatedMessage = await Message.findById(message._id).populate(
      "senderId",
      "_id username publicKey",
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({
      conversationId,
    })
      .populate("senderId", "username _id publicKey")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
