import { Request, Response } from "express";
import authService from "../services/auth.service";

export const register = (req: Request, res: Response) => {
  try {
    const { email, password, fullname } = req.body;
    const newUser = authService.register(email, password, fullname);

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: newUser,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Đăng ký thất bại",
    });
  }
};
