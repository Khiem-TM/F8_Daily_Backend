const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller.js");
const homeController = require("../controllers/home.controller.js");
const productController = require("../controllers/product.controller.js");
const loggerMiddleware = require("../middlewares/logger.middleware.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

router.use(loggerMiddleware); // Sử dụng middleware cho tất cả các route

router.get("/users", userController.index);

router.use(authMiddleware); // Sử dụng middleware auth cho route /home và /products
router.get("/home", homeController.index);
router.get("/products", productController.index);

module.exports = router;
