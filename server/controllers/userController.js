import User from "../models/User.js";

export const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.q;

    const users = await User.find({
      $and: [
        {
          _id: {
            $ne: req.user._id,
          },
        },
        {
          username: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};