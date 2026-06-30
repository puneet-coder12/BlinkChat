import Conversation from "../models/Conversation.js";

export const createConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    }).populate("participants", "username email profilePic publicKey");

    if (conversation) {
      return res.status(200).json(conversation);
    }

    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });

    conversation = await Conversation.findById(conversation._id).populate(
      "participants",
      "username email profilePic publicKey",
    );

    res.status(201).json(conversation);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getMyConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "username email profilePic publicKey")
      .populate(
        "lastMessage",
        "encryptedContent encryptedKeys iv senderId createdAt",
      )
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
