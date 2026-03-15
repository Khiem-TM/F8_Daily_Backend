const userService = require("../services/user.service.js");
const { successResponse } = require("../utils/response.js");

module.exports = {
  index: (req, res) => {
    // Tiếp nhận request

    // Gọi service
    const users = userService.getUsers();
    // return successResponse(res, users, "Get users successfully");
    const status = false;
    return res.render("users/index", { users, status });
  },
  find: (req, res) => {
    const user = userService.getUser(req.params.id);
    res.render("users/detail", { user });
  },
};
