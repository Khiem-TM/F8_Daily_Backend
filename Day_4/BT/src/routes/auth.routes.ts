import { Router } from "express";

import { register } from "../controllers/auth.routes";
import { validateRegisterRequest } from "../middlewares/validate.middleware";

// Khởi tạo router
const router = Router();

// Cho đi qua validateRegisterRequest trước khi vào controller register
router.post("/auth/register", validateRegisterRequest, register);

export default router;
