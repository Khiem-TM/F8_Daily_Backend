import { Request, Response } from "express";

export const userController = {
  create: (req: Request, res: Response) => {
    const { name, email, age } = req.body;
    res.status(201).json({
      message: "User created successfully",
      user: {
        name,
        email,
        age,
        password: req.body.password,
      },
    });
  },
};
