const authService = require("../services/auth.services");

const authController = {
  getHome(req, res) {
    res.render("home/index", {
      title: "Trang chủ",
      user: req.session.user,
    });
  },

  getLogin(req, res) {
    const logoutMessage = req
  },
};

module.exports = authController;
