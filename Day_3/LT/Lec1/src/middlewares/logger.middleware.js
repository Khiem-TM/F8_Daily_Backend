module.exports = (req, res, next) => {
  console.log(`hello`);
  req.user = "F8"; // Thêm thông tin user vào request --> Middleware có thể sửa đổi request trước khi chuyển đến controller
  next();
};
