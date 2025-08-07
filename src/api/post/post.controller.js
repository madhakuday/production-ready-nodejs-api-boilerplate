const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../../utils/responseHandler");
const User = require("../user/user.model");
const Post = require("./post.model");

exports.getAllPost = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const limitNum = parseInt(limit, 10);
    const pageNum = Math.max(1, parseInt(page, 10));

    const skip = (pageNum - 1) * limitNum;

    let searchQuery = {};

    if (search.trim()) {
      searchQuery.$or = [
        {
          title: { $regex: search, $options: "i" },
        },
      ];
    }

    const total = await Post.countDocuments(searchQuery);
    const result = await Post.find(searchQuery)
      .populate({
        path: "userId",
        select: "email name createdAt updatedAt",
      })
      .limit(limitNum)
      .skip(skip)
      .sort({
        createdAt: -1,
      });

    sendSuccessResponse(
      res,
      {
        pagination: {
          total,
          totalPages: Math.ceil(total / limitNum),
          currentPage: pageNum,
        },
        data: result,
      },
      "Posts fetched",
      200
    );
  } catch (error) {
    sendErrorResponse(res, error.message || "Failed to fetch Posts", 400);
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, userId, description } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return sendErrorResponse(res, "User not found", 404);
    }

    const post = new Post({
      title,
      description,
      userId,
    });
    await post.save();
    return sendSuccessResponse(res, post, "Post created successfully.");
  } catch (error) {
    sendErrorResponse(res, error?.message || "Failed to create Post", 400);
  }
};
