const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = process.cwd() + "/uploads";
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"), false);
    }
    const random = Math.random() + Date.now() + "";
    // Nhiệm vụ là làm đổi tên thật của file ảnh --> hashing
    const filename = crypto.createHash("md5").update(random).digest("hex");
    const ext = path.extname(file.originalname);
    const newFile = `${filename}${ext}`;
    cb(null, newFile);
  },
});

module.exports = multer({ storage: storage });
