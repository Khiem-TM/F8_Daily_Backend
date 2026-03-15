// middleware check xem người dùng đã đăng nhập hay chưa

const authMiddleware = {
  requireLogin(req, res, next) {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    next();
  },
  requireLoggedIn(req, res, next) {
    if (req.session.user) {
      return res.redirect("/");
    }
    next();
  },
};

module.exports = authMiddleware;

