const { successResponse } = require("../utils/response.js");

module.exports = {
  upload: (req, res) => {
    const host = req.get("host");
    return successResponse(res, {
      // frontend sẽ nhận được url và nạp lên thẻ img để hiển thị ảnh
      url: req.protocol + "://" + host + "/api/upload/" + req.file.filename,
    });
  },
};
