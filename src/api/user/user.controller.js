const User = require("./user.model");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../../utils/responseHandler");

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const limitNum = parseInt(limit, 10);
    const pageNum = Math.max(1, parseInt(page, 10));

    const skip = (pageNum - 1) * limitNum;

    const searchTerm = search.trim() || null;

    let searchQuery = {};

    if (searchTerm) {
      searchQuery.$or = [
        {
          email: { $regex: search, $options: "i" },
        },
      ];
    }

    const total = await User.countDocuments(searchQuery);

    const pipeline = [];

    if (searchTerm) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
          ],
        },
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "userId",
          as: "posts",
        },
      },
      {
        $project: {
          _id: 1,
          email: 1,
          name: 1,
          createdAt: 1,
          updatedAt: 1,
          posts: {
            $map: {
              input: "$posts",
              as: "post",
              in: {
                title: "$$post.title",
                description: "$$post.description",
                createdAt: "$$post.createdAt",
                updatedAt: "$$post.updatedAt",
              },
            },
          },
        },
      }
    );

    pipeline.push({
      $sort: {
        createdAt: -1,
      },
    });

    pipeline.push({ $skip: skip }, { $limit: limitNum });

    const result = await User.aggregate(pipeline);

    return sendSuccessResponse(
      res,
      {
        pagination: {
          total,
          totalPages: Math.ceil(total / limitNum),
          currentPage: pageNum,
        },
        data: result,
      },
      "User data fetched",
      200
    );
  } catch (error) {
    sendErrorResponse(res, error.message || "Failed to fetch users", 400);
  }
};
