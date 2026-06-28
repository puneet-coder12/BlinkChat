import axiosInstance from "../lib/axios";

export const searchUsers = async (
  query
) => {
  const response =
    await axiosInstance.get(
      `/users/search?q=${query}`
    );

  return response.data;
};