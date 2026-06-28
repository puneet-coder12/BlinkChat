import axiosInstance from "../lib/axios";

export const getConversations = async () => {
  const response = await axiosInstance.get(
    "/conversations"
  );

  return response.data;
};

export const createConversation =
  async (receiverId) => {
    const response =
      await axiosInstance.post(
        "/conversations",
        {
          receiverId,
        }
      );

    return response.data;
  };