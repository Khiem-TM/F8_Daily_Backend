import { registerRequestSchema } from "../schemas/auth.schema";
import { NextFunction, Request, Response } from "express";

export const validateRegisterRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = registerRequestSchema.safeParse(req.body);

  //   Trong case data k oke --> result.success = false
  if (!result.success) {
    // Lấy error details từ Zod
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: errors,
    });
  }

  next();
};
