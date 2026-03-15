import { Router } from "express";

import { homeController } from "../controllers/home.controller";
import { userController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { userSchema as createUserSchema } from "../validators/createUser.validate";
const router = Router();

router.get("/", homeController.index);
router.post("/users", validate(createUserSchema), userController.create);

export default router;
