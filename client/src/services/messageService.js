import axiosInstance from "../lib/axios";

export const getMessages = async (
  conversationId
) => {
  const response = await axiosInstance.get(
    `/messages/${conversationId}`
  );

  return response.data;
};

export const sendMessage = async (
  data
) => {
  const response =
    await axiosInstance.post(
      "/messages",
      data
    );

  return response.data;
};