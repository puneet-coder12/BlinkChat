import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import { getIO } from "../socket/io.js";

export const sendMessage = async (req, res) => {
  try {
    const {
      conversationId,
      encryptedContent,
      encryptedKeys,
      iv,
    } = req.body;

    // Check conversation exists
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    // Authorization
    const isParticipant = conversation.participants.some(
      (participant) =>
        participant.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const message = await Message.create({
      conversationId,
      senderId: req.user._id,
      encryptedContent,
      encryptedKeys,
      iv,
    });

    conversation.lastMessage = message._id;
    conversation.updatedAt = new Date();

    await conversation.save();

    const populatedMessage = await Message.findById(
      message._id
    ).populate(
      "senderId",
      "_id username publicKey"
    );

    const io = getIO();

io.to(conversationId).emit(
  "receive_message",
  populatedMessage
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

    // Check conversation exists
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    // Authorization
    const isParticipant = conversation.participants.some(
      (participant) =>
        participant.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const messages = await Message.find({
      conversationId,
    })
      .populate(
        "senderId",
        "_id username publicKey"
      )
      .sort({
        createdAt: 1,
      });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};