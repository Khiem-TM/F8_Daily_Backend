module.exports = (req, res, next) => {
  console.log(`hello auth`);
  req.user = "Truong Khiem";
  res.locals.user = req.user; // Thêm thông tin user vào res.locals --> Middleware có thể sửa đổi response trước khi chuyển đến controller
  next();
};
