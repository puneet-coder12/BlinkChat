import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // content: {
    //   type: String,
    //   required: true,
    // },

    encryptedContent: {
      type: String,
      required: true,
    },

   encryptedKeys: {
  sender: {
    type: String,
    required: true,
  },

  receiver: {
    type: String,
    required: true,
  },
},

    iv: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
